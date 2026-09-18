import { Request, Response } from 'express';
import { MeteoController } from '../../adapters/driving/meteoController';
import { MeteoService } from '../../services/meteoService';
import { LocationService } from '../../services/locationService';
import { Location } from '../../domain/location';
import { Meteo } from '../../domain/meteo';

describe('MeteoController', () => {
    let meteo_service: jest.Mocked<MeteoService>;
    let location_service: jest.Mocked<LocationService>;
    let controller: MeteoController;
    let res: Partial<Response>;

    beforeEach(() => {
        location_service = {
            listLocations: jest.fn(),
        } as unknown as jest.Mocked<LocationService>;

        meteo_service = {
            listMeteo: jest.fn(),
        } as unknown as jest.Mocked<MeteoService>;

        controller = new MeteoController(
            location_service,
            meteo_service
        );

        res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };
    });

    describe('getMeteoFromLocation', () => {

        it('should return the weather for a city', async () => {
            const location: Location = {
                name: 'Alès, Gard, Occitanie, France',
                latitude: 44.12489,
                longitude: 4.08357,
            };

            const meteo: Meteo = {
                location,
                previsions: [
                    {
                        date: new Date('2026-09-18T10:00:00'),
                        shortwaveRadiation: 250,
                    },
                    {
                        date: new Date('2026-09-18T11:00:00'),
                        shortwaveRadiation: 420,
                    },
                ],
            };

            location_service.listLocations.mockResolvedValue([
                location,
            ]);

            meteo_service.listMeteo.mockResolvedValue(meteo);

            const req = {
                params: {
                    name: 'Alès',
                },
            } as Partial<Request>;

            await controller.getMeteoFromLocation(
                req as Request,
                res as Response
            );

            // Vérifie que la ville a bien été recherchée
            expect(location_service.listLocations)
                .toHaveBeenCalledTimes(1);

            expect(location_service.listLocations)
                .toHaveBeenCalledWith('Alès');

            // Vérifie que la météo utilise la bonne Location
            expect(meteo_service.listMeteo)
                .toHaveBeenCalledTimes(1);

            expect(meteo_service.listMeteo)
                .toHaveBeenCalledWith(location);

            // Vérifie que la météo est retournée
            expect(res.json)
                .toHaveBeenCalledTimes(1);

            expect(res.json)
                .toHaveBeenCalledWith(meteo);
        });

        it('should return 404 if the city is not found', async () => {
            location_service.listLocations.mockResolvedValue([]);

            const req = {
                params: {
                    name: 'UnknownCity',
                },
            } as Partial<Request>;

            await controller.getMeteoFromLocation(
                req as Request,
                res as Response
            );

            expect(location_service.listLocations)
                .toHaveBeenCalledTimes(1);

            expect(location_service.listLocations)
                .toHaveBeenCalledWith('UnknownCity');

            // Le service météo ne doit pas être appelé
            expect(meteo_service.listMeteo)
                .not.toHaveBeenCalled();

            expect(res.status)
                .toHaveBeenCalledWith(404);

            expect(res.json)
                .toHaveBeenCalledWith({
                    error: 'Location not found: UnknownCity',
                });
        });
        
        it('should return 500 if an error occurs', async () => {
            const consoleErrorSpy = jest
                .spyOn(console, 'error')
                .mockImplementation(() => {});

            location_service.listLocations.mockRejectedValue(
                new Error('Nominatim error')
            );

            const req = {
                params: {
                    name: 'Alès',
                },
            } as Partial<Request>;

            await controller.getMeteoFromLocation(
                req as Request,
                res as Response
            );

            expect(res.status)
                .toHaveBeenCalledWith(500);

            expect(res.json)
                .toHaveBeenCalledWith({
                    error: 'Unable to retrieve weather data',
                });

            expect(consoleErrorSpy)
                .toHaveBeenCalled();

            consoleErrorSpy.mockRestore();
        });

        it('should not call the weather service if no location is found', async () => {
            location_service.listLocations.mockResolvedValue([]);

            const req = {
                params: {
                    name: 'Paris',
                },
            } as Partial<Request>;

            await controller.getMeteoFromLocation(
                req as Request,
                res as Response
            );

            expect(meteo_service.listMeteo)
                .not.toHaveBeenCalled();

            expect(res.status)
                .toHaveBeenCalledWith(404);
        });
    });
});