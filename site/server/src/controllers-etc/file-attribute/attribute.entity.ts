import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {FileAttribute} from "./file-attribute.entity";

@Entity({name: 'attributes'})
export class Attribute {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({name: 'attribute'})
    name: string;

    @Column({name: 'description'})
    description: string;

    @Column({name: 'valuetype'})
    valueType: string;

    @OneToMany(() => FileAttribute, (fileAttribute) => fileAttribute.attribute)
    fileAttributes: FileAttribute[];
}
