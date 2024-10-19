export interface WeatherData {
  temperature: number;
  description: string;
}

export interface WeatherResult {
  id: number;
  weather: WeatherData | null;
}
