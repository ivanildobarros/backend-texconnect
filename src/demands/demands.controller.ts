import { Controller, Post, Get, Put, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { DemandsService } from './demands.service';
import { CreateDemandDto } from './create-demand.dto';
import { UpdateDemandDto } from './dto/update-demand.dto';
import { User } from '../common/decorators/user.decorator';

@Controller('demands')
@UseGuards(JwtAuthGuard)
export class DemandsController {
    constructor(private demandsService: DemandsService) { }

    @Post()
    async create(@User() user, @Body() dto: CreateDemandDto) {
        if (user.type !== 'company') throw new Error('Apenas empresas podem criar demandas');
        return this.demandsService.create(user.userId, dto);
    }

    @Get()
    async findAll(@User() user) {
        if (user.type === 'company') {
            // Empresas veem apenas suas próprias demandas
            return this.demandsService.findAllByCompany(user.userId);
        } else {
            // Oficinas veem todas as demandas abertas
            return this.demandsService.findAllOpen();
        }
    }

    @Get(':id')
    async findOne(@User() user, @Param('id') id: string) {
        const demand = await this.demandsService.findById(id);
        if (demand.company.id !== user.userId) throw new Error('Não autorizado');
        return demand;
    }

    @Put(':id')
    async update(@User() user, @Param('id') id: string, @Body() dto: UpdateDemandDto) {
        return this.demandsService.update(id, user.userId, dto);
    }

    @Delete(':id')
    async remove(@User() user, @Param('id') id: string) {
        return this.demandsService.remove(id, user.userId);
    }
}
