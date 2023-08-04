import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {File} from "../file/file.entity";
import {Attribute} from "./attribute.entity";

@Entity({name: 'dossierattribute'})
export class FileAttribute {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({name: 'dossierid'})
    fileId: number;

    @ManyToOne(() => File, (file) => file.fileAttributes, {eager: true})
    @JoinColumn({name: 'dossierid'})
    file: File;

    @Column({name: 'attributeid'})
    attributeId: number;

    @ManyToOne(() => Attribute, (attribute) => attribute.fileAttributes, {eager: true})
    @JoinColumn({name: 'attributeid'})
    attribute: Attribute;

    @Column({name: 'datefrom', type: 'date'})
    dateFrom: Date;

    @Column({name: 'dateend', type: 'date'})
    dateEnd: Date;

    @Column({name: 'intvalue'})
    intValue: number;

    @Column({name: 'strvalue'})
    strValue: string;
}
