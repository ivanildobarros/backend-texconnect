import { IsOptional, IsString, IsArray, ValidateNested, IsNumber, IsObject } from 'class-validator';
import { Type } from 'class-transformer';

class Location {
    @IsString()
    city: string;

    @IsString()
    state: string;

    @IsString()
    address: string;
}

class ContactWorkshop {
    @IsString()
    phone: string;

    @IsString()
    whatsapp: string;

    @IsOptional()
    @IsString()
    website?: string;
}

class ContactCompany {
    @IsString()
    phone: string;

    @IsOptional()
    @IsString()
    website?: string;
}

export class UpdateWorkshopProfileDto {
    @IsOptional()
    @IsString()
    companyName?: string;

    @IsOptional()
    @IsNumber()
    productionCapacity?: number;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    specialties?: string[];

    @IsOptional()
    @IsObject()
    @ValidateNested()
    @Type(() => Location)
    location?: Location;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    portfolio?: string[];

    @IsOptional()
    @IsObject()
    @ValidateNested()
    @Type(() => ContactWorkshop)
    contact?: ContactWorkshop;

    @IsOptional()
    @IsNumber()
    rating?: number;

    @IsOptional()
    @IsNumber()
    completedProjects?: number;
}

export class UpdateCompanyProfileDto {
    @IsOptional()
    @IsString()
    companyName?: string;

    @IsOptional()
    @IsString()
    industry?: string;

    @IsOptional()
    @IsObject()
    @ValidateNested()
    @Type(() => ContactCompany)
    contact?: ContactCompany;
}

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    name?: string;
}
