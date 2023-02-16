import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdressEntity } from './entity/adress.entity';
import { UserController } from './user.controller';
import { UserEntity } from './entity/user.entity';
import { UserService } from './user.service';
import { AuthGuard } from './guard/auth.guard';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, AdressEntity])],
  controllers: [UserController],
  providers: [UserService, AuthGuard],
  exports: [UserService],
})
export class UserModule {}
