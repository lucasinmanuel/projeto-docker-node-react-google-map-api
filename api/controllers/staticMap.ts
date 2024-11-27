import { Request, Response } from 'express';

const staticMap = async (request: Request, response: Response) => {
    const { origin, destination } = request.body;
    try {
        if (!origin || !destination) {
            return response.status(400).json({ error: "Origin and destination are required." });
        }
        const url = `https://www.google.com/maps/embed/v1/directions?key=${process.env.GOOGLE_API_KEY}&origin=${origin}&destination=${destination}`;
        return response.status(200).json(url);
    } catch (error: any) {
        return response.status(400).json({ error: error.message });
    }
};

export default staticMap;