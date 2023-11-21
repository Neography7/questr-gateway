import { ThrottlerGuard } from '@nestjs/throttler';
import { HttpException, HttpStatus, Inject, Injectable, OnModuleInit, UseGuards } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { GraphQLError } from 'graphql';
import { AuthGuard } from './guards/auth.guard';
import * as sanitizeHtml from 'sanitize-html';
import { AppService } from 'src/app.service';

@Resolver('Auth')
@Injectable()
export class AuthResolver {

  constructor(private readonly authService: AuthService,
    private readonly appService: AppService) {}
  
  @Mutation('registerUser')
  async registerUser(
    @Args('username') username: string, 
    @Args('nickname') nickname: string, 
    @Args('email') email: string, 
    @Args('password') password: string
  ) {

    const data = {
      username: sanitizeHtml(username),
      nickname: sanitizeHtml(nickname),
      email   : sanitizeHtml(email),
      password: sanitizeHtml(password),
    }

    const response = await this.authService.register(data);

    if (response.error)  return this.appService.throwGraphqlError(response);

    return { 
      token: response.data.token, 
      userID: response.data.userID, 
      username: response.data.username,  
      nickname: response.data.nickname, 
      email: response.data.email,  
      avatar: response.data.avatar
    }
    
  }

  @Query('loginUser')
  async loginUser(
    @Args('usernameOrEmail') usernameOrEmail: string, 
    @Args('password') password: string, 
    @Args('remember') remember: boolean
  ) {

    const response = await this.authService.login({ email: usernameOrEmail, password: password, remember: remember });

    if (response.error)  return this.appService.throwGraphqlError(response);

    return { 
      token: response.data.token, 
      userID: response.data.userID, 
      username: response.data.username, 
      nickname: response.data.nickname, 
      email: response.data.email, 
      avatar: response.data.avatar 
    }

  }

  @Query('validateToken')
  async validateToken(@Args('token') token: string) {

    const response = await this.authService.validateToken({ token });

    if (response.error) return this.appService.throwGraphqlError(response);

    return { 
      token: response.data.token, 
      userID: response.data.userID, 
      username: response.data.username, 
      nickname: response.data.nickname, 
      email: response.data.email, 
      avatar: response.data.avatar 
    }

  }

  @Query('tokenRenew')
  async tokenRenew(@Args('token') token: string) {

    const response = await this.authService.tokenRenew({ token });

    if (response.error)  return this.appService.throwGraphqlError(response);

    return { 
      token: response.data.token, 
      userID: response.data.userID, 
      username: response.data.username, 
      nickname: response.data.nickname, 
      email: response.data.email,
      avatar: response.data.avatar
    }

  }

}