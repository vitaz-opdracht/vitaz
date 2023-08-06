const amqp = require('amqplib');

function registerProcessCloseHandler(connection) {
    process.on('SIGINT', async () => {
        await connection.close();
        process.exit(0);
    });
}

/**
 * Calls the specified handler and provides the option to acknowledge or reject a message
 *      ack removes the incoming message from the queue
 *      reject moves the incoming message to the dead letter queue
 * */
function handleWithFeedback(channel, handler) {
    return (message) => {
        const ack = () => channel.ack(message);
        const reject = () => channel.reject(message, false);

        try {
            const prescription = JSON.parse(message.content.toString());
            handler(prescription, ack, reject);
        } catch (e) {
            console.error("Couldn't parse prescription JSON, sending to dead letter queue");
            reject();
        }
    };
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
    const connection = await amqp.connect(`amqp://guest:guest@${process.env.AMQP_HOST || 'localhost'}:5672`);
    const channel = await connection.createConfirmChannel();
    return {connection, channel};
}

/**
 * Initializes the RabbitMQ connection and registers the channel message handlers
 * The callback parameters pass the incoming prescription,
 * an ack function that removes the incoming message from the queue,
 * and a reject function that moves the incoming message to the dead letter queue
 *
 * @param acceptedPrescriptionHandler callback which gets invoked when there is an accepted prescription
 * @param rejectedPrescriptionHandler callback which gets invoked when there is a rejected prescription
 * */
async function init({acceptedPrescriptionHandler, rejectedPrescriptionHandler}) {
    const {connection, channel} = await retry(buildConnection, 1000);

    /* Close AMQP connection when node.js process exits */
    registerProcessCloseHandler(connection);

    channel.consume('accepted_prescriptions_queue', handleWithFeedback(channel, acceptedPrescriptionHandler));

    channel.consume('rejected_prescriptions_queue', handleWithFeedback(channel, rejectedPrescriptionHandler));
}

module.exports = {
    init,
};
