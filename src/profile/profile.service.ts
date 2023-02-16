import { UserEntity } from 'src/user/entity/user.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FollowEntity } from './follow.entity';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(FollowEntity)
    private readonly followRepository: Repository<FollowEntity>,
  ) {}

  async getProfile(currentUserId: number, profileUsername: string) {
    const user = await this.userRepository.findOne({
      where: {
        name: profileUsername,
      },
    });

    if (!user) {
      throw new HttpException('Profile does not exist', HttpStatus.NOT_FOUND);
    }

    const follow = await this.followRepository.findOne({
      where: {
        followerId: currentUserId,
        followingId: user.id,
      },
    });

    return { ...user, following: Boolean(follow) };
  }

  async followOrUnfollowProfile(
    currentUserId: number,
    profileUsername: string,
  ) {
    const user = await this.userRepository.findOne({
      where: {
        name: profileUsername,
      },
    });

    if (!user) {
      throw new HttpException('Profile does not exist', HttpStatus.NOT_FOUND);
    }

    if (currentUserId === user.id) {
      throw new HttpException(
        'Follower and Following cant be equal',
        HttpStatus.BAD_REQUEST,
      );
    }

    const follow = await this.followRepository.findOne({
      where: {
        followerId: currentUserId,
        followingId: user.id,
      },
    });

    if (follow) {
      await this.followRepository.delete({
        followerId: currentUserId,
        followingId: user.id,
      });
      return { ...user, following: false };
    }
    const followToCreate = this.followRepository.create();
    followToCreate.followerId = currentUserId;
    followToCreate.followingId = user.id;
    await this.followRepository.save(followToCreate);
    return { ...user, following: true };
  }
}
