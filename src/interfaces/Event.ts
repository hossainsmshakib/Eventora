export interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  category: string;
  location: {
    lat: number;
    lng: number;
  };
  address: string;
  ticketPrice: number;
}
