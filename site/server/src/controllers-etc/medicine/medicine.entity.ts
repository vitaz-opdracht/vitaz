import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {PrescribedMedicine} from "../prescribed-medicine/prescribed-medicine.entity";

@Entity({name: 'artikel'})
export class Medicine {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({name: 'artikel'})
    name: string;

    @Column({name: 'dosis'})
    dose: string;

    @Column({name: 'allowmale'})
    allowMale: number;

    @Column({name: 'allowfemale'})
    allowFemale: number;

    @Column({name: 'minage'})
    minAge: number;

    @Column({name: 'maxage'})
    maxAge: number;

    @Column({name: 'minweight'})
    minWeight: number;

    @OneToMany(() => PrescribedMedicine, (prescribedMedicine) => prescribedMedicine.medicine)
    prescribedMedication: PrescribedMedicine[];
}
