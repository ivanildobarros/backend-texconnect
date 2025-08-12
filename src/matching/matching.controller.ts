import { Controller, Post, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MatchingService } from './matching.service';

@Controller('matching')
@UseGuards(JwtAuthGuard)
export class MatchingController {
    constructor(private readonly matchingService: MatchingService) { }

    @Post('auto-match/:demandId')
    async autoMatch(@Param('demandId') demandId: string) {
        return this.matchingService.createAutoMatches(demandId);
    }
}
