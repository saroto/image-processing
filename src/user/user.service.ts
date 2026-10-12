import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService
  ) { }
  create(createUserDto: CreateUserDto) {
    const query = this.prisma.user.create({
      data: {
        username: createUserDto.username,
        email: createUserDto.email,
        password: createUserDto.password,
      }
    })
    return query;
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    const query = this.prisma.user.findUnique({
      where: {
        id: id,
      }
    })
    return query;

  }

  findByEmail(email: string) {
    const query = this.prisma.user.findUnique({
      where: {
        email: email,
      }
    })
    return query;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
