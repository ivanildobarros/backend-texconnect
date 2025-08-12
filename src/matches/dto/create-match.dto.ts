import { IsUUID, IsEnum } from 'class-validator';

export enum MatchStatus {
    PENDING = 'pending',
    ACCEPTED = 'accepted',
    REJECTED = 'rejected',
    IN_PROGRESS = 'in_progress',
    COMPLETED = 'completed',
}

export class CreateMatchDto {
    @IsUUID()
    demandId: string;

    @IsUUID()
    workshopId: string;

    @IsUUID()
    companyId: string;

    @IsEnum(MatchStatus)
    status: MatchStatus = MatchStatus.PENDING;
}
