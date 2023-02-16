import { DataSource } from 'typeorm';

export default new DataSource({
  type: 'postgres',
  url: 'postgresql://postgres:1234@localhost:5432/projOne',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
  synchronize: false,
});
