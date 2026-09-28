import "reflect-metadata";

describe("Dependency Injection Container", () => {
    const originalLocationProvider = process.env.LOCATION_PROVIDER;
    const originalMeteoProvider = process.env.METEO_PROVIDER;

    afterEach(() => {
        process.env.LOCATION_PROVIDER = originalLocationProvider;
        process.env.METEO_PROVIDER = originalMeteoProvider;

        jest.resetModules();
    });

    it("should use LocationBanRepo with cache and MeteoMetRepo when configured", async () => {
        process.env.LOCATION_PROVIDER = "BAN";
        process.env.METEO_PROVIDER = "MET_NORWAY";

        jest.resetModules();

        const { container } = await import("../../config/container");

        const { CachedLocationRepository } =
            await import("../../adapters/driven/cachedLocationRepo");

        const { MeteoServiceFactory } =
            await import("../../services/meteoServiceFactory");

        const locationRepo = container.resolve(
            "LocationRepositoryPort"
        );

        const meteoRepo = container.resolve(
            "MeteoRepositoryPort"
        );

        const factory = container.resolve(
            "MeteoServiceFactory"
        );

        expect(locationRepo).toBeInstanceOf(CachedLocationRepository);
        expect(meteoRepo).toBeDefined();
        expect(factory).toBeInstanceOf(MeteoServiceFactory);
    });

    it("should use LocationRepo with cache and MeteoRepo when configured", async () => {
        process.env.LOCATION_PROVIDER = "NOMINATIM";
        process.env.METEO_PROVIDER = "OPEN_METEO";

        jest.resetModules();

        const { container } = await import("../../config/container");

        const { CachedLocationRepository } =
            await import("../../adapters/driven/cachedLocationRepo");

        const { MeteoServiceFactory } =
            await import("../../services/meteoServiceFactory");

        const locationRepo = container.resolve(
            "LocationRepositoryPort"
        );

        const meteoRepo = container.resolve(
            "MeteoRepositoryPort"
        );

        const factory = container.resolve(
            "MeteoServiceFactory"
        );

        expect(locationRepo).toBeInstanceOf(CachedLocationRepository);
        expect(meteoRepo).toBeDefined();
        expect(factory).toBeInstanceOf(MeteoServiceFactory);
    });

    it("should use BAN with Open-Meteo", async () => {
        process.env.LOCATION_PROVIDER = "BAN";
        process.env.METEO_PROVIDER = "OPEN_METEO";

        jest.resetModules();

        const { container } = await import("../../config/container");

        const { CachedLocationRepository } =
            await import("../../adapters/driven/cachedLocationRepo");

        const locationRepo = container.resolve(
            "LocationRepositoryPort"
        );

        const meteoRepo = container.resolve(
            "MeteoRepositoryPort"
        );

        expect(locationRepo).toBeInstanceOf(CachedLocationRepository);
        expect(meteoRepo).toBeDefined();
    });

    it("should use Nominatim with MET Norway", async () => {
        process.env.LOCATION_PROVIDER = "NOMINATIM";
        process.env.METEO_PROVIDER = "MET_NORWAY";

        jest.resetModules();

        const { container } = await import("../../config/container");

        const { CachedLocationRepository } =
            await import("../../adapters/driven/cachedLocationRepo");

        const locationRepo = container.resolve(
            "LocationRepositoryPort"
        );

        const meteoRepo = container.resolve(
            "MeteoRepositoryPort"
        );

        expect(locationRepo).toBeInstanceOf(CachedLocationRepository);
        expect(meteoRepo).toBeDefined();
    });

    it("should register the demo repositories", async () => {
        jest.resetModules();

        const { container } = await import("../../config/container");

        const { LocationDemoRepo } =
            await import("../../adapters/driven/locationDemoRepo");

        const { MeteoDemoRepo } =
            await import("../../adapters/driven/meteoDemoRepo");

        const demoLocationRepo = container.resolve(
            "DemoLocationRepositoryPort"
        );

        const demoMeteoRepo = container.resolve(
            "DemoMeteoRepositoryPort"
        );

        expect(demoLocationRepo).toBeInstanceOf(LocationDemoRepo);
        expect(demoMeteoRepo).toBeInstanceOf(MeteoDemoRepo);
    });

    it("should register the MeteoServiceFactory", async () => {
        jest.resetModules();

        const { container } = await import("../../config/container");

        const { MeteoServiceFactory } =
            await import("../../services/meteoServiceFactory");

        const factory = container.resolve(
            "MeteoServiceFactory"
        );

        expect(factory).toBeInstanceOf(MeteoServiceFactory);
    });

    it("should return demo services when factory.create(true) is used", async () => {
        jest.resetModules();

        const { container } = await import("../../config/container");
        const { MeteoServiceFactory } =
            await import("../../services/meteoServiceFactory");

        const factory = container.resolve(MeteoServiceFactory);

        const services = factory.create(true);

        expect(services.locationService).toBeDefined();
        expect(services.meteoService).toBeDefined();
    });

    it("should return real services when factory.create(false) is used", async () => {
        process.env.LOCATION_PROVIDER = "BAN";
        process.env.METEO_PROVIDER = "MET_NORWAY";

        jest.resetModules();

        const { container } = await import("../../config/container");
        const { MeteoServiceFactory } =
            await import("../../services/meteoServiceFactory");

        const factory = container.resolve(MeteoServiceFactory);

        const services = factory.create(false);

        expect(services.locationService).toBeDefined();
        expect(services.meteoService).toBeDefined();
    });
});
