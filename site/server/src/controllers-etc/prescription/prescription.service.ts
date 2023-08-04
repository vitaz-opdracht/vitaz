import {Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Prescription} from "./prescription.entity";
import {PaginatedService} from "../../pagination/paginated-service";

@Injectable()
export class PrescriptionService extends PaginatedService<Prescription> {
    constructor(@InjectRepository(Prescription) private readonly prescriptionRepository: Repository<Prescription>) {
        super(prescriptionRepository);
    }

    async findTotalCorrectRejectedCounts(): Promise<{ total: number, correct: number, rejected: number }> {
        const totalCount = await this.repository.count();
        const correctCount = await this.repository.count({where: {valid: 1}});
        const incorrectCount = await this.repository.count({where: {valid: 0}});

        return {total: totalCount, correct: correctCount, rejected: incorrectCount};
    }
}
