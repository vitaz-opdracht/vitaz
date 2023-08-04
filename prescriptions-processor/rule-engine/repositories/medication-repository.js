const db = require('./db');

function getMedicationAllowedSex(medicationIds) {
    return db.prepare(`
        SELECT allowmale, allowfemale
        FROM artikel
        WHERE id IN (${medicationIds.map((id) => `'${id}'`).join(',')})
    `).all();
}

function getMedicationAllowedAge(medicationIds) {
    return db.prepare(`
        SELECT artikel, id, minage, maxage
        FROM artikel
        WHERE id IN (${medicationIds.map((id) => `'${id}'`).join(',')})
    `).all().map((medicine) => ({
        ...medicine,
        minage: Number(medicine.minage),
        maxage: Number(medicine.maxage)
    }));
}

function getMedicationSpecialisms(medicationIds) {
    return db.prepare(`
        SELECT GROUP_CONCAT(specid) AS specids
        FROM artikelspecialisme
        WHERE artikelid IN (${medicationIds.map((id) => `'${id}'`).join(',')})
        GROUP BY artikelid
    `).all();
}

function getMedicationMinWeight(medicationIds) {
    return db.prepare(`
        SELECT minweight
        FROM artikel
        WHERE id IN (${medicationIds.map((id) => `'${id}'`).join(',')})
    `).all();
}

function getMedicationAllowPregnant(medicationIds) {
    return db.prepare(`
        SELECT allowpregnant
        FROM artikel
        WHERE id IN (${medicationIds.map((id) => `'${id}'`).join(',')})`
    ).all();
}

module.exports = {
    getMedicationAllowedSex,
    getMedicationAllowedAge,
    getMedicationSpecialisms,
    getMedicationMinWeight,
    getMedicationAllowPregnant,
};
