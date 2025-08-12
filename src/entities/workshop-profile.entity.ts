import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToOne,
    JoinColumn,
    ManyToMany,
    JoinTable,
} from 'typeorm';
import { User } from './user.entity';
import { Specialty } from './specialty.entity';

@Entity()
export class WorkshopProfile {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    // workshop-profile.entity.ts
    @OneToOne(() => User, (user) => user.workshopProfile)
    @JoinColumn()
    user: User;


    @Column()
    companyName: string;

    @Column('int')
    productionCapacity: number;

    // Alterado para relação muitos-para-muitos com Specialty
    @ManyToMany(() => Specialty, (specialty) => specialty.workshops, { cascade: true })
    @JoinTable({
        name: 'workshop_profile_specialties',
        joinColumn: { name: 'workshop_profile_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'specialty_id', referencedColumnName: 'id' },
    })
    specialties: Specialty[];

    @Column('json')
    location: {
        city: string;
        state: string;
        address: string;
    };

    @Column('simple-array')
    portfolio: string[];

    @Column('json')
    contact: {
        phone: string;
        whatsapp: string;
        website?: string;
    };

    @Column('float', { default: 0 })
    rating: number;

    @Column('int', { default: 0 })
    completedProjects: number;
}
