import { UserService } from './user.service';
import { AppService } from './../app.service';
import { HttpException, HttpStatus, Inject, Injectable, OnModuleInit, UseGuards } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';
import { AuthGuard } from '../auth/guards/auth.guard';
import * as sanitizeHtml from 'sanitize-html';
import { ChangeInformationRequest, ChangePasswordRequest, GetInformationRequest, UploadAvatarRequest } from 'proto/user.pb';
import { UserGuard } from 'src/auth/guards/user.guard';

@Resolver('User')
@Injectable()
export class UserResolver {

    constructor(
      private readonly userService: UserService,
      private readonly appService: AppService,
    ) {}

    @UseGuards(AuthGuard)
    @Mutation('changePassword')
    async changePassword(
        @Args('oldPassword') old_password: string,
        @Args('newPassword') new_password: string,
        @Args('newPasswordConfirmation') new_password_confirmation: string,
        @Context() context: any
    ) {

        const data: ChangePasswordRequest = {
            userID: context.auth.userID,
            oldPassword: old_password,
            newPassword: new_password,
            newPasswordConfirmation: new_password_confirmation
        };

        const response = await this.userService.changePassword(data);

        if (response.error) return this.appService.throwGraphqlError(response);

        return {
            error: response.error,
            message: response.message
        }

    }

    @UseGuards(AuthGuard)
    @Mutation('uploadAvatar')
    async uploadAvatar(
        @Args('avatarBase64') avatarBase64: string,
        @Context() context: any
    ) {

        const data: UploadAvatarRequest = {
            userID: context.auth.userID,
            avatarBase64: avatarBase64
        };

        const response = await this.userService.uploadAvatar(data);

        if (response.error) return this.appService.throwGraphqlError(response);

        return {
            error: response.error,
            message: response.message,
            avatar: response.data.avatar
        } 

    }

    @UseGuards(AuthGuard)
    @Mutation('changeInformation')
    async changeInformation(
        @Args('username') username: string,
        @Args('nickname') nickname: string,
        @Args('email') email: string,
        @Args('bio') bio: string,
        @Context() context: any
    ) {

        const data: ChangeInformationRequest = {
            userID: context.auth.userID,
            username: username,
            nickname: nickname,
            email: email,
            bio: bio
        };

        const response = await this.userService.changeInformation(data);

        if (response.error) return this.appService.throwGraphqlError(response);

        return {
            username: response.data.username,
            nickname: response.data.nickname,
            email: response.data.email,
            bio: response.data.bio
        }

    }

    @UseGuards(AuthGuard)
    @Query('getInformation')
    async getInformation(
        @Context() context: any
    ) {

        const data: GetInformationRequest = {
            id: context.auth.userID,
        };

        const response = await this.userService.getInformation(data);

        if (response.error) return this.appService.throwGraphqlError(response);

        return {
            id: response.data.user.id,
            username: response.data.user.username,
            nickname: response.data.user.nickname,
            email: response.data.user.email,
            avatar: response.data.user.avatar,
            bio: response.data.user.bio,
        }

    }

    @Query('getUser')
    async getUser(
        @Args('username') username: string
    ) {

        const response = await this.userService.getUser({ username });

        if (response.error) return this.appService.throwGraphqlError(response);

        return {
            id: response.data.user.id,
            username: response.data.user.username,
            nickname: response.data.user.nickname,
            avatar: response.data.user.avatar,
            bio: response.data.user.bio,
        }

    }

}