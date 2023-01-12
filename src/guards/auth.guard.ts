import { CanActivate } from '@nestjs/common';

export class AuthGuard implements CanActivate {
  canActivate() {
    // 1) Determine the UserTypes that can execute the called end point
    // 2) Gran the JWT from the request header and verify it

    return false;
  }
}
