import {Patient} from "../patient/patient";
import {Doctor} from "../doctor/doctor";
import {PrescriptionRuleViolation} from "../prescription-rule-violation/prescription-rule-violation";

export interface Prescription {
  id: number;
  patientId: number;
  patient: Patient;
  doctorId: number;
  doctor: Doctor;
  date: Date;
  valid: number;
  //prescribedMedication: PrescribedMedicine[];
  ruleViolations: PrescriptionRuleViolation[];
}
