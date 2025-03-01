import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';

// User endpoint 
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    return this.usersService.getUserById(Number(id));
  }
}
