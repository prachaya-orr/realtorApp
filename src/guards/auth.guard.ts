import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    // 1) Determine the UserTypes that can execute the called end point
    const roles = this.reflector.getAllAndOverride('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    console.log(roles);
    // 2) Gran the JWT from the request header and verify it
    // 3) Database request to get user by id
    // 4) Determine if the user can permission
    return true;
  }
}
