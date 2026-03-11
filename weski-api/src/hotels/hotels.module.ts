import { Module } from '@nestjs/common';
import { HotelsController } from './hotels.controller';
import { HotelsService } from './hotels.service';
import { HOTEL_PROVIDERS } from './hotels.constants';
import { WeskiMockProvider } from './providers/weski-mock/weski-mock.provider';

@Module({
  controllers: [HotelsController],
  providers: [
    WeskiMockProvider,
    {
      provide: HOTEL_PROVIDERS,
      useFactory: (weskiMock: WeskiMockProvider) => [weskiMock],
      inject: [WeskiMockProvider],
    },
    HotelsService,
  ],
})
export class HotelsModule {}
