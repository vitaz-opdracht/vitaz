import {Controller} from '@nestjs/common';
import {PrescribedMedicineService} from "./prescribed-medicine.service";
import {PrescribedMedicine} from "./prescribed-medicine.entity";
import {PaginatedController} from "../../pagination/paginated-controller";

@Controller('prescribed-medicine')
export class PrescribedMedicineController extends PaginatedController<PrescribedMedicine, PrescribedMedicineService> {
    constructor(private readonly prescribedMedicineService: PrescribedMedicineService) {
        super(prescribedMedicineService);
    }
}
