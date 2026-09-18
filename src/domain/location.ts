export interface Location {
  name: string;
  longitude: number;
  latitude: number;
}

export interface NominatimResult {
  display_name: string;
  lon: string;
  lat: string;
}

export interface BanResult {
    properties: {
        label: string;
    };
    geometry: {
        coordinates: [number, number];
    };
}

export interface BanResponse {
    features: BanResult[];
}