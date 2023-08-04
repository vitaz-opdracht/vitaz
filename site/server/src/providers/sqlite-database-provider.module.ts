import {DatabaseType} from 'typeorm';
import {Module} from '@nestjs/common';
import {TypeOrmModule, TypeOrmModuleAsyncOptions} from '@nestjs/typeorm';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'sqlite' as DatabaseType,
            database: '../../emb.db',
            autoLoadEntities: true,
        } as TypeOrmModuleAsyncOptions),
    ],
})
export class SqliteDatabaseProviderModule {
}
