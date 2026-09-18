import { Location } from "../../domain/location";
import { Meteo, Prevision, OpenMeteoResponse } from "../../domain/meteo";
import { MeteoRepositoryPort } from "../../ports/driven/meteoRepositoryPort";

export class MeteoRepo implements MeteoRepositoryPort {
  async find(location: Location): Promise<Meteo> {
    const url = new URL("https://api.open-meteo.com/v1/forecast");

    url.searchParams.set("latitude", location.latitude.toString());
    url.searchParams.set("longitude", location.longitude.toString());
    url.searchParams.set("hourly", "shortwave_radiation");

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `Open-Meteo request failed: ${response.status} ${response.statusText}`,
      );
    }

    const data: OpenMeteoResponse = await response.json();

    const previsions: Prevision[] = data.hourly.time.map(
      (time, index): Prevision => ({
        date: new Date(time),
        shortwaveRadiation: data.hourly.shortwave_radiation[index],
      }),
    );

    return {
      location,
      previsions,
    };
  }
}
