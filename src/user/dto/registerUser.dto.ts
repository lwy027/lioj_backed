import { PartialType } from '@nestjs/mapped-types';
import { LoginUserDto } from './loginUser.dto';

export class UpdateUserDto extends PartialType(LoginUserDto) {}
