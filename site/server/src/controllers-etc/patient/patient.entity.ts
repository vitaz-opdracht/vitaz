import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {File} from "../file/file.entity";
import {Prescription} from "../prescription/prescription.entity";

@Entity({name: 'patient'})
export class Patient {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({name: 'voornaam'})
    firstName: string;

    @Column({name: 'naam'})
    lastName: string;

    @Column({name: 'gebdat', type: 'date'})
    birthDate: Date;

    @Column({name: 'geslacht'})
    sex: string;

    @Column({name: 'datoverlijden', type: 'date'})
    deathDate: Date;

    @OneToMany(() => File, (file) => file.patient)
    files: File[];

    @OneToMany(() => Prescription, (prescription) => prescription.patient)
    prescriptions: Prescription[];
}
