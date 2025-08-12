import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';

@Controller('messages')
@UseGuards(JwtAuthGuard)
export class MessagesController {
    constructor(private messagesService: MessagesService) { }

    @Post()
    async create(@Body() createDto: CreateMessageDto) {
        return this.messagesService.create(createDto);
    }

    @Get(':matchId')
    async findByMatch(@Param('matchId') matchId: string) {
        return this.messagesService.findByMatch(matchId);
    }
}
