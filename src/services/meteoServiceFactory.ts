// services/meteoServiceFactory.ts

import { injectable, inject } from "tsyringe";

import { LocationService } from "./locationService";
import { MeteoService } from "./meteoService";

import { LocationRepositoryPort } from "../ports/driven/locationRepositoryPort";
import { MeteoRepositoryPort } from "../ports/driven/meteoRepositoryPort";

export interface MeteoServices {
    locationService: LocationService;
    meteoService: MeteoService;
}

@injectable()
export class MeteoServiceFactory {
    constructor(
        @inject("LocationRepositoryPort")
        private readonly locationRepository: LocationRepositoryPort,

        @inject("MeteoRepositoryPort")
        private readonly meteoRepository: MeteoRepositoryPort,

        @inject("DemoLocationRepositoryPort")
        private readonly demoLocationRepository: LocationRepositoryPort,

        @inject("DemoMeteoRepositoryPort")
        private readonly demoMeteoRepository: MeteoRepositoryPort
    ) {}

    create(demo: boolean): MeteoServices {
        if (demo) {
            return {
                locationService: new LocationService(
                    this.demoLocationRepository
                ),
                meteoService: new MeteoService(
                    this.demoMeteoRepository
                ),
            };
        }

        return {
            locationService: new LocationService(
                this.locationRepository
            ),
            meteoService: new MeteoService(
                this.meteoRepository
            ),
        };
    }
}