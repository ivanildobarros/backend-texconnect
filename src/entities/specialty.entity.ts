import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { WorkshopProfile } from './workshop-profile.entity';

@Entity('specialties')
export class Specialty {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string;

    @ManyToMany(() => WorkshopProfile, (workshop) => workshop.specialties)
    workshops: WorkshopProfile[];
}
