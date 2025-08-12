import { DataSource, In } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { WorkshopProfile } from './entities/workshop-profile.entity';
import { CompanyProfile } from './entities/company-profile.entity';
import { Demand, DemandStatus } from './entities/demand.entity';
import { Specialty } from './entities/specialty.entity';

async function seed(dataSource: DataSource) {
    try {
        console.log('Iniciando seed...');

        if (!dataSource.isInitialized) {
            console.log('DataSource não inicializado, inicializando...');
            await dataSource.initialize();
        }

        const userRepo = dataSource.getRepository(User);
        const specialtyRepo = dataSource.getRepository(Specialty);

        const count = await userRepo.count();
        if (count > 0) {
            console.log('Seed já executado. Abortando...');
            return;
        }

        console.log('Executando seed de dados...');

        await dataSource.transaction(async (manager) => {
            // Hash da senha padrão
            const passwordHash = await bcrypt.hash('123456', 10);

            // Criar usuário oficina
            const workshopUser = manager.create(User, {
                name: 'Oficina Teste',
                email: 'oficina@teste.com',
                passwordHash,
                type: 'workshop',
            });
            await manager.save(workshopUser);
            console.log('Usuário oficina criado');

            // Criar ou garantir especialidades
            const specialtyNames = ['Camisetas', 'Malha'];
            const existingSpecialties = await manager.find(Specialty, {
                where: { name: In(specialtyNames) },
            });

            const specialtiesToInsert = specialtyNames
                .filter((name) => !existingSpecialties.some((s) => s.name === name))
                .map((name) => manager.create(Specialty, { name }));

            if (specialtiesToInsert.length > 0) {
                await manager.save(specialtiesToInsert);
            }

            const specialties = await manager.find(Specialty, {
                where: { name: In(specialtyNames) },
            });

            // Criar perfil da oficina
            const workshopProfile = manager.create(WorkshopProfile, {
                user: workshopUser,
                companyName: 'Oficina do João',
                productionCapacity: 1000,
                specialties,
                location: { city: 'Apucarana', state: 'PR', address: 'Rua das Flores, 123' },
                portfolio: [],
                contact: { phone: '42999999999', whatsapp: '42999999999' },
                rating: 4.5,
                completedProjects: 12,
            });
            await manager.save(workshopProfile);
            console.log('Perfil oficina criado');

            // Criar usuário empresa
            const companyUser = manager.create(User, {
                name: 'Empresa Teste',
                email: 'empresa@teste.com',
                passwordHash,
                type: 'company',
            });
            await manager.save(companyUser);
            console.log('Usuário empresa criado');

            // Criar perfil da empresa
            const companyProfile = manager.create(CompanyProfile, {
                user: companyUser,
                companyName: 'Confecções Alfa',
                industry: 'Têxtil',
                contact: { phone: '42988888888', website: 'http://confeccoesalfa.com.br' },
            });
            await manager.save(companyProfile);
            console.log('Perfil empresa criado');

            // Criar demanda de teste
            const demand = manager.create(Demand, {
                title: 'Produção de 500 camisetas',
                description: 'Camisetas básicas em algodão para loja X',
                volume: 500,
                deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dias a partir de agora
                specialty: 'Camisetas',
                budget: 7500,
                status: DemandStatus.OPEN,
                company: companyProfile,
            });
            await manager.save(demand);
            console.log('Demanda criada');
        });

        console.log('Seed executado com sucesso!');
    } catch (error) {
        console.error('Erro durante execução do seed:', error);
        throw error;
    }
}

export default seed;
