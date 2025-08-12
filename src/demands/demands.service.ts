import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Demand } from '../entities/demand.entity';
import { CreateDemandDto, DemandStatus } from './create-demand.dto';
import { UpdateDemandDto } from './dto/update-demand.dto';
import { CompanyProfile } from '../entities/company-profile.entity';

@Injectable()
export class DemandsService {
    constructor(
        @InjectRepository(Demand)
        private demandsRepository: Repository<Demand>,
        @InjectRepository(CompanyProfile)
        private companyRepository: Repository<CompanyProfile>,
    ) { }

    async create(companyId: string, dto: CreateDemandDto): Promise<Demand> {
        const company = await this.companyRepository.findOne({ where: { id: companyId } });
        if (!company) throw new NotFoundException('Empresa não encontrada');

        const demand = this.demandsRepository.create({
            ...dto,
            deadline: new Date(dto.deadline),
            company,
            status: dto.status || DemandStatus.OPEN,
        });
        return this.demandsRepository.save(demand);
    }

    async findAllByCompany(companyId: string): Promise<Demand[]> {
        return this.demandsRepository.find({
            where: { company: { id: companyId } },
            relations: ['company'],
        });
    }

    async findAllOpen(): Promise<Demand[]> {
        return this.demandsRepository.find({
            where: { status: DemandStatus.OPEN },
            relations: ['company'],
        });
    }

    async findById(id: string): Promise<Demand> {
        const demand = await this.demandsRepository.findOne({
            where: { id },
            relations: ['company', 'matches'],
        });
        if (!demand) throw new NotFoundException('Demanda não encontrada');
        return demand;
    }

    async update(id: string, companyId: string, dto: UpdateDemandDto): Promise<Demand> {
        const demand = await this.findById(id);
        if (demand.company.id !== companyId)
            throw new ForbiddenException('Não autorizado a atualizar esta demanda');

        Object.assign(demand, dto);
        if (dto.deadline) demand.deadline = new Date(dto.deadline);

        return this.demandsRepository.save(demand);
    }

    async remove(id: string, companyId: string): Promise<void> {
        const demand = await this.findById(id);
        if (demand.company.id !== companyId)
            throw new ForbiddenException('Não autorizado a remover esta demanda');

        await this.demandsRepository.delete(id);
    }
}
