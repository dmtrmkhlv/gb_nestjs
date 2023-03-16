import {
  Catch,
  ExceptionFilter,
  HttpException,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { newsTemplate } from 'src/views/newsTemplate';
import { htmlTemplate } from 'src/views/template';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const getStatus = JSON.parse(JSON.stringify(exception)).status;

    if (getStatus === 404) {
      response.send('Страница не найдена <a href="/">перейти на главную</a>');
    }

    // response.status(status).json(exception);
  }
}
