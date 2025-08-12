import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { UpdateUserDto, UpdateWorkshopProfileDto, UpdateCompanyProfileDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    async findById(id: string): Promise<User> {
        const user = await this.usersRepository.findOne({
            where: { id },
            relations: ['workshopProfile', 'companyProfile'],
        });
        if (!user) throw new NotFoundException('Usuário não encontrado');
        return user;
    }

    async findAll(): Promise<User[]> {
        return this.usersRepository.find({
            relations: ['workshopProfile', 'companyProfile'],
        });
    }

    async findAllWorkshops(): Promise<User[]> {
        return this.usersRepository.find({
            where: { type: 'workshop' },
            relations: ['workshopProfile'],
        });
    }

    async updateUserProfile(
        userId: string,
        userData?: UpdateUserDto,
        workshopData?: UpdateWorkshopProfileDto,
        companyData?: UpdateCompanyProfileDto,
    ): Promise<User> {
        const user = await this.findById(userId);

        if (userData?.name) user.name = userData.name;

        if (user.type === 'workshop' && workshopData) {
            if (!user.workshopProfile) {
                // Create a new WorkshopProfile using the repository manager
                const workshopProfileRepo = this.usersRepository.manager.getRepository('WorkshopProfile');
                const newProfile = workshopProfileRepo.create({
                    companyName: workshopData.companyName || '',
                    productionCapacity: workshopData.productionCapacity || 0,
                    specialties: workshopData.specialties || [],
                    location: workshopData.location || { city: '', state: '', address: '' },
                    portfolio: workshopData.portfolio || [],
                    contact: workshopData.contact || { phone: '', whatsapp: '' },
                    rating: workshopData.rating || 0,
                    completedProjects: workshopData.completedProjects || 0,
                });
                const savedProfile = await workshopProfileRepo.save(newProfile);
                // Reload user to get the saved profile
                (user as any).workshopProfile = savedProfile;
            } else {
                Object.assign(user.workshopProfile, workshopData);
                await this.usersRepository.manager.getRepository('WorkshopProfile').save(user.workshopProfile);
            }
        }

        if (user.type === 'company' && companyData) {
            if (!user.companyProfile) {
                const companyProfileRepo = this.usersRepository.manager.getRepository('CompanyProfile');
                const newProfile = companyProfileRepo.create({
                    companyName: companyData.companyName || '',
                    industry: companyData.industry || '',
                    contact: companyData.contact || { phone: '' },
                });
                const savedProfile = await companyProfileRepo.save(newProfile);
                (user as any).companyProfile = savedProfile;
            } else {
                Object.assign(user.companyProfile, companyData);
                await this.usersRepository.manager.getRepository('CompanyProfile').save(user.companyProfile);
            }
        }

        await this.usersRepository.save(user);
        return this.findById(userId);
    }
}
