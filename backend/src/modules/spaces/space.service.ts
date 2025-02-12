import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Space } from './Space.entity';
import { CreateSpaceDto } from './dto/create-space.dto';
import { UsersService } from '../users/user.service';
import { User, UserRole } from '../users/User.entity';

@Injectable()
export class SpacesService {
  constructor(
    @InjectRepository(Space)
    private readonly spaceRepository: Repository<Space>,
    private readonly usersService: UsersService,
  ) {}

  async create(createSpaceDto: CreateSpaceDto, user: User): Promise<Space> {
    if (user.role !== UserRole.ADMIN && user.role !== UserRole.OWNER) {
      throw new ForbiddenException('No tienes permisos para crear un espacio.');
    }

    const owner = await this.usersService.findOne(createSpaceDto.ownerId);
    if (!owner) {
      throw new NotFoundException('Owner not found');
    }

    const newSpace = this.spaceRepository.create({
      ...createSpaceDto,
      owner,
    });

    return this.spaceRepository.save(newSpace);
  }

  async findAll(): Promise<Space[]> {
    return this.spaceRepository.find({ relations: ['owner'] });
  }

  async findOne(id: string): Promise<Space> {
    const space = await this.spaceRepository.findOne({ where: { id }, relations: ['owner'] });
    if (!space) {
      throw new NotFoundException(`Space with ID ${id} not found`);
    }
    return space;
  }

  async updateAvailability(spaceId: string, isAvailable: boolean, user: User) {
    const space = await this.spaceRepository.findOne({ where: { id: spaceId }, relations: ['owner'] });

    if (!space) {
      throw new NotFoundException(`No se encontró el espacio con ID ${spaceId}`);
    }

    if (user.role !== UserRole.ADMIN && space.owner.id !== user.id) {
      throw new ForbiddenException('No tienes permisos para modificar este espacio.');
    }

    space.isAvailable = isAvailable;
    return this.spaceRepository.save(space);
  }

  async update(spaceId: string, updateData: any, user: User) {
    const space = await this.spaceRepository.findOne({ where: { id: spaceId }, relations: ['owner'] });

    if (!space) {
      throw new NotFoundException(`No se encontró el espacio con ID ${spaceId}`);
    }

    if (user.role !== UserRole.ADMIN && space.owner.id !== user.id) {
      throw new ForbiddenException('No tienes permisos para modificar este espacio.');
    }

    Object.assign(space, updateData);
    return this.spaceRepository.save(space);
  }

  async delete(spaceId: string) {
    const space = await this.spaceRepository.findOne({ where: { id: spaceId } });

    if (!space) {
      throw new NotFoundException(`No se encontró el espacio con ID ${spaceId}`);
    }

    await this.spaceRepository.delete(spaceId);
    return { message: 'Espacio eliminado correctamente.' };
  }

  async updateSchedule(spaceId: string, openTime: string, closeTime: string, user: any) {
    const space = await this.spaceRepository.findOne({ where: { id: spaceId }, relations: ['owner'] });
  
    if (!space) {
      throw new NotFoundException(`No se encontró el espacio con ID ${spaceId}`);
    }
  
    if (user.role !== UserRole.ADMIN && space.owner.id !== user.id) {
      throw new ForbiddenException('No tienes permisos para modificar el horario de este espacio.');
    }
  
    // Validar que `openTime` sea menor que `closeTime`
    if (openTime >= closeTime) {
      throw new BadRequestException('El horario de apertura debe ser antes del cierre.');
    }
  
    space.openTime = openTime;
    space.closeTime = closeTime;
    return this.spaceRepository.save(space);
  }
  
}
