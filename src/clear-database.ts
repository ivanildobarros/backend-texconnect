import { DataSource } from 'typeorm';
import { AppDataSource } from './data-source';

async function clearDatabase() {
    try {
        console.log('Conectando ao banco de dados...');

        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }

        console.log('Limpando banco de dados...');

        // Desabilitar verificações de chave estrangeira temporariamente
        await AppDataSource.query('SET FOREIGN_KEY_CHECKS = 0');

        // Obter todas as tabelas
        const entities = AppDataSource.entityMetadatas;

        for (const entity of entities) {
            const repository = AppDataSource.getRepository(entity.name);
            await repository.clear();
            console.log(`Tabela ${entity.tableName} limpa`);
        }

        // Reabilitar verificações de chave estrangeira
        await AppDataSource.query('SET FOREIGN_KEY_CHECKS = 1');

        console.log('Banco de dados limpo com sucesso!');

        await AppDataSource.destroy();
    } catch (error) {
        console.error('Erro ao limpar banco de dados:', error);
        process.exit(1);
    }
}

// Executar se chamado diretamente
if (require.main === module) {
    clearDatabase();
}

export default clearDatabase;