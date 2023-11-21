import {
  CanActivate,
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../auth.service';
import { Request } from 'express';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const gqlContext = GqlExecutionContext.create(context);
    const ctx = gqlContext.getContext();

    const request = ctx.req;

    const token = await this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }

    const validateToken = await this.authService.validateToken({ token });

    if (validateToken.error) {
      throw new UnauthorizedException();
    }
    
    const data = validateToken.data
    const user = { userID: data.userID, username: data.username, nickname: data.nickname, avatar: data.avatar, email: data.email }

    ctx.auth = user;

    return true;
  }

  private async extractTokenFromHeader(request: Request): Promise<string | undefined> {

    if (typeof request.headers === "undefined")
        return undefined;

    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
    
  }
}
