import { Location } from "../../domain/location";
import { Meteo, Prevision, MetResponse } from "../../domain/meteo";
import { MeteoRepositoryPort } from "../../ports/driven/meteoRepositoryPort";

export class MeteoMetRepo implements MeteoRepositoryPort {

    async find(location: Location): Promise<Meteo> {
        const url = new URL(
            "https://api.met.no/weatherapi/locationforecast/2.0/compact"
        );

        url.searchParams.set(
            "lat",
            location.latitude.toString()
        );

        url.searchParams.set(
            "lon",
            location.longitude.toString()
        );

        const response = await fetch(url, {
            headers: {
                "User-Agent": "tp1ApiMeteo/1.0 (thomas.humbert@etu.mines-ales.fr)",
                "Accept": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(
                `MET Norway request failed: ${response.status} ${response.statusText}`
            );
        }

        const data: MetResponse = await response.json();

        const previsions: Prevision[] =
            data.properties.timeseries.map(
                (timeserie): Prevision => ({
                    date: new Date(timeserie.time),

                    shortwaveRadiation:
                        timeserie.data.instant.details.integral_of_surface_downwelling_shortwave_flux_in_air ?? 0,
                })
            );

        return {
            location,
            previsions,
        };
    }
}