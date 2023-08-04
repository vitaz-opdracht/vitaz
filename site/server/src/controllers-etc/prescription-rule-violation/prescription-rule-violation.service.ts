import {Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {PrescriptionRuleViolation} from "./prescription-rule-violation.entity";
import {PaginatedService} from "../../pagination/paginated-service";

@Injectable()
export class PrescriptionRuleViolationService extends PaginatedService<PrescriptionRuleViolation> {
    constructor(@InjectRepository(PrescriptionRuleViolation) private readonly prescriptionRuleViolationRepository: Repository<PrescriptionRuleViolation>) {
        super(prescriptionRuleViolationRepository);
    }
}
