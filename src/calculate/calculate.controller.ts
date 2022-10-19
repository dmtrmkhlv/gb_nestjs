import { Controller, Put, Patch, Query, Header, Req, Headers } from '@nestjs/common';
import { Request } from 'express';
import { CalculateService } from './calculate.service';

@Controller('calculate')
export class CalculateController {
    constructor(private readonly appService: CalculateService) { }
    @Put('/')
    @Header('Type-Operation', 'plus')
    put(@Headers() headers, @Query() query): Promise<number> {
        return this.appService.put(headers, query);
    }
    @Patch('/')
    async patch(@Headers() headers): Promise<number> {
        return this.appService.patch(headers);
    }
}
