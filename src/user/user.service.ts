import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdressEntity } from './entity/adress.entity';
import { AdressDto } from './dto/adress.dto';
import { UserDto } from './dto/user.dto';
import { UserEntity } from './entity/user.entity';
import { sign } from 'jsonwebtoken';
import { compare } from 'bcrypt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(AdressEntity)
    private readonly adressRepository: Repository<AdressEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async getUsersWith() {
    return await this.userRepository.find({ relations: ['adress'] });
  }

  async regUser(userDto: UserDto) {
    const user = await this.userRepository.findOne({
      where: { email: userDto.email },
    });
    if (user) {
      throw new HttpException(
        'Email are taken',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    const newUser = this.userRepository.create(userDto);
    //newUser.adress = await this.getAddressById(userDto.adressId);
    await this.userRepository.save(newUser);
    return;
  }

  async loginUser(loginDto: LoginDto) {
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email },
      select: ['id', 'email', 'password'],
    });
    if (!user) {
      throw new HttpException(
        'Credentials not valid',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    const isPassCorrect = await compare(loginDto.password, user.password);
    if (!isPassCorrect) {
      throw new HttpException(
        'Credentials not valid',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    const token = sign({ id: user.id }, 'secret');
    return token;
  }

  getUserById(id: number): Promise<UserEntity> {
    return this.userRepository.findOneBy({ id });
  }

  async getAddressById(id: number) {
    return await this.adressRepository.findOneBy({ id });
  }

  async createAdress(adressDto: AdressDto) {
    const adress = this.adressRepository.create(adressDto);
    return await this.adressRepository.save(adress);
  }
}
