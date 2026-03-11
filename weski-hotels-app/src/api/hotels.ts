const API_BASE = 'http://localhost:3000/api';

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

export interface HotelSearchParams {
  skiSiteId: number;
  groupSize: number;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
}

export function streamHotels(
  params: HotelSearchParams,
  onBatch: (hotels: Hotel[]) => void,
  onDone: () => void,
  onError: (err: Event) => void,
): () => void {
  const queryString = new URLSearchParams({
    skiSiteId: String(params.skiSiteId),
    groupSize: String(params.groupSize),
    startDate: params.startDate,
    endDate: params.endDate,
  });

  const eventSource = new EventSource(`${API_BASE}/hotels/search?${queryString}`);

  eventSource.onmessage = (event: MessageEvent<string>) => {
    const hotels: Hotel[] = JSON.parse(event.data);
    onBatch(hotels);
  };

  eventSource.addEventListener('error', (event) => {
    if (eventSource.readyState === EventSource.CLOSED) {
      onDone();
    } else {
      onError(event);
    }
    eventSource.close();
  });

  return () => eventSource.close();
}
