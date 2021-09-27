import { PostEntity } from './entities/post.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntity)
    private postRepository: Repository<PostEntity>,
  ) {}
  create(dto: CreatePostDto) {
    return this.postRepository.save(dto);
  }

  findAll() {
    return `This action returns all post`;
  }

  async findOne(id: number) {
    const find = await this.postRepository.findOne(id);
    if (!find) {
      throw new NotFoundException('Статья не найдена');
    }
    return find;
  }

  async update(id: number, dto: UpdatePostDto) {
    const find = await this.postRepository.findOne(id);
    if (!find) {
      throw new NotFoundException('Статья не найдена');
    }
    return this.postRepository.update(id, dto);
  }

  async remove(id: number) {
    const find = await this.postRepository.findOne(id);
    if (!find) {
      throw new NotFoundException('Статья не найдена');
    }

    return this.postRepository.delete(id);
  }
}
