const amqp = require('amqplib');
const {initDatabaseConnection, db} = require('./repositories/db');

const {check} = require('./prescription-validator');
async function handleIncomingMessage(data, channel) {
    return new Promise(async (resolve) => {
        const validationResult = await check(data);

        if (validationResult.valid) {
            channel.publish('prescriptions_exchange', 'accepted', Buffer.from(JSON.stringify(validationResult.data)), {persistent: true}, () => resolve());
        } else {
            channel.publish('prescriptions_exchange', 'rejected', Buffer.from(JSON.stringify(validationResult.data)), {persistent: true}, () => resolve());
        }
    });
}

async function retry(functionalityToRetry, retryDelay) {
    while (true) {
        try {
            return await functionalityToRetry();
        } catch {
            await new Promise((resolve) => setTimeout(resolve, retryDelay));
        }
    }
}

async function buildAmqpConnection() {
    const connection = await amqp.connect(`amqp://guest:guest@${process.env.AMQP_HOST || 'localhost'}:5672`);
    const channel = await connection.createConfirmChannel();
    return {connection, channel};
}

(async () => {
    await retry(initDatabaseConnection, 1000);
    const {amqpConnection, channel} = await retry(buildAmqpConnection, 1000);

    channel.consume('raw_prescriptions_queue', async (message) => {
        if (message !== null) {
            try {
                const jsonData = JSON.parse(message.content.toString());
                await handleIncomingMessage(jsonData, channel);
                channel.ack(message);
            } catch (e) {
                console.error(e);
                channel.reject(message, false);
            }
        }
    });

    process.on('SIGINT', async () => {
        await amqpConnection.close();
        await db.end();
        process.exit(0);
    });
})();
