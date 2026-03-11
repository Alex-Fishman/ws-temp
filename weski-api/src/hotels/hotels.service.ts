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

      const tasks = this.providers.flatMap((provider) =>
        groupSizes.map((size) =>
          provider.search({ ...dto, groupSize: size, skiSiteId: Number(dto.skiSiteId) }),
        ),
      );

      let remaining = tasks.length;
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
          })
          .finally(() => {
            if (--remaining === 0) subscriber.complete();
          });
      });
    });
  }
}
