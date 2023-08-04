import {Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Contact} from "./contact.entity";
import {PaginatedService} from "../../pagination/paginated-service";

@Injectable()
export class ContactService extends PaginatedService<Contact> {
    constructor(@InjectRepository(Contact) private readonly contactRepository: Repository<Contact>) {
        super(contactRepository);
    }
}
