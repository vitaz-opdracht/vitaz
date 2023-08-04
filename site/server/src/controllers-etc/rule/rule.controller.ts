import {Body, Controller, Get, Post} from '@nestjs/common';
import {RuleService} from "./rule.service";
import {Rule} from "./rule.entity";

@Controller('rule')
export class RuleController {
    constructor(private readonly service: RuleService) {
    }

    @Get()
    async findAll(): Promise<Rule[]> {
        return await this.service.findAll();
    }

    @Post()
    async save(@Body() rules: Rule[]): Promise<void> {
        return await this.service.save(rules);
    }
}
