const path = require("path");
const db = require('better-sqlite3')(path.join(__dirname, '../../emb.db'));
db.pragma('journal_mode = WAL');

const frequencies = [
    '1x daags na ontbijt',
    '1x daags voor het middageten',
    '1x daags na het middageten',
    '1x daags bij het avondmaal',
    "1x daags, 's avonds",
    '2x daags, bij ontbijt en avondmaal',
    '1x daags, 2h voor het slapen',
    '3x per dag na het eten',
];

function addPrescriptionToDb(prescription, valid) {
    const insertPrescription = db.prepare('INSERT INTO voorschrift (id, patient, voorschrijver, datum, geldig) VALUES (?, ?, ?, ?, ?)');
    const insertPrescribedMedication = db.prepare('INSERT INTO voorgeschreven_medicatie (voorschrift, medicatie, aantal, frequentie) VALUES (?, ?, ?, ?)');

    const transaction = db.transaction((data, valid) => {
        const {
            id: prescriptionId,
            patient: {id: patientId},
            prescriber: {id: prescriberId},
            date,
            medication: medicationList
        } = data;

        insertPrescription.run(prescriptionId, patientId, prescriberId, date, Number(valid));

        for (const medication of medicationList) {
            insertPrescribedMedication.run(prescriptionId, medication.id, medication.aantal, frequencies.indexOf(medication.frequency) + 1);
        }
    });

    transaction(prescription, valid);
}

function addPrescriptionRuleViolationsToDb(prescriptionId, violations) {
    const insertPrescriptionRuleViolation = db.prepare('INSERT INTO voorschrift_regel_overtreding (voorschrift, regel) VALUES (?, ?)');

    const transaction = db.transaction((prescriptionId, violations) => {
        for (const violation of violations) {
            insertPrescriptionRuleViolation.run(prescriptionId, violation);
        }
    });

    transaction(prescriptionId, violations);
}

module.exports = {
    addPrescriptionToDb,
    addPrescriptionRuleViolationsToDb
};
