import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
} from 'typeorm';
import { Demand } from './demand.entity';
import { User } from './user.entity';

export type MatchStatus =
    | 'pending'
    | 'accepted'
    | 'rejected'
    | 'in_progress'
    | 'completed';

@Entity()
export class Match {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Demand, (demand) => demand.matches)
    demand: Demand;

    @ManyToOne(() => User, (user) => user.matchesAsWorkshop)
    workshop: User;

    @ManyToOne(() => User, (user) => user.matchesAsCompany)
    company: User;

    @Column({
        type: 'enum',
        enum: ['pending', 'accepted', 'rejected', 'in_progress', 'completed'],
        default: 'pending',
    })
    status: MatchStatus;

    @CreateDateColumn()
    createdAt: Date;

    @Column({ nullable: true })
    acceptedAt?: Date;

    @Column({ nullable: true })
    completedAt?: Date;
}
