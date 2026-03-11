export interface HotelSearchQuery {
  skiSiteId: number;
  groupSize: number;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
}

export interface HotelImage {
  url: string;
  isMain: boolean;
}

export interface Hotel {
  id: string;
  name: string;
  pricePerNight: number;
  maxGuests: number;
  skiSiteId: number;
  rating: number;
  images: HotelImage[];
}

export interface IHotelProvider {
  search(query: HotelSearchQuery): Promise<Hotel[]>;
}
