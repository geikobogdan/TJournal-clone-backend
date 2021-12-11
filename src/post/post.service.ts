import { SearchPostDto } from './dto/search-post.dto';
import { PostEntity } from './entities/post.entity';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
  create(dto: CreatePostDto, userId: number) {
    const firstParagraph = dto.body.find((obj) => obj.type === 'paragraph')
      ?.data?.text;
    return this.postRepository.save({
      title: dto.title,
      body: dto.body,
      tags: dto.tags,
      description: firstParagraph || '',
      user: { id: userId },
    });
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
    const qb = this.postRepository.createQueryBuilder('posts');
    qb.leftJoinAndSelect('posts.user', 'user');
    qb.limit(dto.limit || 0);
    qb.take(dto.take || 10);
    if (dto.views) {
      qb.orderBy('views', dto.views);
    }
    if (dto.body) {
      qb.andWhere(`posts.body ILIKE :body`);
    }
    if (dto.title) {
      qb.andWhere(`posts.title ILIKE :title`);
    }
    if (dto.tag) {
      qb.andWhere(`posts.tags ILIKE :tag`);
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

  async update(id: number, dto: UpdatePostDto, userId: number) {
    const find = await this.postRepository.findOne(id);
    if (!find) {
      throw new NotFoundException('Статья не найдена');
    }

    const firstParagraph = dto.body.find((obj) => obj.type === 'paragraph')
      ?.data?.text;

    return this.postRepository.update(id, {
      title: dto.title,
      body: dto.body,
      tags: dto.tags,
      description: firstParagraph || '',
    });
  }

  async remove(id: number, userId: number) {
    const find = await this.postRepository.findOne(id);
    if (!find) {
      throw new NotFoundException('Статья не найдена');
    }
    if (find.user.id !== userId) {
      throw new ForbiddenException('Нет доступа к этой статье!');
    }
    return this.postRepository.delete(id);
  }
}
