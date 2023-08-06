import {DatabaseType} from 'typeorm';
import {Module} from '@nestjs/common';
import {TypeOrmModule, TypeOrmModuleAsyncOptions} from '@nestjs/typeorm';
import * as process from "process";

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'postgres' as DatabaseType,
            host: process.env.DATABASE_HOST || 'localhost',
            port: 5432,
            username: 'postgres',
            password: 'postgres',
            database: 'db',
            autoLoadEntities: true
        } as TypeOrmModuleAsyncOptions),
    ],
})
export class PostgreSQLDatabaseProviderModule {
}
