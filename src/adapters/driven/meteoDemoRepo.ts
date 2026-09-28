import { Location } from "../../domain/location";
import { Meteo, Prevision } from "../../domain/meteo";
import { MeteoRepositoryPort } from "../../ports/driven/meteoRepositoryPort";

export class MeteoDemoRepo implements MeteoRepositoryPort {
    async find(location: Location): Promise<Meteo> {
        const now = new Date();

        const previsions: Prevision[] = Array.from(
            { length: 5 },
            (_, index) => ({
                date: new Date(
                    now.getTime() + index * 60 * 60 * 1000
                ),
                shortwaveRadiation: 100 + index * 50,
            })
        );

        return {
            location,
            previsions,
        };
    }
}