import {Controller} from '@nestjs/common';
import {ContactService} from "./contact.service";
import {Contact} from "./contact.entity";
import {PaginatedController} from "../../pagination/paginated-controller";

@Controller('contact')
export class ContactController extends PaginatedController<Contact, ContactService> {
    constructor(private readonly contactService: ContactService) {
        super(contactService);
    }
}
