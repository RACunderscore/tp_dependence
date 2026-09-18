import { Express, Request, Response } from 'express';
import { injectable } from 'tsyringe';
import { MeteoService } from '../../services/meteoService';
import { LocationService } from '../../services/locationService';

@injectable()
export class MeteoController {

    constructor(
        private readonly locationService: LocationService,
        private readonly meteoService: MeteoService
    ) {}

    registerRoutes(app: Express): void {
        app.get(
            '/meteo/:name',
            this.getMeteoFromLocation.bind(this)
        );
    }

    async getMeteoFromLocation(
        req: Request,
        res: Response
    ): Promise<void> {
        try {
            const { name } = req.params;

            const locations =
                await this.locationService.listLocations(name);

            if (locations.length === 0) {
                res.status(404).json({
                    error: `Location not found: ${name}`,
                });
                return;
            }

            const location = locations[0];

            const meteo =
                await this.meteoService.listMeteo(location);

            res.json(meteo);

        } catch (error) {
            console.error(error);

            res.status(500).json({
                error: 'Unable to retrieve weather data',
            });
        }
    }
}