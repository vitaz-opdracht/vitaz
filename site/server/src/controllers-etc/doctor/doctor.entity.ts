import {Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {Specialty} from "../specialty/specialty.entity";
import {Contact} from "../contact/contact.entity";
import {Prescription} from "../prescription/prescription.entity";

@Entity({name: 'arts'})
export class Doctor {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({name: 'voornaam'})
    firstName: string;

    @Column({name: 'naam'})
    lastName: string;

    @Column({name: 'specid'})
    specialtyId: number;

    @ManyToOne(() => Specialty, (specialty) => specialty.doctors, {eager: true})
    @JoinColumn({name: 'specid'})
    specialty: Specialty;

    @OneToMany(() => Contact, (contact) => contact.doctor)
    contacts: Contact[];

    @OneToMany(() => Prescription, (prescription) => prescription.doctor)
    prescriptions: Prescription[];
}
