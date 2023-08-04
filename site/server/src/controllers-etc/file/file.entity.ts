import {Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {Patient} from "../patient/patient.entity";
import {FileAttribute} from "../file-attribute/file-attribute.entity";
import {Contact} from "../contact/contact.entity";

@Entity({name: 'dossier'})
export class File {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({name: 'patid'})
    patientId: number;

    @ManyToOne(() => Patient, (patient) => patient.files, {eager: true})
    @JoinColumn({name: 'patid'})
    patient: Patient;

    @Column({name: 'datefrom', type: 'date'})
    dateFrom: Date;

    @Column({name: 'dateuntil', type: 'date'})
    dateUntil: Date;

    @Column({name: 'dossiertype'})
    fileType: string;

    @OneToMany(() => FileAttribute, (fileAttribute) => fileAttribute.file)
    fileAttributes: FileAttribute[];

    @OneToMany(() => Contact, (contact) => contact.file)
    contacts: Contact[];
}
