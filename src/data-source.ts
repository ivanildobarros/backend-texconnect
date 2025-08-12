import { DataSource } from 'typeorm';
import { User } from './entities/user.entity';
import { WorkshopProfile } from './entities/workshop-profile.entity';
import { CompanyProfile } from './entities/company-profile.entity';
import { Demand } from './entities/demand.entity';
import { Match } from './entities/match.entity';
import { Message } from './entities/message.entity';

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 5433,
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_DATABASE || 'texconnect',
    synchronize: true,
    logging: false,
    entities: [User, WorkshopProfile, CompanyProfile, Demand, Match, Message],
    migrations: [],
    subscribers: [],
});