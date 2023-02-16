import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { UserDto } from './dto/user.dto';
import { UserService } from './user.service';
import { User } from './decorator/user.decorator';
import { UserEntity } from './entity/user.entity';
import { AuthGuard } from './guard/auth.guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAllUsersWithAdresses() {
    return this.userService.getUsersWith();
  }

  @Post('/register')
  async regUser(@Body() userDto: UserDto) {
    return await this.userService.regUser(userDto);
  }

  @Post('/login')
  @UsePipes(new ValidationPipe())
  async loginUser(@Body() loginDto: LoginDto) {
    return await this.userService.loginUser(loginDto);
  }

  @Get('/user')
  @UseGuards(AuthGuard)
  async currentUser(@User() user: UserEntity) {
    return user;
  }
}
