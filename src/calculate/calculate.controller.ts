import { Controller, Put, Patch, Query, Header, Headers } from '@nestjs/common';
import { CalculateService } from './calculate.service';

@Controller('calculate')
export class CalculateController {
    constructor(private readonly calculateService: CalculateService) { }
    @Put('/')
    @Header('Type-Operation', 'plus')
    put(@Headers() headers, @Query() query): Promise<number> {
        return this.calculateService.put(headers, query);
    }
    @Patch('/')
    async patch(@Headers() headers): Promise<number> {
        return this.calculateService.patch(headers);
    }
}
