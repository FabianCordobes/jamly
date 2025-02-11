import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from './Booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UsersService } from '../users/user.service';
import { SpacesService } from '../spaces/space.service';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    private readonly usersService: UsersService,
    private readonly spacesService: SpacesService,
  ) {}

  async create(createBookingDto: CreateBookingDto): Promise<Booking> {
    const artist = await this.usersService.findOne(createBookingDto.artistId);
    if (!artist) {
      throw new NotFoundException('Artist not found');
    }

    const space = await this.spacesService.findOne(createBookingDto.spaceId);
    if (!space) {
      throw new NotFoundException('Space not found');
    }

    const newBooking = this.bookingRepository.create({
      ...createBookingDto,
      artist,
      space,
    });

    return this.bookingRepository.save(newBooking);
  }

  async findAll(): Promise<Booking[]> {
    return this.bookingRepository.find({ relations: ['artist', 'space'] });
  }

  async findOne(id: string): Promise<Booking> {
    const booking = await this.bookingRepository.findOne({ where: { id }, relations: ['artist', 'space'] });
    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }
    return booking;
  }
}
