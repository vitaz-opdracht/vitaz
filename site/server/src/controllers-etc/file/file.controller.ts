import {Controller} from '@nestjs/common';
import {FileService} from "./file.service";
import {File} from "./file.entity";
import {PaginatedController} from "../../pagination/paginated-controller";

@Controller('file')
export class FileController extends PaginatedController<File, FileService> {
    constructor(private readonly fileService: FileService) {
        super(fileService);
    }
}
