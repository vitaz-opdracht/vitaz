import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {Doctor} from "../doctor/doctor.entity";

@Entity({name: 'specialisme'})
export class Specialty {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({name: 'specname'})
    name: string;

    @OneToMany(() => Doctor, (doctor) => doctor.specialty)
    doctors: Doctor[];
}
