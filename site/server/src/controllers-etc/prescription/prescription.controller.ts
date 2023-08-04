import {Controller, Get} from '@nestjs/common';
import {PrescriptionService} from "./prescription.service";
import {Prescription} from "./prescription.entity";
import {PaginatedController} from "../../pagination/paginated-controller";

@Controller('prescription')
export class PrescriptionController extends PaginatedController<Prescription, PrescriptionService> {
    constructor(private readonly prescriptionService: PrescriptionService) {
        super(prescriptionService);
    }

    @Get('totalCorrectRejectedCount')
    async getTotalCorrectRejectedCount(): Promise<{ total: number, correct: number, rejected: number }> {
        return this.prescriptionService.findTotalCorrectRejectedCounts();
    }
}
