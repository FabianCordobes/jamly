import { Body, Controller, Delete, ForbiddenException, Get, Param, Post, Query, Request, UseGuards } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserRole } from '../users/User.entity';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  async create(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingsService.create(createBookingDto);
  }

  @Get()
  async findAll() {
    return this.bookingsService.findAll();
  }


  @UseGuards(AuthGuard('jwt')) // 🔐 Solo autenticados pueden ver reservas
  @Get()
  async findBookings(
    @Query('userId') userId?: string,
    @Query('spaceId') spaceId?: string,
    @Query('date') date?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('orderBy') orderBy = 'startTime', // Orden por defecto: `startTime`
    @Query('orderDirection') orderDirection = 'ASC' // Dirección por defecto: ascendente
  ) {
    return this.bookingsService.findFilteredBookings(
      userId,
      spaceId,
      date,
      startDate,
      endDate,
      parseInt(page, 10),
      parseInt(limit, 10),
      orderBy,
      orderDirection.toUpperCase() === 'DESC' ? 'DESC' : 'ASC' // Validación simple
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id') // 🔐 Solo el dueño de la reserva o admin pueden eliminarla
  async cancelBooking(@Param('id') id: string, @Request() req) {
    return this.bookingsService.delete(id, req.user);
  }
}
