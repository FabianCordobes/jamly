import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Space } from './Space.entity';
import { CreateSpaceDto } from './dto/create-space.dto';
import { UsersService } from '../users/user.service';
import { User } from '../users/User.entity';

@Injectable()
export class SpacesService {
  constructor(
    @InjectRepository(Space)
    private readonly spaceRepository: Repository<Space>,
    private readonly usersService: UsersService,
  ) {}

  async create(createSpaceDto: CreateSpaceDto): Promise<Space> {
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
}
