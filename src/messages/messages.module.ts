import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from '../entities/message.entity';
import { Match } from '../entities/match.entity';
import { User } from '../entities/user.entity';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Message, Match, User])],
    providers: [MessagesService],
    controllers: [MessagesController],
})
export class MessagesModule { }
