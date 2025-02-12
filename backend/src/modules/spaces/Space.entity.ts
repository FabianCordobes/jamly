import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../users/User.entity';
import { Booking } from '../bookings/Booking.entity';

@Entity()
export class Space {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column()
  location: string;

  @Column('decimal')
  pricePerHour: number;

  @Column('jsonb', { nullable: true })
  equipment: string[];

  @ManyToOne(() => User, (user) => user.spaces)
  owner: User;

  @OneToMany(() => Booking, (booking) => booking.space)
  bookings: Booking[];

  @Column({ default: true })
  isAvailable: boolean;

  @Column({ type: 'time', nullable: true })
  openTime: string;

  @Column({ type: 'time', nullable: true })
  closeTime: string;
  
}
