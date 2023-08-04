import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {Prescription} from "../prescription/prescription.entity";
import {Medicine} from "../medicine/medicine.entity";

@Entity({name: 'voorgeschreven_medicatie'})
export class PrescribedMedicine {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({name: 'voorschrift'})
    prescriptionId: string;

    @ManyToOne(() => Prescription, (prescription) => prescription.prescribedMedication, {eager: true})
    @JoinColumn({name: 'voorschrift'})
    prescription: Prescription;

    @Column({name: 'medicatie'})
    medicationId: number;

    @ManyToOne(() => Medicine, (medicine) => medicine.prescribedMedication, {eager: true})
    @JoinColumn({name: 'medicatie'})
    medicine: Medicine;

    @Column({name: 'aantal'})
    amount: number;

    @Column({name: 'frequentie'})
    frequence: number;
}
