import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { AuthController } from '../controllers/AuthController';
import { AuthService } from '../services/AuthService';
import { IAuthServiceToken } from '../interfaces/IAuthService';
import { AuthMiddleware } from '../middlewares/AuthMiddleware';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: IAuthServiceToken,
      useClass: AuthService,
    },
  ],
  exports: [AuthService, IAuthServiceToken],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('api/users');
  }
}
