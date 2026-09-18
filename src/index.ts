import 'reflect-metadata';

import express, { Request, Response } from 'express';
import { container } from './config/container';
import { MeteoController } from './adapters/driving/meteoController';

const app = express();
const PORT = 5000;

app.use(express.json());

const meteoController = container.resolve(MeteoController);

// Test route
app.get('/debug', (req: Request, res: Response) => {
    res.send('API is running');
});

meteoController.registerRoutes(app);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});