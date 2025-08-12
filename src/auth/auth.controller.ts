import { Controller, Post, Body, Logger, HttpException, HttpStatus, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
    private readonly logger = new Logger(AuthController.name);

    constructor(private authService: AuthService) { }

    @Get('test')
    test() {
        return {
            message: 'API funcionando!',
            timestamp: new Date().toISOString(),
            environment: process.env.NODE_ENV || 'development'
        };
    }

    @Post('register')
    async register(@Body() data: RegisterDto) {
        try {
            this.logger.log(`Tentativa de registro para email: ${data.email}`);
            const user = await this.authService.register(data);
            const tokenResult = await this.authService.login(user);
            this.logger.log(`Usuário registrado com sucesso: ${user.id}`);

            return {
                success: true,
                message: 'Usuário registrado com sucesso',
                data: {
                    user: {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        type: user.type,
                        createdAt: user.createdAt
                    },
                    token: tokenResult.access_token
                }
            };
        } catch (error) {
            this.logger.error(`Erro no registro: ${error.message}`);
            throw error;
        }
    }

    @Post('login')
    async login(@Body() data: LoginDto) {
        try {
            this.logger.log(`Tentativa de login para email: ${data.email}`);

            if (!data.email || !data.password) {
                throw new HttpException('Email e senha são obrigatórios', HttpStatus.BAD_REQUEST);
            }

            const user = await this.authService.validateUser(data.email, data.password);
            const result = await this.authService.login(user);

            this.logger.log(`Login realizado com sucesso para usuário: ${user.id}`);

            // Retornar no formato esperado pelo frontend
            return {
                success: true,
                message: 'Login realizado com sucesso',
                data: {
                    user: {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        type: user.type,
                        createdAt: user.createdAt
                    },
                    token: result.access_token
                }
            };
        } catch (error) {
            this.logger.error(`Erro no login para ${data.email}: ${error.message}`);
            throw error;
        }
    }
}