import { Body, Controller, Param, Post } from '@nestjs/common';
import { User } from 'src/user/decorator/user.decorator';
import { UserEntity } from 'src/user/entity/user.entity';
import { CommentDto } from './comment.dto';
import { CommentService } from './comments.service';

@Controller('posts')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post('/:id')
  async addComment(
    @User() user: UserEntity,
    @Param('id') postId: number,
    @Body() commentDto: CommentDto,
  ) {
    return await this.commentService.addCommentTo(user, postId, commentDto);
  }
}
