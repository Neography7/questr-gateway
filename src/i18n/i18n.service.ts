import { Injectable, NestMiddleware } from '@nestjs/common';
import * as i18next from 'i18next';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class I18nService {
  
  constructor() {
    i18next
      .init({
        resources: {
          en: { translation: require('../lang/en.json') },
          tr: { translation: require('../lang/tr.json') },
        }, 
        fallbackLng: 'en',
        preload: ['en', 'tr'],
        saveMissing: true,
      }); 
  } 

  use(req: Request, res: Response, next: NextFunction) {

    const acceptLanguage: string = typeof req.headers['accept-language'] === "string" ? req.headers['accept-language'] : "en";

    i18next.changeLanguage(acceptLanguage);

    next();
  }
}  