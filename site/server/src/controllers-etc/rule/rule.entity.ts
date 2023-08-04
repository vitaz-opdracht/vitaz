import {Column, Entity, OneToMany, PrimaryColumn} from 'typeorm';
import {PrescriptionRuleViolation} from "../prescription-rule-violation/prescription-rule-violation.entity";

@Entity({name: 'regel'})
export class Rule {
    @PrimaryColumn()
    id: string;

    @Column({name: 'description'})
    description: string;

    @Column({name: 'enabled'})
    enabled: number;

    @Column({name: 'rule_order'})
    ruleOrder: number;

    @OneToMany(() => PrescriptionRuleViolation, (prescriptionRuleViolation) => prescriptionRuleViolation.rule)
    ruleViolations: PrescriptionRuleViolation[];
}
