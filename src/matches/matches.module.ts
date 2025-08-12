import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Match } from '../entities/match.entity';
import { Demand } from '../entities/demand.entity';
import { User } from '../entities/user.entity';
import { MatchesService } from './matches.service';
import { MatchesController } from './matches.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Match, Demand, User])],
    providers: [MatchesService],
    controllers: [MatchesController],
    exports: [MatchesService],
})
export class MatchesModule { }
