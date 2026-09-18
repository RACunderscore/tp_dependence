import { Location } from "../../domain/location";
import { Meteo } from "../../domain/meteo";

export interface MeteoRepositoryPort {
  find(location: Location): Promise<Meteo>;
}
