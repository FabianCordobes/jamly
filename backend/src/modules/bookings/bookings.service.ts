import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from './Booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UsersService } from '../users/user.service';
import { SpacesService } from '../spaces/space.service';
import { UserRole } from '../users/User.entity';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    private readonly usersService: UsersService,
    private readonly spacesService: SpacesService,
  ) {}

  async create(createBookingDto: CreateBookingDto): Promise<Booking> {
    const { startTime, endTime, artistId, spaceId } = createBookingDto;

    if (new Date(startTime) >= new Date(endTime)) {
      throw new BadRequestException('El inicio de la reserva debe ser antes del final.');
    }

    const artist = await this.usersService.findOne(artistId);
    if (!artist) {
      throw new NotFoundException(`No se encontró el usuario con ID ${artistId}`);
    }

    const space = await this.spacesService.findOne(spaceId);
    if (!space) {
      throw new NotFoundException(`No se encontró el espacio con ID ${spaceId}`);
    }
    if (!space.isAvailable) {
      throw new BadRequestException('Este espacio no está disponible para reservas.');
    }

    if (space.openTime && space.closeTime) {
      const startHour = startTime.toISOString().split('T')[1].substring(0, 5); // Extraer HH:mm de startTime
      const endHour = endTime.toISOString().split('T')[1].substring(0, 5); // Extraer HH:mm de endTime
    
      if (startHour < space.openTime || endHour > space.closeTime) {
        throw new BadRequestException(
          `Las reservas solo están permitidas entre ${space.openTime} y ${space.closeTime}.`
        );
      }
    }

    // Verificar superposición de reservas en el mismo espacio
    const existingBooking = await this.bookingRepository
      .createQueryBuilder('booking')
      .where('booking.spaceId = :spaceId', { spaceId })
      .andWhere(
        '(:startTime BETWEEN booking.startTime AND booking.endTime) OR (:endTime BETWEEN booking.startTime AND booking.endTime)',
        { startTime, endTime },
      )
      .getOne();

    if (existingBooking) {
      throw new BadRequestException('El espacio ya está reservado en este horario.');
    }

    // Verificar que el usuario no tenga otra reserva en el mismo espacio al mismo tiempo
    const userBookingConflict = await this.bookingRepository
      .createQueryBuilder('booking')
      .where('booking.artistId = :artistId', { artistId })
      .andWhere(
        '(:startTime BETWEEN booking.startTime AND booking.endTime) OR (:endTime BETWEEN booking.startTime AND booking.endTime)',
        { startTime, endTime },
      )
      .getOne();

    if (userBookingConflict) {
      throw new BadRequestException('Ya tenés una reserva en este horario.');
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

  async findFilteredBookings(
    userId?: string,
    spaceId?: string,
    date?: string,
    startDate?: string,
    endDate?: string,
    page = 1,
    limit = 10,
    orderBy = 'startTime',
    orderDirection: 'ASC' | 'DESC' = 'ASC'
  ): Promise<{ data: Booking[]; total: number; page: number; limit: number }> {
    const query = this.bookingRepository.createQueryBuilder('booking')
      .leftJoinAndSelect('booking.artist', 'artist')
      .leftJoinAndSelect('booking.space', 'space');
  
    if (userId) {
      query.andWhere('booking.artistId = :userId', { userId });
    }
  
    if (spaceId) {
      query.andWhere('booking.spaceId = :spaceId', { spaceId });
    }
  
    if (date) {
      query.andWhere('DATE(booking.startTime) = :date', { date });
    }
  
    if (startDate && endDate) {
      query.andWhere('booking.startTime BETWEEN :startDate AND :endDate', { startDate, endDate });
    }
  
    // Obtener el total de registros sin paginación
    const total = await query.getCount();
  
    // Aplicar ordenamiento
    const validOrderByFields = ['startTime', 'space.pricePerHour']; // Campos permitidos
    if (validOrderByFields.includes(orderBy)) {
      query.orderBy(`booking.${orderBy}`, orderDirection);
    } else {
      query.orderBy('booking.startTime', 'ASC'); // Orden por defecto
    }
  
    // Aplicar paginación
    const data = await query
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();
  
    return {
      data,
      total,
      page,
      limit,
    };
  }

  async delete(id: string, user: any): Promise<{ message: string }> {
    const booking = await this.bookingRepository.findOne({ where: { id }, relations: ['artist', 'space'] });
  
    if (!booking) {
      throw new NotFoundException(`No se encontró la reserva con ID ${id}`);
    }
  
    // Verificar si el usuario tiene permiso para eliminar la reserva
    if (user.role !== UserRole.ADMIN && booking.artist.id !== user.id) {
      throw new ForbiddenException('No tienes permisos para cancelar esta reserva.');
    }
  
    await this.bookingRepository.delete(id);
    return { message: 'Reserva cancelada correctamente.' };
  }
  
  
}
