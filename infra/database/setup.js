const path = require("path");
const db = require('better-sqlite3')(path.join('/host/emb.db'));
db.pragma('journal_mode = WAL');

function resetToInitialState() {
    tryFailSilently(() => db.exec('DROP TABLE IF EXISTS voorgeschreven_medicatie;'));
    tryFailSilently(() => db.exec('DROP TABLE IF EXISTS voorschrift_regel_overtreding;'));
    tryFailSilently(() => db.exec('DROP TABLE IF EXISTS voorschrift;'));
    tryFailSilently(() => db.exec('DROP TABLE IF EXISTS frequentie;'));
    tryFailSilently(() => db.exec('DROP TABLE IF EXISTS regel;'));
    tryFailSilently(() => db.exec('ALTER TABLE artikel DROP COLUMN allowpregnant;'));
    tryFailSilently(() => db.exec('DELETE FROM dossierattribute WHERE dossierid = 12999 AND attributeid IN (3, 4);'));
}

function tryFailSilently(fn) {
    try {
        fn();
    } catch (e) {
    }
}

function createAndFillFrequenciesTable() {
    db.exec(`
        CREATE TABLE frequentie (
            id INTEGER PRIMARY KEY,
            frequentie TEXT NOT NULL
        );
    `);
    db.exec(`
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

function createAndFillRulesTable() {
    db.exec(`
        CREATE TABLE regel (
            id TEXT PRIMARY KEY,
            description TEXT NOT NULL,
            enabled INTEGER NOT NULL,
            rule_order INTEGER NOT NULL
        );
    `);
    db.exec(`
        INSERT INTO regel (id, description, enabled, rule_order) VALUES
            ('sex', 'Prescribed medicine for the wrong sex', 1, 0),
            ('age', 'Patient''s age out of range for the prescribed medicine', 1, 1),
            ('weight', 'Patient''s weight out of range for the prescribed medicine', 1, 2),
            ('specialism', 'Medicine prescribed by doctor of wrong specialty', 1, 3),
            ('pregnant', 'Prescribed medicine may not be taken when pregnant', 1, 4),
            ('alive', 'Patient is dead', 1, 5);
    `);
}

function createPrescriptionsTable() {
    db.exec(`
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

function createPrescribedMedicationTable() {
    db.exec(`
        CREATE TABLE IF NOT EXISTS voorgeschreven_medicatie (
            id INTEGER PRIMARY KEY,
            voorschrift INTEGER,
            medicatie INTEGER,
            aantal INTEGER,
            frequentie INTEGER,
            FOREIGN KEY (voorschrift) REFERENCES voorschrift(id),
            FOREIGN KEY (medicatie) REFERENCES artikel(id),
            FOREIGN KEY (frequentie) REFERENCES frequentie(id)
        )
    `);
}

function createPrescriptionRuleViolationTable() {
    db.exec(`
        CREATE TABLE IF NOT EXISTS voorschrift_regel_overtreding (
            id INTEGER PRIMARY KEY,
            voorschrift INTEGER,
            regel INTEGER,
            FOREIGN KEY (voorschrift) REFERENCES voorschrift(id),
            FOREIGN KEY (regel) REFERENCES regel(id)
        )
    `);
}

function addAllowPregnantToMedicineTable() {
    db.exec(`ALTER TABLE artikel ADD allowpregnant INT DEFAULT 0;`);
}

function addRandomPregnantData() {
    db.exec(`
        UPDATE artikel
        SET allowpregnant = ABS(RANDOM()) % 2
        WHERE allowfemale = 1;
    `);
}

function addPregnancyDataForTesting() {
    /* There are no woman who are pregnant and have a weight and length attribute, so we have to manipulate the data */
    db.exec(`
        INSERT INTO dossierattribute (dossierid, attributeid, datefrom, dateend, intvalue, strvalue) VALUES
            (12999, 3, '2023-07-01', null, 55, null),
            (12999, 4, '2023-06-23', null, 175, null);
    `);

    db.exec(`
        UPDATE artikel
        SET allowpregnant = 1
        WHERE artikel IN ('ANAPA ', 'AMANDELOLIE-ZOETE', 'RA INFUSOR');
    `);

    db.exec(`
        UPDATE artikel
        SET allowpregnant = 0
        WHERE artikel = 'DOS MEDICAL NASAAL SPOELZOUT';
    `);
}

function setupDatabase() {
    resetToInitialState();
    createAndFillFrequenciesTable();
    createAndFillRulesTable();
    createPrescriptionsTable();
    createPrescribedMedicationTable();
    createPrescriptionRuleViolationTable();
    addAllowPregnantToMedicineTable();
    addRandomPregnantData();
    addPregnancyDataForTesting();
    db.close();
}

setupDatabase();
