import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Specialty } from '../entities/specialty.entity';
import { CreateSpecialtyDto } from './dto/create-specialty.dto';

@Injectable()
export class SpecialtyService {
    constructor(
        @InjectRepository(Specialty)
        private readonly specialtyRepository: Repository<Specialty>,
    ) { }

    async create(createDto: CreateSpecialtyDto): Promise<Specialty> {
        const specialty = this.specialtyRepository.create(createDto);
        return this.specialtyRepository.save(specialty);
    }

    async findAll(): Promise<Specialty[]> {
        return this.specialtyRepository.find();
    }

    async findOne(id: number): Promise<Specialty> {
        const specialty = await this.specialtyRepository.findOne({ where: { id } });
        if (!specialty) throw new NotFoundException('Specialty not found');
        return specialty;
    }

    async remove(id: string): Promise<void> {
        await this.specialtyRepository.delete(id);
    }
}
