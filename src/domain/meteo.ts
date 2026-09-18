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

export interface MetTimeseries {
    time: string;
    data: {
        instant: {
            details: {
                air_temperature?: number;
                relative_humidity?: number;
                wind_speed?: number;
                integral_of_surface_downwelling_shortwave_flux_in_air?: number;
            };
        };
    };
}

export interface MetResponse {
    properties: {
        timeseries: MetTimeseries[];
    };
}