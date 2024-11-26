import { Request, Response } from 'express';

const staticMap = async (request: Request, response: Response) => {
    const { overviewPolyline } = request.body;
    try {
        const staticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?size=800x600&path=enc:${overviewPolyline}&key=${process.env.GOOGLE_API_KEY}`;
        return response.status(200).json(staticMapUrl);
    } catch (error: any) {
        console.error(error);  // Log do erro para depuração
        return response.status(400).json({ error: error.message });
    }
};

export default staticMap;