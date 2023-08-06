const {Client} = require('pg');

async function createAndFillFrequenciesTable(db) {
    await db.query(`
        CREATE TABLE frequentie (
            id SERIAL PRIMARY KEY,
            frequentie TEXT NOT NULL
        );
    `);
    await db.query(`
        INSERT INTO frequentie (frequentie) VALUES
            ('1x daags na ontbijt'),
            ('1x daags voor het middageten'),
            ('1x daags na het middageten'),
            ('1x daags bij het avondmaal'),
            ('1x daags, ''s avonds'),
            ('2x daags, bij ontbijt en avondmaal'),
            ('1x daags, 2h voor het slapen'),
            ('3x per dag na het eten');
    `);
}

async function createAndFillRulesTable(db) {
    await db.query(`
        CREATE TABLE regel (
            id TEXT PRIMARY KEY,
            description TEXT NOT NULL,
            enabled INTEGER NOT NULL,
            rule_order INTEGER NOT NULL
        );
    `);
    await db.query(`
        INSERT INTO regel (id, description, enabled, rule_order) VALUES
            ('sex', 'Prescribed medicine for the wrong sex', 1, 0),
            ('age', 'Patient''s age out of range for the prescribed medicine', 1, 1),
            ('weight', 'Patient''s weight out of range for the prescribed medicine', 1, 2),
            ('specialism', 'Medicine prescribed by doctor of wrong specialty', 1, 3),
            ('pregnant', 'Prescribed medicine may not be taken when pregnant', 1, 4),
            ('alive', 'Patient is dead', 1, 5);
    `);
}

async function createPrescriptionsTable(db) {
    await db.query(`
        CREATE TABLE IF NOT EXISTS voorschrift (
            id TEXT PRIMARY KEY,
            patient INTEGER,
            voorschrijver INTEGER,
            datum DATE,
            geldig INTEGER,
            FOREIGN KEY (patient) REFERENCES patient(id),
            FOREIGN KEY (voorschrijver) REFERENCES arts(id)
        );
    `);
}

async function createPrescribedMedicationTable(db) {
    await db.query(`
        CREATE TABLE IF NOT EXISTS voorgeschreven_medicatie (
            id SERIAL PRIMARY KEY,
            voorschrift TEXT,
            medicatie INTEGER,
            aantal INTEGER,
            frequentie INTEGER,
            FOREIGN KEY (voorschrift) REFERENCES voorschrift(id),
            FOREIGN KEY (medicatie) REFERENCES artikel(id),
            FOREIGN KEY (frequentie) REFERENCES frequentie(id)
        )
    `);
}

async function createPrescriptionRuleViolationTable(db) {
    await db.query(`
        CREATE TABLE IF NOT EXISTS voorschrift_regel_overtreding (
            id SERIAL PRIMARY KEY,
            voorschrift TEXT,
            regel TEXT,
            FOREIGN KEY (voorschrift) REFERENCES voorschrift(id),
            FOREIGN KEY (regel) REFERENCES regel(id)
        )
    `);
}

async function addAllowPregnantToMedicineTable(db) {
    await db.query(`ALTER TABLE artikel ADD COLUMN allowpregnant INT DEFAULT 0;`);
}

async function addRandomPregnantData(db) {
    await db.query(`
        UPDATE artikel
        SET allowpregnant = (SELECT ROUND(RANDOM()))
        WHERE allowfemale = 1;
    `);
}

async function addPregnancyDataForTesting(db) {
    /* There are no woman who are pregnant and have a weight and length attribute, so we have to manipulate the data */
    await db.query(`
        INSERT INTO dossierattribute (dossierid, attributeid, datefrom, dateend, intvalue, strvalue) VALUES
            (12999, 3, '2023-07-01', null, 55, null),
            (12999, 4, '2023-06-23', null, 175, null);
    `);

    await db.query(`
        UPDATE artikel
        SET allowpregnant = 1
        WHERE artikel IN ('ANAPA ', 'AMANDELOLIE-ZOETE', 'RA INFUSOR');
    `);

    await db.query(`
        UPDATE artikel
        SET allowpregnant = 0
        WHERE artikel = 'DOS MEDICAL NASAAL SPOELZOUT';
    `);
}

async function setupDatabase(db) {
    await createAndFillFrequenciesTable(db);
    await createAndFillRulesTable(db);
    await createPrescriptionsTable(db);
    await createPrescribedMedicationTable(db);
    await createPrescriptionRuleViolationTable(db);
    await addAllowPregnantToMedicineTable(db);
    await addRandomPregnantData(db);
    await addPregnancyDataForTesting(db);
    await db.end();
}

async function initDatabaseConnection() {
    const client = new Client({
        user: 'postgres',
        password: 'postgres',
        host: 'postgres',
        database: 'db',
        port: 5432
    });
    await client.connect();
    return client;
}

initDatabaseConnection().then(async (client) => await setupDatabase(client));
