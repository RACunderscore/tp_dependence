import { Request, Response } from "express";

import { MeteoController } from "../../adapters/driving/meteoController";
import { Location } from "../../domain/location";
import { Meteo } from "../../domain/meteo";

import { LocationRepositoryPort } from "../../ports/driven/locationRepositoryPort";
import { MeteoRepositoryPort } from "../../ports/driven/meteoRepositoryPort";

import {
    MeteoServiceFactory,
    MeteoServices,
} from "../../services/meteoServiceFactory";

import { LocationService } from "../../services/locationService";
import { MeteoService } from "../../services/meteoService";


// ============================================================
// TESTS DE LA FACTORY
// ============================================================

describe("MeteoServiceFactory", () => {
    let locationRepository: jest.Mocked<LocationRepositoryPort>;
    let meteoRepository: jest.Mocked<MeteoRepositoryPort>;

    let demoLocationRepository: jest.Mocked<LocationRepositoryPort>;
    let demoMeteoRepository: jest.Mocked<MeteoRepositoryPort>;

    let factory: MeteoServiceFactory;

    beforeEach(() => {
        locationRepository = {
            find: jest.fn(),
        };

        meteoRepository = {
            find: jest.fn(),
        };

        demoLocationRepository = {
            find: jest.fn(),
        };

        demoMeteoRepository = {
            find: jest.fn(),
        };

        factory = new MeteoServiceFactory(
            locationRepository,
            meteoRepository,
            demoLocationRepository,
            demoMeteoRepository
        );
    });

    it("doit utiliser les repositories démo lorsque demo=true", async () => {
        const services = factory.create(true);

        const location: Location = {
            name: "Alès",
            latitude: 44.12489,
            longitude: 4.08357,
        };

        const meteo: Meteo = {
            location,
            previsions: [],
        };

        demoLocationRepository.find.mockResolvedValue([
            location,
        ]);

        demoMeteoRepository.find.mockResolvedValue(meteo);

        const locations = await services.locationService.listLocations(
            "Alès"
        );

        await services.meteoService.listMeteo(location);

        expect(demoLocationRepository.find)
            .toHaveBeenCalledWith("Alès");

        expect(demoMeteoRepository.find)
            .toHaveBeenCalledWith(location);

        expect(locationRepository.find)
            .not.toHaveBeenCalled();

        expect(meteoRepository.find)
            .not.toHaveBeenCalled();

        expect(locations)
            .toEqual([location]);
    });

    it("doit utiliser les repositories réels lorsque demo=false", async () => {
        const services = factory.create(false);

        const location: Location = {
            name: "Alès",
            latitude: 44.12489,
            longitude: 4.08357,
        };

        const meteo: Meteo = {
            location,
            previsions: [],
        };

        locationRepository.find.mockResolvedValue([
            location,
        ]);

        meteoRepository.find.mockResolvedValue(meteo);

        const locations = await services.locationService.listLocations(
            "Alès"
        );

        await services.meteoService.listMeteo(location);

        expect(locationRepository.find)
            .toHaveBeenCalledWith("Alès");

        expect(meteoRepository.find)
            .toHaveBeenCalledWith(location);

        expect(demoLocationRepository.find)
            .not.toHaveBeenCalled();

        expect(demoMeteoRepository.find)
            .not.toHaveBeenCalled();

        expect(locations)
            .toEqual([location]);
    });

    it("ne doit jamais appeler les repositories réels en mode démo", async () => {
        const services = factory.create(true);

        const location: Location = {
            name: "Alès",
            latitude: 44.12489,
            longitude: 4.08357,
        };

        demoLocationRepository.find.mockResolvedValue([
            location,
        ]);

        demoMeteoRepository.find.mockResolvedValue({
            location,
            previsions: [],
        });

        await services.locationService.listLocations("Alès");
        await services.meteoService.listMeteo(location);

        expect(locationRepository.find)
            .not.toHaveBeenCalled();

        expect(meteoRepository.find)
            .not.toHaveBeenCalled();

        expect(demoLocationRepository.find)
            .toHaveBeenCalledTimes(1);

        expect(demoMeteoRepository.find)
            .toHaveBeenCalledTimes(1);
    });
});


// ============================================================
// TESTS DU CONTROLLER
// ============================================================

