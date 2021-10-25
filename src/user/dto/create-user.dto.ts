import { IsEmail, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
// import { UniqueOnDatabase } from 'src/auth/validations/UniqueValidation';
// import { UserEntity } from 'src/user/entities/user.entity';
export class CreateUserDto {
  @Length(3)
  @ApiProperty()
  fullName: string;

  @IsEmail(undefined, { message: 'Неверная почта' })
  @ApiProperty()
  // @UniqueOnDatabase(UserEntity, { message: 'Такая почта уже есть' })
  email: string;

  @Length(6, 32, { message: 'Пароль должен быть минимум 6 символов' })
  @ApiProperty()
  password: string;
}
