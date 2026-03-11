const API_BASE = 'http://localhost:3000/api';

export interface HotelSearchParams {
  resortId: string;
  groupSize: number;
  startDate: string;
  endDate: string;
}

export interface Hotel {
  id: string;
  name: string;
  resortId: string;
  pricePerNight: string;
  maxGuests: number;
}

export async function searchHotels(params: HotelSearchParams): Promise<Hotel[]> {
  const query = new URLSearchParams({
    resortId: params.resortId,
    groupSize: String(params.groupSize),
    startDate: params.startDate,
    endDate: params.endDate,
  });

  const response = await fetch(`${API_BASE}/hotels/search?${query}`);
  if (!response.ok) throw new Error('Failed to fetch hotels');
  return response.json();
}
