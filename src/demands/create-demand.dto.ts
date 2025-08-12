import { IsString, IsNotEmpty, IsNumber, IsDateString, IsEnum, IsOptional } from 'class-validator';

export enum DemandStatus {
    OPEN = 'open',
    MATCHED = 'matched',
    IN_PROGRESS = 'in_progress',
    COMPLETED = 'completed',
}

export class CreateDemandDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsNumber()
    volume: number;

    @IsDateString()
    deadline: string;

    @IsString()
    specialty: string;

    @IsNumber()
    budget: number;

    @IsOptional()
    @IsEnum(DemandStatus)
    status?: DemandStatus;
}
