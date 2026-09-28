import "reflect-metadata";
import dotenv from "dotenv";
import { container } from "tsyringe";

import { LocationRepo } from "../adapters/driven/locationRepo";
import { LocationBanRepo } from "../adapters/driven/locationBanRepo";
import { LocationDemoRepo } from "../adapters/driven/locationDemoRepo";
import { CachedLocationRepository } from "../adapters/driven/cachedLocationRepo";

import { MeteoRepo } from "../adapters/driven/meteoRepo";
import { MeteoMetRepo } from "../adapters/driven/meteoMetRepo";
import { MeteoDemoRepo } from "../adapters/driven/meteoDemoRepo";

import { MeteoServiceFactory } from "../services/meteoServiceFactory";

import { LocationRepositoryPort } from "../ports/driven/locationRepositoryPort";
import { MeteoRepositoryPort } from "../ports/driven/meteoRepositoryPort";

dotenv.config({ quiet: true });


// ============================================================
// Repository de géocodage RÉEL
// ============================================================

container.register("LocationRepositoryPort", {
    useFactory: () => {
        const repository: LocationRepositoryPort =
            process.env.LOCATION_PROVIDER === "NOMINATIM"
                ? new LocationRepo()
                : new LocationBanRepo();

        return new CachedLocationRepository(repository);
    },
});


// ============================================================
// Repository météo RÉEL
// ============================================================

container.register("MeteoRepositoryPort", {
    useFactory: () => {
        if (process.env.METEO_PROVIDER === "MET_NORWAY") {
            return new MeteoMetRepo();
        }

        return new MeteoRepo();
    },
});


// ============================================================
// Repositories DEMO
// ============================================================

container.register("DemoLocationRepositoryPort", {
    useClass: LocationDemoRepo,
});

container.register("DemoMeteoRepositoryPort", {
    useClass: MeteoDemoRepo,
});


// ============================================================
// Factory qui choisit les services réels ou démo
// ============================================================

container.register("MeteoServiceFactory", {
    useClass: MeteoServiceFactory,
});


export { container };