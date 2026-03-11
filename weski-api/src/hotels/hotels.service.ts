import { Inject, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { HOTEL_PROVIDERS } from './hotels.constants';
import { Hotel, IHotelProvider } from './interfaces/hotel-provider.interface';
import { SearchHotelsDto } from './dto/search-hotels.dto';

@Injectable()
export class HotelsService {
  constructor(
    @Inject(HOTEL_PROVIDERS) private readonly providers: IHotelProvider[],
  ) {}

  streamSearch(dto: SearchHotelsDto): Observable<{ data: Hotel[] }> {
    return new Observable((subscriber) => {
      const groupSizes = Array.from(
        { length: 10 - Number(dto.groupSize) + 1 },
        (_, i) => Number(dto.groupSize) + i,
      );

      const randomDelay = () =>
        new Promise<void>((resolve) => setTimeout(resolve, Math.random() * 3000));

      const tasks = this.providers.flatMap((provider) =>
        groupSizes.map((size) =>
          randomDelay().then(() =>
            provider.search({ ...dto, groupSize: size, skiSiteId: Number(dto.skiSiteId) }),
          ),
        ),
      );

      let remaining = tasks.length;
      let errorCount = 0;
      const seenIds = new Set<string>();

      tasks.forEach((task) => {
        task
          .then((hotels) => {
            const newHotels = hotels.filter((h) => !seenIds.has(h.id));
            newHotels.forEach((h) => seenIds.add(h.id));
            if (newHotels.length > 0) {
              subscriber.next({ data: newHotels });
            }
          })
          .catch((err: unknown) => {
            console.error('[HotelsService] provider search failed:', err);
            errorCount++;
          })
          .finally(() => {
            if (--remaining === 0) {
              if (errorCount === tasks.length) {
                subscriber.next({ type: 'error', data: { message: 'All providers failed' } } as any);
              }
              subscriber.next({ type: 'done', data: [] } as any);
              subscriber.complete();
            }
          });
      });
    });
  }
}
