import { GraphQLError } from 'graphql';
import { HttpException, HttpStatus, Inject, Injectable, OnModuleInit, Global } from '@nestjs/common';

@Injectable()
@Global()
export class AppService {

    async throwGraphqlError(response: any): Promise<any> {
        throw new GraphQLError(response.message, {
            extensions: {
                data: response.data,
                error: response.error,
                statusCode: response.status,
            },
        });
    }

}