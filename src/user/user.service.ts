import { SearchUserDto } from './dto/search-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UserEntity } from './entities/user.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private repository: Repository<UserEntity>,
  ) {}

  async create(dto: CreateUserDto) {
    const user = await this.repository.findOne({ email: dto.email });
    if (user) {
      throw new HttpException(
        'Эта почта уже используется',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.repository.save(dto);
  }

  findAll() {
    return this.repository.find();
  }

  findByCond(cond: LoginUserDto) {
    return this.repository.findOne(cond);
  }
  findById(id: number) {
    return this.repository.findOne(id);
  }
  async update(id: number, dto: UpdateUserDto) {
    const user = await this.repository.findOne({ email: dto.email });
    if (user) {
      throw new HttpException(
        'Эта почта уже используется',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.repository.update(id, dto);
  }

  async search(dto: SearchUserDto) {
    const qb = this.repository.createQueryBuilder('u');
    qb.limit(dto.limit || 0);
    qb.take(dto.take || 10);

    if (dto.fullName) {
      qb.andWhere(`u.fullName ILIKE :fullName`);
    }

    if (dto.email) {
      qb.andWhere(`u.email ILIKE :email`);
    }
    qb.setParameters({
      email: `%${dto.email}%`,
      fullName: `%${dto.fullName}%`,
    });
    const [items, total] = await qb.getManyAndCount();
    return { items, total };
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
