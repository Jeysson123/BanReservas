import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from '../controllers/UserController';
import { UserService } from '../services/UserService';
import { User } from '../models/entities/User';
import { IUserServiceToken } from '../interfaces/IUserService';

@Module({
  imports: [TypeOrmModule.forFeature([User])], // Importa el repositorio de User
  controllers: [UserController],
  providers: [
    {
      provide: IUserServiceToken,
      useClass: UserService,
    },
  ],
  exports: [IUserServiceToken],
})
export class UserModule {}
