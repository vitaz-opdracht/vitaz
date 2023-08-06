const query = require('./db').query;

async function getMedicationAllowedSex(medicationIds) {
    return (await query(`
        SELECT allowmale, allowfemale
        FROM artikel
        WHERE id IN (${medicationIds.map((id) => `'${id}'`).join(',')})
    `)).rows;
}

async function getMedicationAllowedAge(medicationIds) {
    return (await query(`
        SELECT artikel, id, minage, maxage
        FROM artikel
        WHERE id IN (${medicationIds.map((id) => `'${id}'`).join(',')})
    `)).rows.map((medicine) => ({
        ...medicine,
        minage: Number(medicine.minage),
        maxage: Number(medicine.maxage)
    }));
}

async function getMedicationSpecialisms(medicationIds) {
    return (await query(`
        SELECT STRING_AGG(specid::text, ',') AS specids
        FROM artikelspecialisme
        WHERE artikelid IN (${medicationIds.map((id) => `'${id}'`).join(',')})
        GROUP BY artikelid
    `)).rows;
}

async function getMedicationMinWeight(medicationIds) {
    return (await query(`
        SELECT minweight
        FROM artikel
        WHERE id IN (${medicationIds.map((id) => `'${id}'`).join(',')})
    `)).rows;
}

async function getMedicationAllowPregnant(medicationIds) {
    return (await query(`
        SELECT allowpregnant
        FROM artikel
        WHERE id IN (${medicationIds.map((id) => `'${id}'`).join(',')})`
    )).rows;
}

module.exports = {
    getMedicationAllowedSex,
    getMedicationAllowedAge,
    getMedicationSpecialisms,
    getMedicationMinWeight,
    getMedicationAllowPregnant,
};
