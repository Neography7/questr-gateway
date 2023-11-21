import { ChangeInformationRequest, ChangePasswordRequest, GetInformationRequest, GetUserRequest, USER_SERVICE_NAME, UploadAvatarRequest, UserServiceClient } from 'proto/user.pb';
import { HttpException, HttpStatus, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable, lastValueFrom } from 'rxjs';

@Injectable()
export class UserService {

  private userService: UserServiceClient;

  @Inject(USER_SERVICE_NAME) 
  private client: ClientGrpc 
  
  public onModuleInit(): void {
    this.userService = this.client.getService<UserServiceClient>(USER_SERVICE_NAME);
  }

  public async getUser(data: GetUserRequest): Promise<any> {
    return lastValueFrom(this.userService.getUser(data))
  }

  public async changePassword(data: ChangePasswordRequest): Promise<any> {
    return lastValueFrom(this.userService.changePassword(data))
  }

  public async uploadAvatar(data: UploadAvatarRequest): Promise<any> {
    return lastValueFrom(this.userService.uploadAvatar(data))
  }

  public async getInformation(data: GetInformationRequest): Promise<any> {
    return lastValueFrom(this.userService.getInformation(data))
  }

  public async changeInformation(data: ChangeInformationRequest): Promise<any> {
    return lastValueFrom(this.userService.changeInformation(data))
  }

}
