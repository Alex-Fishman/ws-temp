import { Injectable } from '@nestjs/common';
import { Hotel, HotelSearchQuery, IHotelProvider } from '../../interfaces/hotel-provider.interface';

// Converts YYYY-MM-DD to MM/DD/YYYY as required by the external API
function toApiDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-');
  return `${month}/${day}/${year}`;
}

interface WeskiMockApiResponse {
  statusCode: number;
  body: {
    success: string;
    accommodations: Array<{
      HotelCode: string;
      HotelName: string;
      HotelDescriptiveContent: {
        Images: Array<{
          MainImage?: string;
          URL: string;
        }>;
      };
      HotelInfo: {
        Rating: string;
        Beds: string;
      };
      PricesInfo: {
        AmountAfterTax: string;
      };
    }>;
  };
}

@Injectable()
export class WeskiMockProvider implements IHotelProvider {
  // in real world use the env only
  private readonly apiUrl = process.env.WESKI_API_URL ?? 'https://gya7b1xubh.execute-api.eu-west-2.amazonaws.com/default/HotelsSimulator'; 

  async search(query: HotelSearchQuery): Promise<Hotel[]> {
    let response: Response;
    try {
      response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: {
            ski_site: query.skiSiteId,
            from_date: toApiDate(query.startDate),
            to_date: toApiDate(query.endDate),
            group_size: query.groupSize,
          },
        }),
      });
    } catch (err) {
      console.error('[WeskiMockProvider] fetch threw:', err);
      return [];
    }
    if (!response.ok) return [];

    const data: WeskiMockApiResponse = await response.json();

    return data.body.accommodations.map((h) => ({
      id: `${h.HotelCode}_${h.PricesInfo.AmountAfterTax}`, // not sure HotelCode is enough to verify that it is unique, combine with price
      name: h.HotelName,
      pricePerNight: parseFloat(h.PricesInfo.AmountAfterTax),
      maxGuests: parseInt(h.HotelInfo.Beds, 10),
      skiSiteId: query.skiSiteId,
      rating: parseInt(h.HotelInfo.Rating, 10),
      images: (h.HotelDescriptiveContent?.Images ?? []).map((img) => ({
        url: img.URL,
        isMain: img.MainImage === 'True',
      })),
    }));
  }
}
