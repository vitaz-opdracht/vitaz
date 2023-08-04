import {Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Specialty} from "./specialty.entity";
import {PaginatedService} from "../../pagination/paginated-service";

@Injectable()
export class SpecialtyService extends PaginatedService<Specialty> {
    constructor(@InjectRepository(Specialty) private readonly specialtyRepository: Repository<Specialty>) {
        super(specialtyRepository);
    }
}
