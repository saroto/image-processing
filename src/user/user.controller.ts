import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import { TransformInterceptor } from 'src/interceptor/transform.interceptor';
import { ApiBasicAuth } from '@nestjs/swagger';
@Controller('user')
@UseGuards(JwtAuthGuard)
@UseInterceptors(TransformInterceptor)
@ApiBasicAuth('bearer')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }



  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }


}
