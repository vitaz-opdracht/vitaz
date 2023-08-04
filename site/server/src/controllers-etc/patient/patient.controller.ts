import {Controller} from '@nestjs/common';
import {PatientService} from "./patient.service";
import {Patient} from "./patient.entity";
import {PaginatedController} from "../../pagination/paginated-controller";

@Controller('patient')
export class PatientController extends PaginatedController<Patient, PatientService> {
    constructor(private readonly patientService: PatientService) {
        super(patientService);
    }
}
