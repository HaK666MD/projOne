import { Injectable } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common/enums';
import { HttpException } from '@nestjs/common/exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entity/user.entity';
import { FollowEntity } from 'src/profile/follow.entity';
import { DeleteResult, Repository } from 'typeorm';
import { QueryInterface } from './query.interface';
import { CreatePostDto } from './post.dto';
import { PostEntity } from './post.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(FollowEntity)
    private readonly followRepository: Repository<FollowEntity>,
  ) {}

  async findAll(currentUserId: number, { skip, take, search }: QueryInterface) {
    const queryBuilder = this.postRepository
      .createQueryBuilder('posts')
      .leftJoinAndSelect('posts.author', 'author')
      // .leftJoinAndSelect('posts.comments', 'comments')
      // .leftJoinAndSelect('comments.parent', 'parent')
      .orderBy('posts.createdAt', 'DESC')
      .take(take)
      .skip(skip);

    if (search) {
      queryBuilder.andWhere('LOWER(posts.title) LIKE :search', {
        search: `%${search}%`,
      });
    }

    const [posts, postsCount] = await queryBuilder.getManyAndCount();

    if (currentUserId) {
      const currentUser = await this.userRepository.findOne({
        where: { id: currentUserId },
        relations: ['favorites'],
      });
      const favoritesIds = currentUser.favorites.map((favorite) => favorite.id);
      const postsWithFavorited = posts.map((post) => {
        const favorited = favoritesIds.includes(post.id);
        return { ...post, favorited };
      });
      return { posts: postsWithFavorited, postsCount };

      // const favoritesPosts = postsWithFavorited.filter(
      //   (post) => post.favorited === true,
      // );
      //const favoritesPostsCount = favoritesPosts.length;
    }

    return { posts, postsCount };
  }

  async getFeed(currentUserId: number, query: QueryInterface) {
    const follows = await this.followRepository.find({
      where: {
        followerId: currentUserId,
      },
    });

    if (follows.length === 0) {
      return { articles: [], articlesCount: 0 };
    }

    const followingUserIds = follows.map((follow) => follow.followingId);

    const queryBuilder = this.postRepository
      .createQueryBuilder('posts')
      .leftJoinAndSelect('posts.author', 'author')
      .where('posts.authorId IN (:...ids)', { ids: followingUserIds })
      .orderBy('posts.createdAt', 'DESC');

    const [articles, articlesCount] = await queryBuilder.getManyAndCount();

    return { articles, articlesCount };
  }

  async updatePost(
    currentUserId: number,
    postId: number,
    updatePostDto: CreatePostDto,
  ) {
    const post = await this.getPostById(postId);
    if (!post) {
      throw new HttpException('Post does not exist', HttpStatus.NOT_FOUND);
    }
    if (post.author.id !== currentUserId) {
      throw new HttpException('You are not an author', HttpStatus.FORBIDDEN);
    }
    Object.assign(post, updatePostDto);
    return await this.postRepository.save(post);
  }

  async createPost(currentUser: UserEntity, createPost: CreatePostDto) {
    const post = this.postRepository.create(createPost);
    post.author = currentUser;
    return await this.postRepository.save(post);
  }

  async getPostById(id: number): Promise<PostEntity> {
    return await this.postRepository.findOne({
      where: { id },
      relations: ['comments'],
    });
  }

  async deletePost(
    currentUserId: number,
    postId: number,
  ): Promise<DeleteResult> {
    const post = await this.getPostById(postId);
    if (!post) {
      throw new HttpException('Post does not exist', HttpStatus.NOT_FOUND);
    }
    if (post.author.id !== currentUserId) {
      throw new HttpException('You are not an author', HttpStatus.FORBIDDEN);
    }
    return await this.postRepository.delete(postId);
  }

  async addTofavorites(currentUserId: number, postId: number) {
    const user = await this.userRepository.findOne({
      where: { id: currentUserId },
      relations: ['favorites'],
    });
    const post = await this.getPostById(postId);
    const isNotFavorite =
      user.favorites.findIndex(
        (postInFavorites) => postInFavorites.id === post.id,
      ) === -1;
    if (isNotFavorite) {
      user.favorites.push(post);
      post.favoritesCount++;
      await this.postRepository.save(post);
      await this.userRepository.save(user);
    }

    return post;
  }

  async deleteFromFavorites(currentUserId: number, postId: number) {
    const user = await this.userRepository.findOne({
      where: { id: currentUserId },
      relations: ['favorites'],
    });
    const post = await this.getPostById(postId);
    const postIndex = user.favorites.findIndex(
      (postInFavorites) => postInFavorites.id === post.id,
    );
    if (postIndex >= 0) {
      user.favorites.splice(postIndex, 1);
      post.favoritesCount--;
      await this.postRepository.save(post);
      await this.userRepository.save(user);
    }

    return post;
  }
}
