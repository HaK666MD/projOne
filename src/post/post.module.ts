import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FollowEntity } from 'src/profile/follow.entity';
import { UserEntity } from 'src/user/entity/user.entity';
import { PostController } from './post.controller';
import { PostEntity } from './post.entity';
import { PostService } from './post.service';

@Module({
  controllers: [PostController],
  providers: [PostService],
  imports: [TypeOrmModule.forFeature([PostEntity, UserEntity, FollowEntity])],
})
export class PostModule {}
