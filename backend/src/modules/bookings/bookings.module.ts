import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { Booking } from './Booking.entity';
import { UsersModule } from '../users/user.module';
import { SpacesModule } from '../spaces/space.module';

@Module({
  imports: [TypeOrmModule.forFeature([Booking]), UsersModule, SpacesModule],
  controllers: [BookingsController],
  providers: [BookingsService],
})
export class BookingsModule {}
