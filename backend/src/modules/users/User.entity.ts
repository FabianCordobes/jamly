import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Space } from '../spaces/Space.entity';
import { Booking } from '../bookings/Booking.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: 'artist' }) // 'artist' o 'owner'
  role: 'artist' | 'owner';

  @OneToMany(() => Space, (space) => space.owner)
  spaces: Space[];

  @OneToMany(() => Booking, (booking) => booking.artist)
  bookings: Booking[];
}
