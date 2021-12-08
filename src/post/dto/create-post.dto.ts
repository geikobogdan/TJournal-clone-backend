/* eslint-disable @typescript-eslint/ban-types */
import { IsArray, IsOptional, IsString } from 'class-validator';

export type BlockToolData<T extends object = any> = T;
export interface OutputBlockData {
  id?: string;

  type: string;

  data: any;
}

export class CreatePostDto {
  @IsString()
  title: string;

  @IsArray()
  body: OutputBlockData[];

  @IsOptional()
  @IsArray()
  tags: string;
}
