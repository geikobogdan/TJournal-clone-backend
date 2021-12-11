import { UserEntity } from 'src/user/entities/user.entity';
import { CommentEntity } from './entities/comment.entity';
import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity)
    private commentRepository: Repository<CommentEntity>,
  ) {}

  async create(dto: CreateCommentDto, userId: number) {
    const comment = await this.commentRepository.save({
      text: dto.text,
      post: { id: dto.postId },
      user: { id: userId },
    });
    return this.commentRepository.findOne(
      { id: comment.id },
      { relations: ['user'] },
    );
  }

  async findAll(postId: number) {
    const arr = await this.commentRepository.find({
      [postId ? 'where' : '']: {
        post: { id: postId },
      },
      relations: ['user', 'post'],
    });
    return arr.map((obj) => ({
      ...obj,
      post: { id: obj.post.id, title: obj.post.title },
    }));
  }

  findOne(id: number) {
    return this.commentRepository.findOne(id);
  }

  update(id: number, dto: UpdateCommentDto) {
    return this.commentRepository.update(id, dto);
  }

  remove(id: number) {
    return this.commentRepository.delete(id);
  }
}
