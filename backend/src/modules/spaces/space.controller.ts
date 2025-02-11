import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { CreateSpaceDto } from "./dto/create-space.dto";
import { SpacesService } from "./space.service";

@Controller('spaces')
export class SpacesController {
  constructor(private readonly spacesService: SpacesService) {}

  @Post()
  async create(@Body() createSpaceDto: CreateSpaceDto) {
    return this.spacesService.create(createSpaceDto);
  }

  @Get()
  async findAll() {
    return this.spacesService.findAll();
  }
  
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.spacesService.findOne(id);
  }
}
