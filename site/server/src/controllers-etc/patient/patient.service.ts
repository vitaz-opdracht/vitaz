import {Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Patient} from "./patient.entity";
import {PaginatedService} from "../../pagination/paginated-service";

@Injectable()
export class PatientService extends PaginatedService<Patient> {
    constructor(@InjectRepository(Patient) private readonly patientRepository: Repository<Patient>) {
        super(patientRepository);
    }
}
