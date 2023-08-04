import {Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {Doctor} from "../doctor/doctor.entity";
import {Patient} from "../patient/patient.entity";
import {PrescribedMedicine} from "../prescribed-medicine/prescribed-medicine.entity";
import {PrescriptionRuleViolation} from "../prescription-rule-violation/prescription-rule-violation.entity";

@Entity({name: 'voorschrift'})
export class Prescription {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({name: 'patient'})
    patientId: number;

    @ManyToOne(() => Patient, (patient) => patient.prescriptions, {eager: true})
    @JoinColumn({name: 'patient'})
    patient: Patient;

    @Column({name: 'voorschrijver'})
    doctorId: number;

    @ManyToOne(() => Doctor, (doctor) => doctor.prescriptions, {eager: true})
    @JoinColumn({name: 'voorschrijver'})
    doctor: Doctor;

    @Column({name: 'datum', type: 'date'})
    date: Date;

    @Column({name: 'geldig'})
    valid: number;

    @OneToMany(() => PrescribedMedicine, (prescribedMedicine) => prescribedMedicine.prescription)
    prescribedMedication: PrescribedMedicine[];

    @OneToMany(() => PrescriptionRuleViolation, (prescriptionRuleViolation) => prescriptionRuleViolation.prescription, {eager: true})
    ruleViolations: PrescriptionRuleViolation[];
}
