import {Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {PrescribedMedicine} from "./prescribed-medicine.entity";
import {PaginatedService} from "../../pagination/paginated-service";

@Injectable()
export class PrescribedMedicineService extends PaginatedService<PrescribedMedicine> {
    constructor(@InjectRepository(PrescribedMedicine) private readonly prescribedMedicineRepository: Repository<PrescribedMedicine>) {
        super(prescribedMedicineRepository);
    }
}
