import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Match } from '../entities/match.entity';
import { CreateMatchDto, MatchStatus } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
import { Demand } from '../entities/demand.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class MatchesService {
    constructor(
        @InjectRepository(Match)
        private matchesRepository: Repository<Match>,
        @InjectRepository(Demand)
        private demandRepository: Repository<Demand>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }

    async create(createDto: CreateMatchDto): Promise<Match> {
        const demand = await this.demandRepository.findOne({ where: { id: createDto.demandId } });
        if (!demand) throw new NotFoundException('Demanda não encontrada');

        const workshop = await this.userRepository.findOne({ where: { id: createDto.workshopId, type: 'workshop' } });
        if (!workshop) throw new NotFoundException('Oficina não encontrada');

        const company = await this.userRepository.findOne({ where: { id: createDto.companyId, type: 'company' } });
        if (!company) throw new NotFoundException('Empresa não encontrada');

        const match = this.matchesRepository.create({
            demand,
            workshop,
            company,
            status: createDto.status || MatchStatus.PENDING,
        });

        return this.matchesRepository.save(match);
    }

    async findAllByDemand(demandId: string): Promise<Match[]> {
        return this.matchesRepository.find({
            where: { demand: { id: demandId } },
            relations: ['workshop', 'company', 'demand'],
        });
    }

    async findAllByUser(userId: string): Promise<Match[]> {
        return this.matchesRepository.find({
            where: [
                { workshop: { id: userId } },
                { company: { id: userId } }
            ],
            relations: ['workshop', 'company', 'demand'],
        });
    }

    async update(id: string, updateDto: UpdateMatchDto): Promise<Match> {
        const match = await this.matchesRepository.findOne({ where: { id }, relations: ['demand', 'workshop', 'company'] });
        if (!match) throw new NotFoundException('Match não encontrado');

        if (updateDto.status) {
            match.status = updateDto.status;
            if (updateDto.status === MatchStatus.ACCEPTED) {
                match.acceptedAt = new Date();
            }
            if (updateDto.status === MatchStatus.COMPLETED) {
                match.completedAt = new Date();
            }
        }

        return this.matchesRepository.save(match);
    }
}
