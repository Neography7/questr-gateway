import { UserService } from './../user/user.service';
import { HttpException, HttpStatus, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { AuthServiceClient, AUTH_SERVICE_NAME, LoginRequest, RegisterRequest, ValidateTokenRequest } from 'proto/auth.pb';
import { Observable, lastValueFrom } from 'rxjs';
import { Metadata } from '@grpc/grpc-js';
import * as i18next from 'i18next';

@Injectable()
export class AuthService implements OnModuleInit {

  private authService: AuthServiceClient;

  @Inject(AUTH_SERVICE_NAME) 
  private client: ClientGrpc 
  
  public onModuleInit(): void {
    this.authService = this.client.getService<AuthServiceClient>(AUTH_SERVICE_NAME);
  }

  public async login(data: LoginRequest): Promise<any> {
    return await lastValueFrom(this.authService.login(data, this.metadata()))
  }

  public async register(data: RegisterRequest): Promise<any> {
    return await lastValueFrom(this.authService.register(data, this.metadata()));
  }

  public async validateToken(data: ValidateTokenRequest): Promise<any> {
    return await lastValueFrom(this.authService.validateToken(data, this.metadata()));
  }

  public async tokenRenew(data: ValidateTokenRequest): Promise<any> {
    return await lastValueFrom(this.authService.tokenRenew(data, this.metadata()));
  }

  public metadata(): Metadata {
    const metadata = new Metadata();
    const lang = (i18next as any).language
    metadata.add('Language', lang);
    return metadata;
  }

}