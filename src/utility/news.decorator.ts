import {
    createParamDecorator,
    ExecutionContext
} from '@nestjs/common';
export const OneNews = createParamDecorator(
    (data: string, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        const news = request.news;

        return data ? news?.[data] : news;
    },
);