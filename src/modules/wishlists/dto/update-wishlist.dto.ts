import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  MaxLength,
} from 'class-validator';

export class UpdateWishlistDto {
  @IsString()
  @Length(1, 250)
  @IsOptional()
  name: string;

  @IsString()
  @IsUrl()
  @IsOptional()
  image: string;

  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  itemsId: number[];

  @IsOptional()
  @MaxLength(1500)
  @IsString()
  description: string;
}
