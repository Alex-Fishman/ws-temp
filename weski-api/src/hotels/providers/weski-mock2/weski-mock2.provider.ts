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

const PRICE_MULTIPLIER = 1.15;
const PROVIDER_SUFFIX = ' (Mock2)';

@Injectable()
export class WeskiMock2Provider implements IHotelProvider {
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
      console.error('[WeskiMock2Provider] fetch threw:', err);
      throw err;
    }
    if (!response.ok) {
      throw new Error(`[WeskiMock2Provider] HTTP ${response.status}`);
    }

    const data: WeskiMockApiResponse = await response.json();

    return data.body.accommodations.map((h) => {
      const originalPrice = parseFloat(h.PricesInfo.AmountAfterTax);
      const scrambledPrice = parseFloat((originalPrice * PRICE_MULTIPLIER).toFixed(2));
      return {
        id: `mock2_${h.HotelCode}_${scrambledPrice}`,
        name: h.HotelName + PROVIDER_SUFFIX,
        pricePerNight: scrambledPrice,
        maxGuests: parseInt(h.HotelInfo.Beds, 10),
        skiSiteId: query.skiSiteId,
        rating: parseInt(h.HotelInfo.Rating, 10),
        images: (h.HotelDescriptiveContent?.Images ?? []).map((img) => ({
          url: img.URL,
          isMain: img.MainImage === 'True',
        })),
      };
    });
  }
}
