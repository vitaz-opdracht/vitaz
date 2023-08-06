const moment = require('moment');
const {
    getPatientSex,
    getPatientBirthDate,
    getPatientWeight,
    isPatientAlive, getPatientPregnant
} = require('./repositories/patient-repository');
const {
    getMedicationAllowedSex,
    getMedicationAllowedAge,
    getMedicationSpecialisms,
    getMedicationMinWeight, getMedicationAllowPregnant
} = require('./repositories/medication-repository');
const {getPrescriberSpecialism} = require('./repositories/prescriber-repository');
const {getRuleConfig} = require('./rule-config-loader');

const ruleBindings = {
    sex: verifySex,
    age: verifyAge,
    weight: verifyWeight,
    specialism: verifySpecialism,
    pregnant: verifyPregnant,
    alive: verifyAlive,
};

async function check(data) {
    const contentValid = verifyContent(data);

    if (!contentValid) {
        return {valid: false, data: {prescription: data, violations: ['content']}};
    }

    const violations = [];
    for (const rule of (await getRuleConfig())) {
        const ruleValidationFunction = ruleBindings[rule.id];
        const valid = await ruleValidationFunction(data);
        if (!valid) {
            violations.push(rule.id);
        }
    }

    if (violations.length === 0) {
        return {valid: true, data};
    } else {
        return {valid: false, data: {prescription: data, violations}};
    }
}

function verifyContent(data) {
    return data.id != null
        && data.patient?.id != null
        && data.prescriber?.id != null
        && data.date != null
        && Array.isArray(data.medication)
        && data.medication.length > 0
        && data.medication.every((medication) =>
            medication.id != null
            && medication.aantal != null
            && medication.frequency != null);
}

async function verifySex(data) {
    const patientSex = await getPatientSex(data.patient.id);
    if (patientSex !== 'm' && patientSex !== 'v') {
        return false;
    }

    const medicineAllowedSex = await getMedicationAllowedSex(data.medication.map(({id}) => id));

    if (medicineAllowedSex.length === 0) {
        return false;
    }

    return medicineAllowedSex.every(({allowmale, allowfemale}) => {
            switch (patientSex) {
                case 'm':
                    return !!allowmale;
                case 'v':
                    return !!allowfemale;
                default:
                    return false;
            }
        }
    );
}

async function verifyAge(data) {
    const patientBirthDate = await getPatientBirthDate(data.patient.id);
    const patientAge = moment(data.date, 'YYYY-MM-DD').diff(moment(patientBirthDate, 'YYYY-MM-DD'), 'years');

    const medicineAllowedAge = await getMedicationAllowedAge(data.medication.map(({id}) => id));

    if (medicineAllowedAge.length === 0) {
        return false;
    }

    return medicineAllowedAge
        .every(({minage, maxage}) => patientAge >= minage && (patientAge <= maxage || maxage === 0));
}

async function verifyWeight(data) {
    const patientWeight = await getPatientWeight(data.patient.id, data.date);

    if (patientWeight == null) {
        return false;
    }

    const medicineMinWeight = await getMedicationMinWeight(data.medication.map(({id}) => id));

    if (medicineMinWeight.length === 0) {
        return false;
    }

    return medicineMinWeight.every(({minweight}) => minweight <= patientWeight);
}

async function verifyPregnant(data) {
    const patientPregnant = await getPatientPregnant(data.patient.id, data.date);

    if (patientPregnant !== '1') {
        return true;
    }

    const medicineAllowPregnant = await getMedicationAllowPregnant(data.medication.map(({id}) => id));

    if (medicineAllowPregnant.length === 0) {
        return false;
    }

    return medicineAllowPregnant.every(({allowpregnant}) => allowpregnant === 1);
}

async function verifySpecialism(data) {
    const prescriberSpecialism = await getPrescriberSpecialism(data.prescriber.id);
    if (prescriberSpecialism == null) {
        return false;
    }

    const medicineSpecialisms = await getMedicationSpecialisms(data.medication.map(({id}) => id));
    if (medicineSpecialisms.length === 0) {
        return false;
    }

    return medicineSpecialisms.map(({specids}) => specids.split(',')).every((specids) => specids.includes(prescriberSpecialism));
}

async function verifyAlive(data) {
    return await isPatientAlive(data.patient.id);
}

module.exports = {
    check,
};
