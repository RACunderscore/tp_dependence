import { Location } from "../../domain/location";

export interface LocationRepositoryPort {
  find(name: string): Promise<Location[]>;
}
