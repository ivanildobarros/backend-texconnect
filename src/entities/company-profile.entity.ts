import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToOne,
    OneToMany,
    JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Demand } from './demand.entity';

@Entity()
export class CompanyProfile {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    // company-profile.entity.ts
    @OneToOne(() => User, (user) => user.companyProfile)
    @JoinColumn()
    user: User;

    @Column()
    companyName: string;

    @Column()
    industry: string;

    @OneToMany(() => Demand, (demand) => demand.company)
    demands: Demand[];

    @Column('json')
    contact: {
        phone: string;
        website?: string;
    };
}