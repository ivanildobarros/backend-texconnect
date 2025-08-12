import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    OneToOne,
    OneToMany,
} from 'typeorm';
import { WorkshopProfile } from './workshop-profile.entity';
import { CompanyProfile } from './company-profile.entity';
import { Match } from './match.entity';
import { Message } from './message.entity';

export type UserType = 'workshop' | 'company';

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    email: string;

    @Column()
    name: string;

    @Column({ type: 'enum', enum: ['workshop', 'company'] })
    type: UserType;

    @Column()
    passwordHash: string;

    @CreateDateColumn()
    createdAt: Date;

    @OneToOne(() => WorkshopProfile, (profile) => profile.user, {
        cascade: true,
        nullable: true,
    })
    workshopProfile?: WorkshopProfile;

    @OneToOne(() => CompanyProfile, (profile) => profile.user, {
        cascade: true,
        nullable: true,
    })
    companyProfile?: CompanyProfile;

    @OneToMany(() => Match, (match) => match.workshop)
    matchesAsWorkshop: Match[];

    @OneToMany(() => Match, (match) => match.company)
    matchesAsCompany: Match[];

    @OneToMany(() => Message, (message) => message.sender)
    messages: Message[];
}