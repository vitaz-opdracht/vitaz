const amqp = require('amqplib');
const {check} = require('./prescription-validator');

async function handleIncomingMessage(data, channel) {
    return new Promise((resolve) => {
        const validationResult = check(data);

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

async function buildConnection() {
    const connection = await amqp.connect('amqp://guest:guest@localhost:5672');
    const channel = await connection.createConfirmChannel();
    return {connection, channel};
}

(async () => {
    const {connection, channel} = await retry(buildConnection, 1000);

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
        await connection.close();
        process.exit(0);
    });
})();
