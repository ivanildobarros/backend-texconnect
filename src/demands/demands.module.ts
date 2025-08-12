import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Demand } from '../entities/demand.entity';
import { CompanyProfile } from '../entities/company-profile.entity';
import { DemandsService } from './demands.service';
import { DemandsController } from './demands.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Demand, CompanyProfile])],
    providers: [DemandsService],
    controllers: [DemandsController],
    exports: [DemandsService],
})
export class DemandsModule { }
