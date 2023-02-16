import { UserEntity } from '../entity/user.entity';

export interface UserWithJwt {
  user: Omit<UserEntity, 'hashPassword'> & { token: string };
}
