import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
} from '@nestjs/common';
import { SpecialtyService } from './specialty.service';
import { CreateSpecialtyDto } from './dto/create-specialty.dto';

@Controller('specialties')
export class SpecialtyController {
    constructor(private readonly specialtyService: SpecialtyService) { }

    @Post()
    create(@Body() createDto: CreateSpecialtyDto) {
        return this.specialtyService.create(createDto);
    }

    @Get()
    findAll() {
        return this.specialtyService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.specialtyService.findOne(id);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.specialtyService.remove(id);
    }
}
