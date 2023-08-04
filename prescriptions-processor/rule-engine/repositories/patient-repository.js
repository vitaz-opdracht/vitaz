const db = require('./db');

function getPatientSex(patientId) {
    return db.prepare('SELECT geslacht FROM patient WHERE id = ?').pluck().get(patientId);
}

function getPatientBirthDate(patientId) {
    return db.prepare('SELECT gebdat FROM patient WHERE id = ?').pluck().get(patientId);
}

function getPatientAttributeValue(attributeId, patientId, date) {
    return db.prepare(`
        SELECT intvalue FROM patient p
            INNER JOIN dossier d ON p.id = d.patid
            INNER JOIN dossierattribute da ON d.id = da.dossierid
        WHERE p.id = ? AND da.attributeid = ?
            AND ? BETWEEN da.datefrom AND (CASE WHEN da.dateend IS NULL THEN DATE('now') ELSE da.dateend END);
    `).pluck().get(patientId, attributeId, date);
}

function getPatientWeight(patientId, date) {
    return getPatientAttributeValue(3, patientId, date);
}

function getPatientPregnant(patientId, date) {
    return getPatientAttributeValue(1, patientId, date);
}

function isPatientAlive(patientId) {
    return db.prepare('SELECT datoverlijden FROM patient WHERE id = ?').pluck().get(patientId) == null;
}

module.exports = {
    getPatientSex,
    getPatientBirthDate,
    getPatientWeight,
    getPatientPregnant,
    isPatientAlive,
};
