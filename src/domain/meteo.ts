import { Location } from './location';

export interface Meteo {
  location: Location;
  previsions: Prevision[];
}

export interface Prevision {
  date: Date;
  shortwaveRadiation: number;
}

export interface OpenMeteoResponse {
  hourly: {
    time: string[];
    shortwave_radiation: number[];
  };
}