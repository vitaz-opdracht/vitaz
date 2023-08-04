import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {Prescription} from "../prescription/prescription.entity";
import {Rule} from "../rule/rule.entity";

@Entity({name: 'voorschrift_regel_overtreding'})
export class PrescriptionRuleViolation {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({name: 'voorschrift'})
    prescriptionId: string;

    @ManyToOne(() => Prescription, (prescription) => prescription.ruleViolations)
    @JoinColumn({name: 'voorschrift'})
    prescription: Prescription;

    @Column({name: 'regel'})
    ruleId: string;

    @ManyToOne(() => Rule, (rule) => rule.ruleViolations, {eager: true})
    @JoinColumn({name: 'regel'})
    rule: Rule;
}
