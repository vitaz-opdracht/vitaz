import {Controller} from '@nestjs/common';
import {DoctorService} from "./doctor.service";
import {Doctor} from "./doctor.entity";
import {PaginatedController} from "../../pagination/paginated-controller";

@Controller('doctor')
export class DoctorController extends PaginatedController<Doctor, DoctorService> {

    constructor(private readonly doctorService: DoctorService) {
        super(doctorService);
    }
}
