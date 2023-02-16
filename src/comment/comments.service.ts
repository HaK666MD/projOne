import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostEntity } from 'src/post/post.entity';
import { UserEntity } from 'src/user/entity/user.entity';
import { Repository } from 'typeorm';
import { CommentDto } from './comment.dto';
import { CommentEntity } from './comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>,
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async addCommentTo(user: UserEntity, postId: number, commentDto: CommentDto) {
    const post = await this.postRepository.findOneBy({ id: postId });
    if (post) {
      const comment = this.commentRepository.create(commentDto);
      comment.author = user;
      comment.post = post;
      if (commentDto.parentId) {
        comment.parent = await this.commentRepository.findOneBy({
          id: commentDto.parentId,
        });
      }
      await this.commentRepository.save(comment);
    }
    return;
  }
}
