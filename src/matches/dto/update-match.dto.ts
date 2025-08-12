import { PartialType } from '@nestjs/mapped-types';
import { CreateMatchDto, MatchStatus } from './create-match.dto';
import { IsEnum, IsOptional } from 'class-validator';

export class UpdateMatchDto extends PartialType(CreateMatchDto) {
    @IsOptional()
    @IsEnum(MatchStatus)
    status?: MatchStatus;
}
