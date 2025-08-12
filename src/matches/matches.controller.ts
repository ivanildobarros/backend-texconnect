import { Controller, Post, Get, Put, Param, Body, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MatchesService } from './matches.service';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
import { User } from '../common/decorators/user.decorator';

@Controller('matches')
@UseGuards(JwtAuthGuard)
export class MatchesController {
    constructor(private matchesService: MatchesService) { }


    @Post()
    async create(@User() user, @Body() createDto: CreateMatchDto) {
        // Apenas oficinas podem criar candidatura
        if (user.type !== 'workshop') throw new Error('Apenas oficinas podem criar candidaturas');
        if (user.userId !== createDto.workshopId) throw new Error('Você só pode criar candidaturas para você mesmo');

        return this.matchesService.create(createDto);
    }

    @Get()
    async findAll(@User() user) {
        return this.matchesService.findAllByUser(user.userId);
    }

    @Get('demand/:demandId')
    async findByDemand(@User() user, @Param('demandId') demandId: string) {
        // Apenas empresa proprietária da demanda pode ver candidaturas
        // Validar essa regra ao buscar demandas ou implementar no service

        return this.matchesService.findAllByDemand(demandId);
    }

    @Put(':id')
    async update(@User() user, @Param('id') id: string, @Body() updateDto: UpdateMatchDto) {
        // Somente empresa ou oficina envolvida pode atualizar status
        return this.matchesService.update(id, updateDto);
    }
}
