import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    OneToMany,
} from 'typeorm';
import { CompanyProfile } from './company-profile.entity';
import { Match } from './match.entity';

export enum DemandStatus {
    OPEN = 'open',
    MATCHED = 'matched',
    IN_PROGRESS = 'in_progress',
    COMPLETED = 'completed',
}


@Entity()
export class Demand {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column('text')
    description: string;

    @Column('int')
    volume: number;

    @Column('timestamp')
    deadline: Date;

    @Column()
    specialty: string;

    @Column('float')
    budget: number;

    @Column({
        type: 'enum',
        enum: ['open', 'matched', 'in_progress', 'completed'],
        default: 'open',
    })
    status: DemandStatus;

    @ManyToOne(() => CompanyProfile, (company) => company.demands)
    company: CompanyProfile;

    @Column({ nullable: true })
    matchedWorkshopId?: string;

    @CreateDateColumn()
    createdAt: Date;

    @OneToMany(() => Match, (match) => match.demand)
    matches: Match[];
}
