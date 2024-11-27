import { Client } from "@googlemaps/google-maps-services-js";

import { Request, Response } from "express";
import pool from "../connection.js";
import { DriverNotFound, InvalidDataError, InvalidDistance, InvalidDriverError, NoRidesFoundError } from "../interfaces/RideInterfaces.js";

const invalidDataError: InvalidDataError = {
    message: {
        error_code: "INVALID_DATA",
        error_description: "string"
    },
    status: 400
};

const driverNotFound: DriverNotFound = {
    message: {
        error_code: "DRIVER_NOT_FOUND",
        error_description: "string"
    },
    status: 404
}

const invalidDistance: InvalidDistance = {
    message: {
        error_code: "INVALID_DISTANCE",
        error_description: "string"
    },
    status: 406
}

const invalidDriver: InvalidDriverError = {
    message: {
        error_code: "INVALID_DRIVER",
        error_description: "string"
    },
    status: 400
};

const noRidesFound: NoRidesFoundError = {
    message: {
        error_code: "NO_RIDES_FOUND",
        error_description: "string"
    },
    status: 404
};

const isNotNumber = (str: string): boolean => {
    return isNaN(Number(str));
};

const rideEstimate = async (request: Request, response: Response) => {
    const { customer_id, origin, destination } = request.body;
    const client = new Client({});
    try {
        if (isNotNumber(customer_id) || [origin, destination].includes(undefined) || origin === destination) {
            throw invalidDataError;
        }

        const { data } = await client.directions({
            params: {
                origin: origin,
                destination: destination,
                key: process.env.GOOGLE_API_KEY as string,
            }
        })

        const { rows } = await pool.query("SELECT * FROM drivers");
        const distanceInKm = data.routes[0].legs[0].distance.value / 1000; //Distância em km

        return response.status(200).json({
            origin: {
                latitude: data.routes[0].legs[0].start_location.lat,
                longitude: data.routes[0].legs[0].start_location.lng
            },
            destination: {
                latitude: data.routes[0].legs[0].end_location.lat,
                longitude: data.routes[0].legs[0].end_location.lng
            },
            distance: data.routes[0].legs[0].distance.value, //Distância em metros
            duration: data.routes[0].legs[0].duration.text,
            options: rows
                .filter(row => distanceInKm >= row.km_minimo)
                .map(row => {
                    return {
                        id: row.id,
                        name: row.nome,
                        description: row.descricao,
                        vehicle: row.carro,
                        review: {
                            rating: Number(row.avaliacao),
                            comment: row.comentarios
                        },
                        value: Number(row.taxa_km * distanceInKm)
                    };
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
    try {
        const driver_id = driver.id;
        if (
            isNotNumber(customer_id) || isNotNumber(distance) || isNotNumber(value) || isNotNumber(driver_id) || origin === destination ||
            [origin, destination, duration, driver].includes(undefined)
        ) {
            throw invalidDataError;
        }
        const { rowCount, rows } = await pool.query(
            'SELECT * FROM drivers d WHERE d.id = $1',
            [driver.id]
        );
        if (rowCount == 0) {
            throw driverNotFound;
        }

        if (Number(distance) / 1000 < rows[0].km_minimo) {
            throw invalidDistance;
        }

        const query = `
            INSERT INTO rides (customer_id, origin, destination, distance, duration, driver_id, driver_name, ride_value)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        `;

        const values = [
            customer_id,
            origin,
            destination,
            distance,
            duration,
            driver_id,
            driver.name,
            value
        ];

        const data = await pool.query(query, values);

        return response.status(200).json({
            success: true
        });
    } catch (error: any) {
        if (error.status && error.message) {
            return response.status(error.status).json(error.message);
        } else {
            return response.status(500).json(error);
        }
    };
};

const rideHistory = async (request: Request, response: Response) => {
    const { customer_id } = request.params;
    const { driver_id } = request.query;
    try {
        if (isNotNumber(customer_id)) {
            throw invalidDataError;
        }

        var query = "SELECT * FROM rides r WHERE r.customer_id = $1";
        var values = [customer_id];

        if (driver_id != undefined) {
            if (driver_id == "" || isNotNumber(driver_id as string)) {
                throw invalidDriver;
            }
            const { rowCount } = await pool.query(
                'SELECT * FROM drivers d WHERE d.id = $1',
                [driver_id]
            );
            if (rowCount == 0) {
                throw invalidDriver;
            }
            query = "SELECT * FROM rides r WHERE r.customer_id = $1 AND r.driver_id = $2";
            values = [customer_id, driver_id as string];
        }

        const { rows, rowCount } = await pool.query(query, values);

        if (rowCount == 0) {
            throw noRidesFound;
        }

        const history = {
            customer_id: `${customer_id}`,
            rides: rows.map((ride) => {
                return {
                    id: Number(ride.id),
                    date: ride.created_at,
                    origin: ride.origin,
                    destination: ride.destination,
                    distance: Number(ride.distance),
                    duration: ride.duration,
                    driver: {
                        id: Number(ride.driver_id),
                        name: ride.driver_name
                    },
                    value: Number(ride.ride_value)
                }
            })
        }

        return response.status(200).json(history);
    } catch (error: any) {
        if (error.status && error.message) {
            return response.status(error.status).json(error.message);
        } else {
            return response.status(500).json(error);
        }
    };
}

export {
    rideEstimate,
    rideConfirm,
    rideHistory
}