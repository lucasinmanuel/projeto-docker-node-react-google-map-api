import { Client, LatLng, GeocodeResponse } from "@googlemaps/google-maps-services-js";

import { Request, Response } from "express";
import pool from "../connection.js";
import { RideEstimateError } from "../interfaces/RideInterfaces.js";

const rideEstimateError: RideEstimateError = {
    message: {
        error_code: "INVALID_DATA",
        error_description: "string"
    },
    status: 400
};

const isNotNumber = (str: string): boolean => {
    return isNaN(Number(str));
};

const rideEstimate = async (request: Request, response: Response) => {
    const { customer_id, origin, destination } = request.body;
    const client = new Client({});
    try {
        if (isNotNumber(customer_id) || origin === destination) {
            throw rideEstimateError;
        }

        const { data } = await client.directions({
            params: {
                origin: origin,
                destination: destination,
                key: process.env.GOOGLE_API_KEY as string,
            }
        });

        const { rows } = await pool.query("SELECT * FROM drivers");

        return response.status(200).json({
            origin: {
                latitude: data.routes[0].legs[0].start_location.lat,
                longitude: data.routes[0].legs[0].start_location.lng
            },
            destination: {
                latitude: data.routes[0].legs[0].end_location.lat,
                longitude: data.routes[0].legs[0].end_location.lng
            },
            distance: data.routes[0].legs[0].distance.value / 1000,
            duration: data.routes[0].legs[0].duration.text,
            options: rows
                .filter(row => data.routes[0].legs[0].distance.value >= row.km_minimo)
                .map(row => {
                    const distanceInKm = (data.routes[0].legs[0].distance.value / 1000)
                    return {
                        id: row.id,
                        name: row.nome,
                        description: row.descricao,
                        vehicle: row.carro,
                        review: {
                            rating: Number(row.avaliacao),
                            comment: row.comentarios
                        },
                        value: (row.taxa_km * distanceInKm).toLocaleString('pt-BR', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 })
                    }
                }),
            routeResponse: data
        });

    } catch (error: any) {
        if (error.status && error.message) {
            return response.status(error.status).json(error.message);
        } else {
            return response.status(500).json(error);
        }
    };
};

const rideConfirm = async (request: Request, response: Response) => {
    const { customer_id, origin, destination, distance, duration, driver, value } = request.body;
    const client = new Client({});
    try {
        if (isNotNumber(customer_id) || origin === destination) {
            throw rideEstimateError;
        }

    } catch (error: any) {
        if (error.status && error.message) {
            return response.status(error.status).json(error.message);
        } else {
            return response.status(500).json(error);
        }
    };
};

export {
    rideEstimate
}