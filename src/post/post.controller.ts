import {
  Body,
  Controller,
  Post,
  Get,
  Put,
  Delete,
  UseGuards,
  Query,
  Param,
} from '@nestjs/common';
import { UsePipes } from '@nestjs/common/decorators';
import { ValidationPipe } from '@nestjs/common/pipes';
import { User } from 'src/user/decorator/user.decorator';
import { UserEntity } from 'src/user/entity/user.entity';
import { AuthGuard } from 'src/user/guard/auth.guard';
import { CreatePostDto } from './post.dto';
import { PostService } from './post.service';
import { QueryInterface } from './query.interface';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post('/post')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  async createPost(
    @User() currentUser: UserEntity,
    @Body() createPostDto: CreatePostDto,
  ) {
    return this.postService.createPost(currentUser, createPostDto);
  }

  @Get()
  async findAll(
    @User('id') currentUserId: number,
    @Query() query: QueryInterface,
  ) {
    return await this.postService.findAll(currentUserId, query);
  }

  @Get('feed')
  @UseGuards(AuthGuard)
  async getFeed(
    @User('id') currentUserId: number,
    @Query() query: QueryInterface,
  ) {
    return await this.postService.getFeed(currentUserId, query);
  }

  @Get('/post/:id')
  @UseGuards(AuthGuard)
  async getPostById(@Param('id') postId: number) {
    return this.postService.getPostById(postId);
  }

  @Put('/post/:id')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  async updatePost(
    @User('id') currentUserId: number,
    @Param('id') postId: number,
    @Body() updatePostDto: CreatePostDto,
  ) {
    return this.postService.updatePost(currentUserId, postId, updatePostDto);
  }

  @Delete('/post/:id')
  @UseGuards(AuthGuard)
  async deleteOne(
    @User('id') currentUserId: number,
    @Param('id') postId: number,
  ) {
    return await this.postService.deletePost(currentUserId, postId);
  }

  @Post('/post/:id/favorite')
  @UseGuards(AuthGuard)
  async addToFavorites(
    @User('id') currentUserId: number,
    @Param('id') postId: number,
  ) {
    return await this.postService.addTofavorites(currentUserId, postId);
  }

  @Delete('/post/:id/favorite')
  @UseGuards(AuthGuard)
  async deleteFromFavorites(
    @User('id') currentUserId: number,
    @Param('id') postId: number,
  ) {
    return await this.postService.deleteFromFavorites(currentUserId, postId);
  }
}
