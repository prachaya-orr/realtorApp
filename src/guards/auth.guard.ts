import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext) {
    // 1) Determine the UserTypes that can execute the called end point
    const roles = this.reflector.getAllAndOverride('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (roles?.length) {
      // 2) Grab the JWT from the request header and verify it
      const request = context.switchToHttp().getRequest();
      const token = request.headers?.authorization?.split('Bearer ')[1];
      try {
        const user = await jwt.verify(token, process.env.JSON_TOKEN_KEY);
        console.log({ user });
        return true;
      } catch (error) {
        return false;
      }
    }
    return true;

    // 3) Database request to get user by id
    // 4) Determine if the user can permission
  }
}
