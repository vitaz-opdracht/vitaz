const queueReaderWriter = require('./queue-reader-writer');
const {initDatabaseConnection, addPrescriptionToDb, addPrescriptionRuleViolationsToDb} = require("./db");

initDatabaseConnection().then(async () => {
    await queueReaderWriter.init({
        acceptedPrescriptionHandler: (prescription, ack, reject) => {
            try {
                addPrescriptionToDb(prescription, true);
                ack();
            } catch (e) {
                reject();
            }
        },
        rejectedPrescriptionHandler: ({prescription, violations}, ack, reject) => {
            try {
                addPrescriptionToDb(prescription, false);
                addPrescriptionRuleViolationsToDb(prescription.id, violations);
                ack();
            } catch (e) {
                reject();
            }
        }
    });
});
