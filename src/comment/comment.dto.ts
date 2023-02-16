import { IsNotEmpty, IsOptional } from 'class-validator';

export class CommentDto {
  @IsNotEmpty()
  readonly message: string;

  @IsOptional()
  readonly parentId: number;
}
