import {Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {FileAttribute} from "./file-attribute.entity";
import {PaginatedService} from "../../pagination/paginated-service";

@Injectable()
export class FileAttributeService extends PaginatedService<FileAttribute> {
    constructor(@InjectRepository(FileAttribute) private readonly fileAttributeRepository: Repository<FileAttribute>) {
        super(fileAttributeRepository);
    }
}
