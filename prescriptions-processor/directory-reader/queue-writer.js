const fs = require('fs');
const amqp = require("amqplib");

const maxOpenFileCount = 1000;
let openFileCount = 0;
const prescriptionPaths = [];

function registerProcessCloseHandler(connection) {
    process.on('SIGINT', async () => {
        await connection.close();
        process.exit(0);
    });
}

function movePathsToQueue(channel) {
    return () => {
        if (openFileCount >= maxOpenFileCount) {
            return;
        }

        const amountOfPathsToTake = Math.min(prescriptionPaths.length, maxOpenFileCount - openFileCount);
        const paths = prescriptionPaths.splice(0, amountOfPathsToTake);

        for (const path of paths) {
            openFileCount += 1;

            try {
                const content = fs.readFileSync(path, 'utf-8');

                channel.publish('prescriptions_exchange', 'raw', Buffer.from(content), {persistent: true}, () => {
                    fs.rmSync(path);
                    openFileCount -= 1;
                });
            } catch (e) {
                console.error(e);
            }
        }
    };
}

async function init() {
    const {connection, channel} = await retry(buildConnection, 1000);

    /* Close AMQP connection when node.js process exits */
    registerProcessCloseHandler(connection);

    setInterval(movePathsToQueue(channel), 1);
}

async function retry(functionalityToRetry, retryDelay) {
    while (true) {
        try {
            return await functionalityToRetry();
        } catch {
            await new Promise((resolve) => {
                setTimeout(resolve, retryDelay);
            });
        }
    }
}

async function buildConnection() {
    const connection = await amqp.connect(`amqp://guest:guest@${process.env.AMQP_HOST || 'localhost'}:5672`);
    const channel = await connection.createConfirmChannel();
    return {connection, channel};
}

function addFileToQueue(path) {
    const randomTimeout = 100;//Math.round(Math.random() * 5000) + 5000;
    setTimeout(() => prescriptionPaths.push(path), randomTimeout);
}

module.exports = {
    init,
    addFileToQueue,
};
