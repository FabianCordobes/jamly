import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Space } from '../spaces/Space.entity';
import { Booking } from '../bookings/Booking.entity';

export enum UserRole {
  ADMIN = 'admin',
  OWNER = 'owner',
  ARTIST = 'artist',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.ARTIST, // Por defecto, los nuevos usuarios serán artistas
  })
  role: UserRole;

  @OneToMany(() => Space, (space) => space.owner)
  spaces: Space[];

  @OneToMany(() => Booking, (booking) => booking.artist)
  bookings: Booking[];
}
