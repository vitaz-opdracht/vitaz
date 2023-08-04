import {Controller} from '@nestjs/common';
import {MedicineService} from "./medicine.service";
import {Medicine} from "./medicine.entity";
import {PaginatedController} from "../../pagination/paginated-controller";

@Controller('medicine')
export class MedicineController extends PaginatedController<Medicine, MedicineService> {
    constructor(private readonly medicineService: MedicineService) {
        super(medicineService);
    }
}
