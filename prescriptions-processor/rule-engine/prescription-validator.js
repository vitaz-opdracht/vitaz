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

function check(data) {
    const contentValid = verifyContent(data);

    if (!contentValid) {
        return {valid: false, data: {prescription: data, violations: ['content']}};
    }

    const violations = [];
    for (const rule of getRuleConfig()) {
        const ruleValidationFunction = ruleBindings[rule.id];
        const valid = ruleValidationFunction(data);
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

function verifySex(data) {
    const patientSex = getPatientSex(data.patient.id);
    if (patientSex !== 'm' && patientSex !== 'v') {
        return false;
    }

    const medicineAllowedSex = getMedicationAllowedSex(data.medication.map(({id}) => id));

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

function verifyAge(data) {
    const patientBirthDate = getPatientBirthDate(data.patient.id);
    if (!/[0-9]{4}-[0-9]{2}-[0-9]{2}/.test(patientBirthDate)) {
        return false;
    }

    const patientAge = moment(data.date, 'YYYY-MM-DD').diff(moment(patientBirthDate, 'YYYY-MM-DD'), 'years');

    const medicineAllowedAge = getMedicationAllowedAge(data.medication.map(({id}) => id));

    if (medicineAllowedAge.length === 0) {
        return false;
    }

    return medicineAllowedAge
        .every(({minage, maxage}) => patientAge >= minage && (patientAge <= maxage || maxage === 0));
}

function verifyWeight(data) {
    const patientWeight = getPatientWeight(data.patient.id, data.date);

    if (patientWeight == null) {
        return false;
    }

    const medicineMinWeight = getMedicationMinWeight(data.medication.map(({id}) => id));

    if (medicineMinWeight.length === 0) {
        return false;
    }

    return medicineMinWeight.every(({minweight}) => minweight <= patientWeight);
}

function verifyPregnant(data) {
    const patientPregnant = getPatientPregnant(data.patient.id, data.date);

    if (patientPregnant !== 1) {
        return true;
    }

    const medicineAllowPregnant = getMedicationAllowPregnant(data.medication.map(({id}) => id));

    if (medicineAllowPregnant.length === 0) {
        return false;
    }

    return medicineAllowPregnant.every(({allowpregnant}) => allowpregnant === 1);
}

function verifySpecialism(data) {
    const prescriberSpecialism = getPrescriberSpecialism(data.prescriber.id);
    if (prescriberSpecialism == null) {
        return false;
    }

    const medicineSpecialisms = getMedicationSpecialisms(data.medication.map(({id}) => id));
    if (medicineSpecialisms.length === 0) {
        return false;
    }

    return medicineSpecialisms.map(({specids}) => specids.split(',').map(Number)).every((specids) => specids.includes(prescriberSpecialism));
}

function verifyAlive(data) {
    return isPatientAlive(data.patient.id);
}

module.exports = {
    check,
};
