import { Controller, Get, Query, Sse } from '@nestjs/common';
import { Observable } from 'rxjs';
import { HotelsService } from './hotels.service';
import { SearchHotelsDto } from './dto/search-hotels.dto';
import { Hotel } from './interfaces/hotel-provider.interface';

@Controller('hotels')
export class HotelsController {
  constructor(private readonly hotelsService: HotelsService) {}

  @Sse('search')
  search(@Query() query: SearchHotelsDto): Observable<{ data: Hotel[] }> {
    return this.hotelsService.streamSearch(query);
  }
}
