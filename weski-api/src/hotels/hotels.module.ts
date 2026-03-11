import { Module } from '@nestjs/common';
import { HotelsController } from './hotels.controller';
import { HotelsService } from './hotels.service';
import { HOTEL_PROVIDERS } from './hotels.constants';
import { WeskiMockProvider } from './providers/weski-mock/weski-mock.provider';
import { WeskiMock2Provider } from './providers/weski-mock2/weski-mock2.provider';

@Module({
  controllers: [HotelsController],
  providers: [
    WeskiMockProvider,
    WeskiMock2Provider,
    {
      provide: HOTEL_PROVIDERS,
      useFactory: (weskiMock: WeskiMockProvider, weskiMock2: WeskiMock2Provider) => [weskiMock, weskiMock2],
      inject: [WeskiMockProvider, WeskiMock2Provider], // <-- inject providers
    },
    HotelsService,
  ],
})
export class HotelsModule {}
