import { SearchPostDto } from './dto/search-post.dto';
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
    return this.postRepository.find({ order: { createdAt: 'DESC' } });
  }

  async popular() {
    const qb = this.postRepository.createQueryBuilder();
    qb.orderBy('views', 'DESC');
    qb.limit(10);
    const [items, total] = await qb.getManyAndCount();
    return { items, total };
  }
  async search(dto: SearchPostDto) {
    const qb = this.postRepository.createQueryBuilder('p');
    qb.limit(dto.limit || 0);
    qb.take(dto.take || 10);
    if (dto.views) {
      qb.orderBy('views', dto.views);
    }
    if (dto.body) {
      qb.andWhere(`p.body ILIKE :body`);
    }
    if (dto.title) {
      qb.andWhere(`p.title ILIKE :title`);
    }
    if (dto.tag) {
      qb.andWhere(`p.tags ILIKE :tag`);
    }
    qb.setParameters({
      title: `%${dto.title}%`,
      body: `%${dto.body}%`,
      tag: `%${dto.tag}%`,
      views: dto.views || 'DESC',
    });
    const [items, total] = await qb.getManyAndCount();
    return { items, total };
  }
  async findOne(id: number) {
    await this.postRepository
      .createQueryBuilder('posts')
      .whereInIds(id)
      .update()
      .set({ views: () => `views + 1` })
      .execute();
    return this.postRepository.findOne(id);
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
