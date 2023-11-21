import { UserService } from '../user/user.service';
import { HttpException, HttpStatus, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { QuestionServiceClient, QUESTION_SERVICE_NAME, Response, CreateQuestionRequest, DeleteQuestionRequest, CreateAnswerRequest, DeleteAnswerRequest, GetQuestionRequest, GetQuestionsRequest, GetUnansweredsRequest } from 'proto/question.pb';
import { Observable, lastValueFrom } from 'rxjs';

@Injectable()
export class QuestionService implements OnModuleInit {

  private questionService: QuestionServiceClient;

  @Inject(QUESTION_SERVICE_NAME) 
  private client: ClientGrpc 
  
  public onModuleInit(): void {
    this.questionService = this.client.getService<QuestionServiceClient>(QUESTION_SERVICE_NAME);
  }

  public async createQuestion(data: CreateQuestionRequest): Promise<any> {
    return lastValueFrom(this.questionService.createQuestion(data))
  }

  public async deleteQuestion(data: DeleteQuestionRequest): Promise<any> {
    return lastValueFrom(this.questionService.deleteQuestion(data))
  }
 
  public async createAnswer(data: CreateAnswerRequest): Promise<any> {
    return lastValueFrom(this.questionService.createAnswer(data))
  }

  public async deleteAnswer(data: DeleteAnswerRequest): Promise<any> {
    return lastValueFrom(this.questionService.deleteAnswer(data))
  }
 
  public async getQuestions(data: GetQuestionsRequest): Promise<any> {
    return lastValueFrom(this.questionService.getQuestions(data))
  }

  public async getQuestion(data: GetQuestionRequest): Promise<any> { 
    return lastValueFrom(this.questionService.getQuestion(data))
  }

  public async getUnanswereds(data: GetUnansweredsRequest): Promise<any> {
    return lastValueFrom(this.questionService.getUnanswereds(data))
  }
}