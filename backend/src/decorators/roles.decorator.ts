import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../modules/users/User.entity';

export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);
