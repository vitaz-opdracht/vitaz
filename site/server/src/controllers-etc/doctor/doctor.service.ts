import {Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Doctor} from "./doctor.entity";
import {PaginatedService} from "../../pagination/paginated-service";

@Injectable()
export class DoctorService extends PaginatedService<Doctor> {
    constructor(@InjectRepository(Doctor) private readonly doctorRepository: Repository<Doctor>) {
        super(doctorRepository);
    }
}
