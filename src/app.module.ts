import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NewsModule } from './news/news.module';
import { CalculateController } from './calculate/calculate.controller';
import { CalculateService } from './calculate/calculate.service';

@Module({
  imports: [NewsModule],
  controllers: [AppController, CalculateController],
  providers: [AppService, CalculateService],
})
export class AppModule {}
