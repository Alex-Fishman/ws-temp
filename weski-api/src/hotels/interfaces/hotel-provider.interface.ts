export interface HotelSearchQuery {
  skiSiteId: number;
  groupSize: number;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
}

export interface Hotel {
  id: string;
  name: string;
  pricePerNight: number;
  maxGuests: number;
  skiSiteId: number;
}

export interface IHotelProvider {
  search(query: HotelSearchQuery): Promise<Hotel[]>;
}
