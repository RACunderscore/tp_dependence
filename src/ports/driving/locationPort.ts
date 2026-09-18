import { Location } from "../../domain/location";

export interface LocationPort {
  listLocations(name: string): Promise<Location[]>;
}
