import {Controller} from '@nestjs/common';
import {FileAttributeService} from "./file-attribute.service";
import {FileAttribute} from "./file-attribute.entity";
import {PaginatedController} from "../../pagination/paginated-controller";

@Controller('file-attribute')
export class FileAttributeController extends PaginatedController<FileAttribute, FileAttributeService> {
    constructor(private readonly fileAttributeService: FileAttributeService) {
        super(fileAttributeService);
    }
}
