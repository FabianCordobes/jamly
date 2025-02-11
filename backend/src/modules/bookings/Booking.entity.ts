import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../users/User.entity';
import { Space } from '../spaces/Space.entity';

@Entity()
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('timestamp')
  startTime: Date;

  @Column('timestamp')
  endTime: Date;

  @ManyToOne(() => User, (user) => user.bookings)
  artist: User;

  @ManyToOne(() => Space, (space) => space.bookings)
  space: Space;
}
