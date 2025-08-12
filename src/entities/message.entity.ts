import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
} from 'typeorm';
import { Match } from './match.entity';
import { User } from './user.entity';

@Entity()
export class Message {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Match)
    match: Match;

    @ManyToOne(() => User, (user) => user.messages)
    sender: User;


    @Column('text')
    content: string;

    @CreateDateColumn()
    timestamp: Date;

    @Column({ default: false })
    read: boolean;
}
