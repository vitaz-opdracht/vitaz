import {Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {File} from "./file.entity";
import {PaginatedService} from "../../pagination/paginated-service";

@Injectable()
export class FileService extends PaginatedService<File> {
    constructor(@InjectRepository(File) private readonly fileRepository: Repository<File>) {
        super(fileRepository);
    }
}
