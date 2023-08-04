import {Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Rule} from "./rule.entity";

@Injectable()
export class RuleService {
    constructor(@InjectRepository(Rule) private readonly repository: Repository<Rule>) {
    }

    async findAll(): Promise<Rule[]> {
        return this.repository.find();
    }

    async save(rules: Rule[]): Promise<void> {
        await this.repository.save(rules);
    }
}
