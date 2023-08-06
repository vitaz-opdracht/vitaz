const {Client} = require('pg');
let db;

async function initDatabaseConnection() {
    db = new Client({
        user: 'postgres',
        password: 'postgres',
        host: process.env.DATABASE_HOST || 'localhost',
        database: 'db',
        port: 5432
    });
    await db.connect();
}

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

async function addPrescriptionToDb(prescription, valid) {
    const {
        id: prescriptionId,
        patient: {id: patientId},
        prescriber: {id: prescriberId},
        date,
        medication: medicationList
    } = prescription;

    try {
        await db.query('BEGIN');

        await db.query({
            text: 'INSERT INTO voorschrift (id, patient, voorschrijver, datum, geldig) VALUES ($1, $2, $3, $4, $5)',
            values: [prescriptionId, patientId, prescriberId, date, Number(valid)]
        });

        for (const medication of medicationList) {
            await db.query({
                text: 'INSERT INTO voorgeschreven_medicatie (voorschrift, medicatie, aantal, frequentie) VALUES ($1, $2, $3, $4)',
                values: [prescriptionId, medication.id, medication.aantal, frequencies.indexOf(medication.frequency) + 1]
            });
        }

        await db.query('COMMIT');
    } catch (err) {
        await db.query('ROLLBACK');
        throw err;
    }
}

async function addPrescriptionRuleViolationsToDb(prescriptionId, violations) {
    try {
        await db.query('BEGIN');

        for (const violation of violations) {
            await db.query({
                text: 'INSERT INTO voorschrift_regel_overtreding (voorschrift, regel) VALUES ($1, $2)',
                values: [prescriptionId, violation]
            });
        }

        await db.query('COMMIT');
    } catch (err) {
        await db.query('ROLLBACK');
        throw err;
    }
}

module.exports = {
    initDatabaseConnection,
    addPrescriptionToDb,
    addPrescriptionRuleViolationsToDb
};
