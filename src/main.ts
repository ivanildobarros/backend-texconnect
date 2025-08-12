import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Adicionar filtro de exceções global
    app.useGlobalFilters(new AllExceptionsFilter());

    // Adicionar interceptor de logging
    app.useGlobalInterceptors(new LoggingInterceptor());

    // Configurar Helmet com configurações mais permissivas para desenvolvimento
    app.use(helmet({
        crossOriginEmbedderPolicy: false,
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                styleSrc: ["'self'", "'unsafe-inline'"],
                scriptSrc: ["'self'"],
                imgSrc: ["'self'", "data:", "https:"],
            },
        },
    }));

    // Configurar CORS de forma mais específica para Docker
    app.enableCors({
        origin: [
            'http://localhost:3000',
            'http://localhost:3001',
            'http://localhost:5173',
            'http://localhost:5174',
            'http://127.0.0.1:3000',
            'http://127.0.0.1:3001',
            'http://127.0.0.1:5173',
            'http://127.0.0.1:5174',
            'http://127.0.0.1:5000',
            // Adicionar suporte para Docker
            'http://host.docker.internal:3000',
            'http://host.docker.internal:3001',
            // Adicione aqui a URL do seu frontend web
        ],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: [
            'Origin',
            'X-Requested-With',
            'Content-Type',
            'Accept',
            'Authorization',
            'Cache-Control',
            'X-HTTP-Method-Override',
        ],
        credentials: false, // Mudando para false para evitar problemas com CORS
        preflightContinue: false,
        optionsSuccessStatus: 200,
    });

    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true
    }));

    const port = process.env.PORT || 3001;
    await app.listen(port, '0.0.0.0'); // Bind to all interfaces for Docker

    console.log(`🚀 Application is running on: http://localhost:${port}`);
    console.log('🌐 CORS configurado para as seguintes origens:');
    console.log('   - http://localhost:3000, http://localhost:3001');
    console.log('   - http://localhost:5173, http://localhost:5174');
    console.log('   - http://127.0.0.1:3000, http://127.0.0.1:3001');
    console.log('   - http://127.0.0.1:5173, http://127.0.0.1:5174');
    console.log('   - http://host.docker.internal:3000, http://host.docker.internal:3001');
    console.log('📋 Para popular o banco: npm run seed');
}

bootstrap().catch(error => {
    console.error('❌ Erro ao inicializar aplicação:', error);
    process.exit(1);
});