import { IsUUID, IsString, IsNotEmpty } from 'class-validator';

export class CreateMessageDto {
    @IsUUID()
    matchId: string;

    @IsUUID()
    senderId: string;

    @IsString()
    @IsNotEmpty()
    content: string;
}
