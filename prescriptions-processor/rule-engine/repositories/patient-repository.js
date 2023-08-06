const query = require('./db').query;

async function getPatientSex(patientId) {
    return (await query({text: 'SELECT geslacht FROM patient WHERE id = $1', values: [patientId]})).rows[0]?.geslacht;
}

async function getPatientBirthDate(patientId) {
    return (await query({text: 'SELECT gebdat FROM patient WHERE id = $1', values: [patientId]})).rows[0]?.gebdat;
}

async function getPatientAttributeValue(attributeId, patientId, date) {
    return (await query({
        text: `
            SELECT intvalue FROM patient p
                INNER JOIN dossier d ON p.id = d.patid
                INNER JOIN dossierattribute da ON d.id = da.dossierid
            WHERE p.id = $1 AND da.attributeid = $2
                AND $3 BETWEEN da.datefrom AND (CASE WHEN da.dateend IS NULL THEN DATE('now') ELSE da.dateend END);
        `,
            values: [patientId, attributeId, date]
    })).rows[0]?.intvalue;
}

async function getPatientWeight(patientId, date) {
    return await getPatientAttributeValue(3, patientId, date);
}

async function getPatientPregnant(patientId, date) {
    return await getPatientAttributeValue(1, patientId, date);
}

async function isPatientAlive(patientId) {
    return (await query({text: 'SELECT datoverlijden FROM patient WHERE id = $1', values: [patientId]})).rows[0]?.datoverlijden == null;
}

module.exports = {
    getPatientSex,
    getPatientBirthDate,
    getPatientWeight,
    getPatientPregnant,
    isPatientAlive,
};
