export interface PrescriptionRuleViolation {
    id: number;
    rule: {
        enabled: number;
        id: string;
        description: string;
        ruleOrder: number;
    };
    ruleId: string;
}
