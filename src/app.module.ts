import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

// Importar todos os módulos
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DemandsModule } from './demands/demands.module';
import { MatchesModule } from './matches/matches.module';
import { MatchingModule } from './matching/matching.module';
import { MessagesModule } from './messages/messages.module';

// Importar todas as entidades
import { User } from './entities/user.entity';
import { WorkshopProfile } from './entities/workshop-profile.entity';
import { CompanyProfile } from './entities/company-profile.entity';
import { Demand } from './entities/demand.entity';
import { Match } from './entities/match.entity';
import { Message } from './entities/message.entity';
import { Specialty } from './entities/specialty.entity';

// Importar middleware
import { RequestLoggerMiddleware } from './common/middleware/request-logger.middleware';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        TypeOrmModule.forRootAsync({
            useFactory: (configService: ConfigService) => ({
                type: 'postgres',
                host: configService.get('DB_HOST'),
                port: Number(configService.get('DB_PORT')),
                username: configService.get('DB_USERNAME'),
                password: configService.get('DB_PASSWORD'),
                database: configService.get('DB_DATABASE'),
                entities: [User, WorkshopProfile, CompanyProfile, Demand, Match, Message, Specialty],
                autoLoadEntities: true,
                synchronize: true,
                logging: false,
            }),
            inject: [ConfigService],
        }),
        // Importar todos os módulos
        AuthModule,
        UsersModule,
        DemandsModule,
        MatchesModule,
        MatchingModule,
        MessagesModule,
        Specialty,

    ],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(RequestLoggerMiddleware)
            .forRoutes('*');
    }
}