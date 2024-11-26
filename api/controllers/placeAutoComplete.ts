import { Client, PlaceAutocompleteType } from "@googlemaps/google-maps-services-js";
import { Request, Response } from "express";

const placeAutocomplete = async (request: Request, response: Response) => {
    const { input } = request.body;
    const client = new Client({});
    try {
        const res = await client.placeAutocomplete({ params: { input: input, key: process.env.GOOGLE_API_KEY, types: PlaceAutocompleteType.geocode, language: "pt-br" } });
        const suggestions = res.data.predictions.map((place) => ({
            description: place.description,
            place_id: place.place_id,
        }));
        return response.status(200).json(suggestions);
    } catch (error: any) {
        if (error.status && error.message) {
            return response.status(error.status).json(error.message);
        } else {
            return response.status(500).json(error);
        }
    };
};

export default placeAutocomplete;