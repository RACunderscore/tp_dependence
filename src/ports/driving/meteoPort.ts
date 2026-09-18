import { Location } from "../../domain/location";
import { Meteo } from "../../domain/meteo";

export interface MeteoPort {
  listMeteo(location: Location): Promise<Meteo>;
}
