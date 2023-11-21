import { AppService } from './../app.service';
import { AuthService } from './../auth/auth.service';
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  OnModuleInit,
  UseGuards,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { QuestionService } from './question.service';
import { GraphQLError } from 'graphql';
import { AuthGuard } from '../auth/guards/auth.guard';
import {
  CreateAnswerRequest,
  CreateQuestionRequest,
  DeleteAnswerRequest,
  DeleteQuestionRequest,
  GetQuestionRequest,
  GetQuestionsRequest,
  GetUnansweredsRequest,
} from 'proto/question.pb';
import { UserGuard } from 'src/auth/guards/user.guard';
import { NotificationGateway } from 'src/notification/notification.gateway';

@Resolver('Question')
@Injectable()
export class QuestionResolver {
  constructor(
    private readonly questionService: QuestionService,
    private readonly appService: AppService,
    private readonly notificationGateway: NotificationGateway
  ) {}

  @Query('getQuestions')
  async getQuestions(
    @Args('userID') userID: string,
    @Args('page') page: number,
  ) {

    const data: GetQuestionsRequest = {
      userID: userID,
      page: page,
    };

    const response = await this.questionService.getQuestions(data);

    if (response.error) return this.appService.throwGraphqlError(response);

    const responseData = response.data;

    return {
      currentPage : responseData.currentPage,
      totalPage   : responseData.totalPage,
      totalRecords: responseData.totalRecords,
      questions   : responseData.questions 
    }; 
  }

  @UseGuards(UserGuard)
  @Query('getQuestion')
  async getQuestion(@Args('questionID') questionID: string, @Context() context: any) {

    const authID = context.auth ? context.auth.userID : '';

    const data: GetQuestionRequest = {
      questionID: questionID,
      authID: authID
    };

    const response = await this.questionService.getQuestion(data);

    if (response.error) return this.appService.throwGraphqlError(response);

    const question = response.data.question;

    return {
      _id      : question?._id,
      userID   : question?.userID,
      creatorID: question?.creatorID,
      question : question?.question,
      answer   : question?.answer,
      from     : question?.from,
      anonymous: question?.anon,
      createdAt: question?.createdAt,
      updatedAt: question?.updatedAt,
    };
  }

  @UseGuards(AuthGuard)
  @Query('getUnansweredQuestions')
  async getUnansweredQuestions(
    @Args('page') page: number,
    @Context() context: any
  ) {

    const authID = context.auth ? context.auth.userID : '';

    const data: GetUnansweredsRequest = {
      authID: authID,
      page: page,
    };

    const response = await this.questionService.getUnanswereds(data);

    if (response.error) return this.appService.throwGraphqlError(response);

    const responseData = response.data;

    return {
      currentPage : responseData.currentPage,
      totalPage   : responseData.totalPage,
      totalRecords: responseData.totalRecords,
      questions   : responseData.questions 
    }; 
  }

  @UseGuards(UserGuard)
  @Mutation('createQuestion')
  async createQuestion(
    @Args('userID') userID: string,
    @Args('question') question: string,
    @Args('anonymous') anonymous: boolean,
    @Context() context: any,
  ) {

    const authID = context.auth ? context.auth.userID : '';

    const data: CreateQuestionRequest = {
      authID: authID,
      userID: userID,
      question: question,
      anon: anonymous,
    };

    const response = await this.questionService.createQuestion(data);

    if (response.error) return this.appService.throwGraphqlError(response);

    console.log(response.data.question)

    this.notificationGateway.sendNotification(userID, {
      "type": "new_question",
      "data": {
        "_id": response.data.question._id,
        "question": question,
        "answer": null,
        "anonymous": anonymous,
        "createdAt": response.data.question.createdAt,
        "updatedAt": response.data.question.updatedAt,
        "creatorID": anonymous ? null : userID,
        "from": anonymous ? null : {
          userID: context.auth.userID,
          username: context.auth.username,
          nickname: context.auth.nickname,
          avatar: context.auth.avatar
        }
      }
    })
 
    return {
      questionID: response.data.question.questionID,
      error     : response.error,
      message   : response.message,
      data      : response.data.question,
    };
  }
 
  @UseGuards(AuthGuard)
  @Query('deleteQuestion')
  async deleteQuestion(
    @Args('questionID') questionID: string,
    @Context() context: any,
  ) {

    const authID = context.auth ? context.auth.userID : '';

    const data: DeleteQuestionRequest = {
      authID    : authID,
      questionID: questionID,
    };

    const response = await this.questionService.deleteQuestion(data);

    if (response.error) return this.appService.throwGraphqlError(response);

    return {
      error     : response.error, 
      message   : response.message,
    };  
  
  }

  @UseGuards(AuthGuard)
  @Mutation('createAnswer')
  async createAnswer(
    @Args('questionID') questionID: string,
    @Args('answer') answer: string,
    @Context() context: any,
  ) {

    const authID = context.auth ? context.auth.userID : '';

    const data: CreateAnswerRequest = {
      authID    : authID,
      questionID: questionID,
      answer    : answer,
    };

    const response = await this.questionService.createAnswer(data);

    if (response.error) return this.appService.throwGraphqlError(response);

    return {
      questionID: response.data.questionID,
      error     : response.error, 
      message   : response.message,
      data      : response.data.question,
    };  
  }

  @UseGuards(AuthGuard)
  @Query('deleteAnswer')
  async deleteAnswer(
    @Args('questionID') questionID: string,
    @Context() context: any,
  ) {

    const authID = context.auth ? context.auth.userID : '';

    const data: DeleteAnswerRequest = {
      authID    : authID,
      questionID: questionID,
    };

    const response = await this.questionService.deleteAnswer(data);

    if (response.error) return this.appService.throwGraphqlError(response);

    return {
      error     : response.error, 
      message   : response.message,
    };  

  }
}
