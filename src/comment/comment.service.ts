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

  create(dto: CreateCommentDto) {
    return this.commentRepository.save({
      text: dto.text,
      post: { id: dto.postId },
      user: { id: 2 },
    });
  }

  findAll() {
    return this.commentRepository.find();
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
