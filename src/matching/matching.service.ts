import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Demand } from '../entities/demand.entity';
import { User } from '../entities/user.entity';
import { Match } from '../entities/match.entity';
import { MatchStatus } from '../matches/dto/create-match.dto';

@Injectable()
export class MatchingService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        @InjectRepository(Match)
        private matchesRepository: Repository<Match>,
        @InjectRepository(Demand)
        private demandRepository: Repository<Demand>,
    ) { }

    /**
     * Retorna as oficinas que possuem especialidade compatível com a demanda,
     * ordenando pela quantidade de especialidades compatíveis.
     */
    async findMatchesForDemand(demandId: string): Promise<{ workshop: User; score: number }[]> {
        const demand = await this.demandRepository.findOne({ where: { id: demandId } });
        if (!demand) {
            return [];
        }

        const workshops = await this.usersRepository.find({
            where: { type: 'workshop' },
            relations: ['workshopProfile'],
        });

        const matches = workshops
            .map((workshop) => {
                const specialties = workshop.workshopProfile?.specialties || [];
                const score = specialties.some(s => s.name === demand.specialty) ? 1 : 0;
                return { workshop, score };
            })
            .filter((m) => m.score > 0)
            .sort((a, b) => b.score - a.score);

        return matches;
    }

    /**
     * Cria matches automáticos para as 3 melhores oficinas encontradas.
     */
    async createAutoMatches(demandId: string): Promise<Match[]> {
        const demand = await this.demandRepository.findOne({ where: { id: demandId }, relations: ['company'] });
        if (!demand) {
            throw new Error('Demanda não encontrada');
        }

        const matchesFound = await this.findMatchesForDemand(demandId);

        const topWorkshops = matchesFound.slice(0, 3);

        const createdMatches: Match[] = [];

        for (const matchData of topWorkshops) {
            const existingMatch = await this.matchesRepository.findOne({
                where: {
                    demand: { id: demandId },
                    workshop: { id: matchData.workshop.id },
                },
            });
            if (existingMatch) continue; // evita duplicatas

            const match = this.matchesRepository.create({
                demand,
                workshop: matchData.workshop,
                company: demand.company.user,
                status: MatchStatus.PENDING,
            });
            const saved = await this.matchesRepository.save(match);
            createdMatches.push(saved);
        }

        return createdMatches;
    }
}
