import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from '../entities/message.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { Match } from '../entities/match.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class MessagesService {
    constructor(
        @InjectRepository(Message)
        private messagesRepository: Repository<Message>,
        @InjectRepository(Match)
        private matchesRepository: Repository<Match>,
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    async create(createDto: CreateMessageDto): Promise<Message> {
        const match = await this.matchesRepository.findOne({
            where: { id: createDto.matchId },
            relations: ['workshop', 'company'],
        });
        if (!match) throw new NotFoundException('Match não encontrado');

        // Verifica se sender é participante do match
        if (![match.workshop.id, match.company.id].includes(createDto.senderId)) {
            throw new ForbiddenException('Usuário não faz parte deste match');
        }

        const sender = await this.usersRepository.findOneBy({ id: createDto.senderId });
        if (!sender) throw new NotFoundException('Usuário remetente não encontrado');

        const message = this.messagesRepository.create({
            match,
            sender,
            content: createDto.content,
        });

        return this.messagesRepository.save(message);
    }

    async findByMatch(matchId: string): Promise<Message[]> {
        return this.messagesRepository.find({
            where: { match: { id: matchId } },
            relations: ['sender'],
            order: { timestamp: 'ASC' },
        });
    }
}
