import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import db from './ormconfig';

import { CategoryModule } from './category/category.module';
import { PostModule } from './post/post.module';
import { UserModule } from './user/user.module';
import { CommentModule } from './comment/comment.module';
import { AuthMiddleWare } from './user/middleware/auth.middleware';
import { ProfileModule } from './profile/profile.module';
import { ConfigModule } from '@nestjs/config';
import ormconfig from './ormconfig';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    TypeOrmModule.forRoot(db.options),
    UserModule,
    PostModule,
    CategoryModule,
    CommentModule,
    ProfileModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleWare).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
