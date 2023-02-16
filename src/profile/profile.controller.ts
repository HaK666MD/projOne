import { User } from 'src/user/decorator/user.decorator';
import { AuthGuard } from 'src/user/guard/auth.guard';
import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ProfileService } from './profile.service';

@Controller('profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get(':username')
  @UseGuards(AuthGuard)
  async getProfile(
    @User('id') currentUserId: number,
    @Param('username') profileUsername: string,
  ) {
    return await this.profileService.getProfile(currentUserId, profileUsername);
  }

  @Post(':username/follow')
  @UseGuards(AuthGuard)
  async followProfile(
    @User('id') currentUserId: number,
    @Param('username') profileUsername: string,
  ) {
    return await this.profileService.followOrUnfollowProfile(
      currentUserId,
      profileUsername,
    );
  }
}
