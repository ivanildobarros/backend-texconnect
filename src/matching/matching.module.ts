import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchingService } from './matching.service';
import { MatchingController } from './matching.controller';
import { User } from '../entities/user.entity';
import { Match } from '../entities/match.entity';
import { Demand } from '../entities/demand.entity';

@Module({
    imports: [TypeOrmModule.forFeature([User, Match, Demand])],
    providers: [MatchingService],
    controllers: [MatchingController],
    exports: [MatchingService],
})
export class MatchingModule { }
