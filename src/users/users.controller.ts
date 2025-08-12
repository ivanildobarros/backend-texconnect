import {
    Controller,
    Get,
    Put,
    Body,
    UseGuards
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User as UserDecorator } from '../common/decorators/user.decorator';
import { UpdateUserDto } from '../users/dto/update-user.dto';
import { UpdateWorkshopProfileDto } from '../users/dto/update-workshop-profile.dto';
import { UpdateCompanyProfileDto } from '../users/dto/update-company-profile.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    async getProfile(@UserDecorator() user: any) {
        return this.usersService.findById(user.userId);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async getAllUsers() {
        return this.usersService.findAll();
    }

    @UseGuards(JwtAuthGuard)
    @Get('workshops')
    async getAllWorkshops() {
        const workshops = await this.usersService.findAllWorkshops();
        return {
            success: true,
            data: workshops,
        };
    }


    @UseGuards(JwtAuthGuard)
    @Put('me')
    async updateProfile(
        @UserDecorator() user: any,
        @Body() body: {
            userData?: UpdateUserDto;
            workshopData?: UpdateWorkshopProfileDto;
            companyData?: UpdateCompanyProfileDto;
        },
    ) {
        return this.usersService.updateUserProfile(
            user.userId,
            body.userData,
            body.workshopData,
            body.companyData,
        );
    }
}
