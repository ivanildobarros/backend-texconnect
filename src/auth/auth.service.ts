import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        private jwtService: JwtService,
    ) { }

    async register(data: RegisterDto): Promise<User> {
        const existing = await this.usersRepository.findOneBy({ email: data.email });
        if (existing) throw new UnauthorizedException('Email já registrado');

        const hashedPassword = await bcrypt.hash(data.password, 10);

        const user = this.usersRepository.create({
            name: data.name,
            email: data.email,
            type: data.type,
            passwordHash: hashedPassword,
        });

        // Criar perfil workshop ou company vazio para evitar null
        if (data.type === 'workshop') user.workshopProfile = null;
        else user.companyProfile = null;

        return this.usersRepository.save(user);
    }

    async validateUser(email: string, password: string): Promise<User> {
        const user = await this.usersRepository.findOneBy({ email });
        if (!user) throw new UnauthorizedException('Usuário não encontrado');

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) throw new UnauthorizedException('Senha inválida');

        return user;
    }

    async login(user: User): Promise<{ access_token: string }> {
        const payload = { sub: user.id, email: user.email, type: user.type };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
