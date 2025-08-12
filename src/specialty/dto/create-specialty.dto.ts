// create-specialty.dto.ts
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateSpecialtyDto {
    @IsString()
    @IsNotEmpty()
    name: string;
}
