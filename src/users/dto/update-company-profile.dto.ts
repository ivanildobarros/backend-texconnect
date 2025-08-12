// src/users/dto/update-company-profile.dto.ts
import { IsOptional, IsString, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class ContactCompany {
    @IsString()
    phone: string;

    @IsOptional()
    @IsString()
    website?: string;
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
