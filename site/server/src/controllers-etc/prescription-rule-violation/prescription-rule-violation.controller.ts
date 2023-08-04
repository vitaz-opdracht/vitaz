import {Controller} from '@nestjs/common';
import {PrescriptionRuleViolationService} from "./prescription-rule-violation.service";
import {PrescriptionRuleViolation} from "./prescription-rule-violation.entity";
import {PaginatedController} from "../../pagination/paginated-controller";

@Controller('prescription-rule-violations')
export class PrescriptionRuleViolationController extends PaginatedController<PrescriptionRuleViolation, PrescriptionRuleViolationService> {
    constructor(private readonly prescriptionRuleViolationService: PrescriptionRuleViolationService) {
        super(prescriptionRuleViolationService);
    }
}
