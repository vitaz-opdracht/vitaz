import {Controller} from '@nestjs/common';
import {SpecialtyService} from "./specialty.service";
import {Specialty} from "./specialty.entity";
import {PaginatedController} from "../../pagination/paginated-controller";

@Controller('specialty')
export class SpecialtyController extends PaginatedController<Specialty, SpecialtyService> {
    constructor(private readonly specialtyService: SpecialtyService) {
        super(specialtyService);
    }
}
