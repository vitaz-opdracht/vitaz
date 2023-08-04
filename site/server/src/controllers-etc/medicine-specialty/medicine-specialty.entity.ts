import {Entity, JoinColumn, ManyToOne, PrimaryColumn} from 'typeorm';
import {Medicine} from "../medicine/medicine.entity";
import {Specialty} from "../specialty/specialty.entity";

@Entity({name: 'artikelspecialisme'})
export class MedicineSpecialty {
    @PrimaryColumn({name: 'artikelid'})
    medicineId: number;

    @ManyToOne(() => Medicine, (medicine) => medicine.id)
    @JoinColumn({name: 'artikelid'})
    medicine: Medicine;

    @PrimaryColumn({name: 'specid'})
    specialtyId: number;

    @ManyToOne(() => Specialty, (specialty) => specialty.id)
    @JoinColumn({name: 'specid'})
    specialty: Specialty;
}
