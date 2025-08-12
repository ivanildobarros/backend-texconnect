import { AppDataSource } from './data-source';
import { User } from './entities/user.entity';
import { WorkshopProfile } from './entities/workshop-profile.entity';
import { CompanyProfile } from './entities/company-profile.entity';
import { Specialty } from './entities/specialty.entity';
import * as bcrypt from 'bcrypt';
import { In } from 'typeorm';

async function seedDatabase() {
    try {
        console.log('🔄 Conectando ao banco de dados...');

        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }

        console.log('🔄 Populando banco de dados com usuários de teste...');

        const userRepository = AppDataSource.getRepository(User);
        const workshopRepository = AppDataSource.getRepository(WorkshopProfile);
        const companyRepository = AppDataSource.getRepository(CompanyProfile);
        const specialtyRepository = AppDataSource.getRepository(Specialty);

        // Verificar se já existem usuários
        const existingUsers = await userRepository.count();
        if (existingUsers > 0) {
            console.log('⚠️  Usuários já existem no banco. Pulando seed...');
            await AppDataSource.destroy();
            return;
        }

        // Hash da senha padrão
        const hashedPassword = await bcrypt.hash('123456', 10);

        // Criar usuário oficina
        const workshopUser = userRepository.create({
            email: 'oficina@teste.com',
            passwordHash: hashedPassword,
            name: 'Oficina Teste',
            type: 'workshop',
        });
        await userRepository.save(workshopUser);

        // Criar especialidades que serão usadas (caso não existam)
        const specialtyNames = ['Costura', 'Bordado', 'Estamparia'];
        const specialtiesExist = await specialtyRepository.find({
            where: { name: In(specialtyNames) },
        });

        const specialtiesToInsert = specialtyNames.filter(
            (name) => !specialtiesExist.some((s) => s.name === name),
        ).map((name) => specialtyRepository.create({ name }));

        if (specialtiesToInsert.length > 0) {
            await specialtyRepository.save(specialtiesToInsert);
        }

        const specialties = await specialtyRepository.find({
            where: { name: In(specialtyNames) },
        });

        // Criar perfil da oficina, associando o usuário e as especialidades
        const workshopProfile = workshopRepository.create({
            companyName: 'Oficina Teste Ltda',
            productionCapacity: 1000,
            specialties,
            location: { city: 'São Paulo', state: 'SP', address: 'Rua das Oficinas, 123' },
            portfolio: ['Camisetas', 'Vestidos', 'Uniformes'],
            contact: {
                phone: '(11) 99999-9999',
                whatsapp: '(11) 99999-9999',
                website: 'https://oficina-teste.com',
            },
            rating: 4.5,
            completedProjects: 50,
            user: workshopUser,
        });

        await workshopRepository.save(workshopProfile);

        console.log('✅ Usuário oficina criado:', workshopUser.email);

        // Criar usuário empresa
        const companyUser = userRepository.create({
            email: 'empresa@teste.com',
            passwordHash: hashedPassword,
            name: 'Empresa Teste',
            type: 'company',
        });
        await userRepository.save(companyUser);

        // Criar perfil da empresa
        const companyProfile = companyRepository.create({
            user: companyUser,
            companyName: 'Empresa Teste S.A.',
            industry: 'Moda e Confecção',
            contact: {
                phone: '(11) 88888-8888',
                website: 'https://empresa-teste.com',
            },
        });
        await companyRepository.save(companyProfile);

        console.log('✅ Usuário empresa criado:', companyUser.email);

        console.log('🎉 Banco de dados populado com sucesso!');
        console.log('📋 Usuários de teste criados:');
        console.log('   - Oficina: oficina@teste.com / 123456');
        console.log('   - Empresa: empresa@teste.com / 123456');

        await AppDataSource.destroy();
    } catch (error) {
        console.error('❌ Erro ao popular banco de dados:', error);
        process.exit(1);
    }
}

// Executar se chamado diretamente
if (require.main === module) {
    seedDatabase();
}

export default seedDatabase;