describe("MeteoController", () => {
    let factory: jest.Mocked<MeteoServiceFactory>;

    let locationService: jest.Mocked<LocationService>;
    let meteoService: jest.Mocked<MeteoService>;

    let controller: MeteoController;

    let res: Partial<Response>;

    const location: Location = {
        name: "Alès, Gard, Occitanie, France",
        latitude: 44.12489,
        longitude: 4.08357,
    };

    const meteo: Meteo = {
        location,
        previsions: [
            {
                date: new Date("2026-09-18T10:00:00"),
                shortwaveRadiation: 250,
            },
            {
                date: new Date("2026-09-18T11:00:00"),
                shortwaveRadiation: 420,
            },
        ],
    };

    beforeEach(() => {
        locationService = {
            listLocations: jest.fn(),
        } as unknown as jest.Mocked<LocationService>;

        meteoService = {
            listMeteo: jest.fn(),
        } as unknown as jest.Mocked<MeteoService>;

        factory = {
            create: jest.fn(),
        } as unknown as jest.Mocked<MeteoServiceFactory>;

        controller = new MeteoController(factory);

        res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };
    });


    it("doit utiliser les services démo lorsque demo=true", async () => {
        factory.create.mockReturnValue({
            locationService,
            meteoService,
        });

        locationService.listLocations.mockResolvedValue([
            location,
        ]);

        meteoService.listMeteo.mockResolvedValue(meteo);

        const req = {
            params: {
                name: "Alès",
                demo: "true",
            },
        } as Partial<Request>;

        await controller.getMeteoFromLocation(
            req as Request,
            res as Response
        );

        expect(factory.create)
            .toHaveBeenCalledWith(true);

        expect(locationService.listLocations)
            .toHaveBeenCalledWith("Alès");

        expect(meteoService.listMeteo)
            .toHaveBeenCalledWith(location);

        expect(res.json)
            .toHaveBeenCalledWith(meteo);
    });


    it("doit utiliser les services réels lorsque demo=false", async () => {
        factory.create.mockReturnValue({
            locationService,
            meteoService,
        });

        locationService.listLocations.mockResolvedValue([
            location,
        ]);

        meteoService.listMeteo.mockResolvedValue(meteo);

        const req = {
            params: {
                name: "Alès",
                demo: "false",
            },
        } as Partial<Request>;

        await controller.getMeteoFromLocation(
            req as Request,
            res as Response
        );

        expect(factory.create)
            .toHaveBeenCalledWith(false);

        expect(locationService.listLocations)
            .toHaveBeenCalledWith("Alès");

        expect(meteoService.listMeteo)
            .toHaveBeenCalledWith(location);

        expect(res.json)
            .toHaveBeenCalledWith(meteo);
    });


    it("doit retourner 404 si la ville n'est pas trouvée en mode démo", async () => {
        factory.create.mockReturnValue({
            locationService,
            meteoService,
        });

        locationService.listLocations.mockResolvedValue([]);

        const req = {
            params: {
                name: "UnknownCity",
                demo: "true",
            },
        } as Partial<Request>;

        await controller.getMeteoFromLocation(
            req as Request,
            res as Response
        );

        expect(factory.create)
            .toHaveBeenCalledWith(true);

        expect(locationService.listLocations)
            .toHaveBeenCalledWith("UnknownCity");

        expect(meteoService.listMeteo)
            .not.toHaveBeenCalled();

        expect(res.status)
            .toHaveBeenCalledWith(404);

        expect(res.json)
            .toHaveBeenCalledWith({
                error: "Location not found: UnknownCity",
            });
    });


    it("doit retourner 500 si le service démo provoque une erreur", async () => {
        const consoleErrorSpy = jest
            .spyOn(console, "error")
            .mockImplementation(() => {});

        factory.create.mockReturnValue({
            locationService,
            meteoService,
        });

        locationService.listLocations.mockRejectedValue(
            new Error("Demo error")
        );

        const req = {
            params: {
                name: "Alès",
                demo: "true",
            },
        } as Partial<Request>;

        await controller.getMeteoFromLocation(
            req as Request,
            res as Response
        );

        expect(factory.create)
            .toHaveBeenCalledWith(true);

        expect(res.status)
            .toHaveBeenCalledWith(500);

        expect(res.json)
            .toHaveBeenCalledWith({
                error: "Unable to retrieve weather data",
            });

        expect(consoleErrorSpy)
            .toHaveBeenCalled();

        consoleErrorSpy.mockRestore();
    });


    it("ne doit pas appeler le service météo si aucune ville n'est trouvée", async () => {
        factory.create.mockReturnValue({
            locationService,
            meteoService,
        });

        locationService.listLocations.mockResolvedValue([]);

        const req = {
            params: {
                name: "Paris",
                demo: "true",
            },
        } as Partial<Request>;

        await controller.getMeteoFromLocation(
            req as Request,
            res as Response
        );

        expect(meteoService.listMeteo)
            .not.toHaveBeenCalled();

        expect(res.status)
            .toHaveBeenCalledWith(404);
    });
});