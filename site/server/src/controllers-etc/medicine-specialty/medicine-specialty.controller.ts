import {Controller} from '@nestjs/common';
import {MedicineSpecialty} from "./medicine-specialty.entity";
import {MedicineSpecialtyService} from "./medicine-specialty.service";
import {PaginatedController} from "../../pagination/paginated-controller";

@Controller('medicine-specialty')
export class MedicineSpecialtyController extends PaginatedController<MedicineSpecialty, MedicineSpecialtyService> {
    constructor(private readonly medicineSpecialtyService: MedicineSpecialtyService) {
        super(medicineSpecialtyService);
    }
}
