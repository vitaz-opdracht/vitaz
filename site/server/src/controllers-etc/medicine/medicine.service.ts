import {Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Medicine} from "./medicine.entity";
import {PaginatedService} from "../../pagination/paginated-service";

@Injectable()
export class MedicineService extends PaginatedService<Medicine> {
    constructor(@InjectRepository(Medicine) private readonly medicineRepository: Repository<Medicine>) {
        super(medicineRepository);
    }
}
