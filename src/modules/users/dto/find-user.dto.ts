import { IsString, Length } from 'class-validator';

export class FindUserDto {
  @IsString()
  query: string;
}
