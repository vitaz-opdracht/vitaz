import {Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {MedicineSpecialty} from "./medicine-specialty.entity";
import {PaginatedService} from "../../pagination/paginated-service";

@Injectable()
export class MedicineSpecialtyService extends PaginatedService<MedicineSpecialty> {
    constructor(@InjectRepository(MedicineSpecialty) private readonly medicineSpecialtyRepository: Repository<MedicineSpecialty>) {
        super(medicineSpecialtyRepository);
    }
}
