import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity({name: 'frequentie'})
export class Frequency {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({name: 'frequentie'})
    description: string;
}
