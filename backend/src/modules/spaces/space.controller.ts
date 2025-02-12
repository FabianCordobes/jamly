import { Body, Controller, Get, Param, Patch, Post, Delete, Request, UseGuards, ForbiddenException } from "@nestjs/common";
import { CreateSpaceDto } from "./dto/create-space.dto";
import { SpacesService } from "./space.service";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "src/guards/roles.guard";
import { Roles } from "src/decorators/roles.decorator";
import { UserRole } from "../users/User.entity";

@Controller('spaces')
export class SpacesController {
  constructor(private readonly spacesService: SpacesService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.OWNER) // 🔐 Solo `admin` y `owner` pueden crear espacios
  @Post()
  async create(@Body() createSpaceDto: CreateSpaceDto, @Request() req) {
    return this.spacesService.create(createSpaceDto, req.user);
  }

  @Get()
  async findAll() {
    return this.spacesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.spacesService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.OWNER) // 🔐 Solo los dueños del espacio pueden modificar disponibilidad
  @Patch(':id/availability')
  async updateAvailability(@Param('id') id: string, @Body() body: { isAvailable: boolean }, @Request() req) {
    return this.spacesService.updateAvailability(id, body.isAvailable, req.user);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.OWNER, UserRole.ADMIN) // 🔐 Solo `owner` y `admin` pueden modificar el espacio
  @Patch(':id')
  async updateSpace(@Param('id') id: string, @Body() body: any, @Request() req) {
    return this.spacesService.update(id, body, req.user);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN) // 🔐 Solo `admin` puede eliminar cualquier espacio
  @Delete(':id')
  async deleteSpace(@Param('id') id: string) {
    return this.spacesService.delete(id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.OWNER) // 🔐 Solo dueños pueden modificar horarios
  @Patch(':id/schedule')
  async updateSchedule(@Param('id') id: string, @Body() body: { openTime: string; closeTime: string }, @Request() req) {
    return this.spacesService.updateSchedule(id, body.openTime, body.closeTime, req.user);
  }
}
