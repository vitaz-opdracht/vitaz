import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {File} from "../file/file.entity";
import {Doctor} from "../doctor/doctor.entity";

@Entity({name: 'contact'})
export class Contact {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({name: 'dossierid'})
    fileId: string;

    @ManyToOne(() => File, (file) => file.contacts, {eager: true})
    @JoinColumn({name: 'dossierid'})
    file: File;

    @Column({name: 'artsid'})
    doctorId: string;

    @ManyToOne(() => Doctor, (doctor) => doctor.contacts, {eager: true})
    @JoinColumn({name: 'artsid'})
    doctor: Doctor;

    @Column({name: 'van', type: 'date'})
    birthDate: Date;

    @Column({name: 'tot', type: 'date'})
    deathDate: Date;
}
