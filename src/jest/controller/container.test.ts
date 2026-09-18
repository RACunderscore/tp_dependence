describe('Dependency Injection Container', () => {
    const originalLocationProvider = process.env.LOCATION_PROVIDER;
    const originalMeteoProvider = process.env.METEO_PROVIDER;

    afterEach(() => {
        process.env.LOCATION_PROVIDER = originalLocationProvider;
        process.env.METEO_PROVIDER = originalMeteoProvider;

        jest.resetModules();
    });

    it('should use LocationBanRepo and MeteoMetRepo when configured', async () => {
        process.env.LOCATION_PROVIDER = 'BAN';
        process.env.METEO_PROVIDER = 'MET_NORWAY';

        jest.resetModules();

        const { container } = await import('../../config/container');

        const { LocationBanRepo } =
            await import('../../adapters/driven/locationBanRepo');

        const { MeteoMetRepo } =
            await import('../../adapters/driven/meteoMetRepo');

        const locationRepo = container.resolve(
            'LocationRepositoryPort'
        );

        const meteoRepo = container.resolve(
            'MeteoRepositoryPort'
        );

        expect(locationRepo).toBeInstanceOf(LocationBanRepo);
        expect(meteoRepo).toBeInstanceOf(MeteoMetRepo);
    });

    it('should use LocationRepo and MeteoRepo when configured', async () => {
        process.env.LOCATION_PROVIDER = 'NOMINATIM';
        process.env.METEO_PROVIDER = 'OPEN_METEO';

        jest.resetModules();

        const { container } = await import('../../config/container');

        const { LocationRepo } =
            await import('../../adapters/driven/locationRepo');

        const { MeteoRepo } =
            await import('../../adapters/driven/meteoRepo');

        const locationRepo = container.resolve(
            'LocationRepositoryPort'
        );

        const meteoRepo = container.resolve(
            'MeteoRepositoryPort'
        );

        expect(locationRepo).toBeInstanceOf(LocationRepo);
        expect(meteoRepo).toBeInstanceOf(MeteoRepo);
    });

    it('should use BAN with Open-Meteo', async () => {
        process.env.LOCATION_PROVIDER = 'BAN';
        process.env.METEO_PROVIDER = 'OPEN_METEO';

        jest.resetModules();

        const { container } = await import('../../config/container');

        const { LocationBanRepo } =
            await import('../../adapters/driven/locationBanRepo');

        const { MeteoRepo } =
            await import('../../adapters/driven/meteoRepo');

        const locationRepo = container.resolve(
            'LocationRepositoryPort'
        );

        const meteoRepo = container.resolve(
            'MeteoRepositoryPort'
        );

        expect(locationRepo).toBeInstanceOf(LocationBanRepo);
        expect(meteoRepo).toBeInstanceOf(MeteoRepo);
    });

    it('should use Nominatim with MET Norway', async () => {
        process.env.LOCATION_PROVIDER = 'NOMINATIM';
        process.env.METEO_PROVIDER = 'MET_NORWAY';

        jest.resetModules();

        const { container } = await import('../../config/container');

        const { LocationRepo } =
            await import('../../adapters/driven/locationRepo');

        const { MeteoMetRepo } =
            await import('../../adapters/driven/meteoMetRepo');

        const locationRepo = container.resolve(
            'LocationRepositoryPort'
        );

        const meteoRepo = container.resolve(
            'MeteoRepositoryPort'
        );

        expect(locationRepo).toBeInstanceOf(LocationRepo);
        expect(meteoRepo).toBeInstanceOf(MeteoMetRepo);
    });
});