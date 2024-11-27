import { Request, Response } from 'express';
import pool from '../connection.js';

const driver = async (request: Request, response: Response) => {
    try {
        const { rows } = await pool.query('SELECT * FROM drivers');
        return response.status(200).json(rows);
    } catch (error: any) {
        return response.status(400).json({ error: error.message });
    }
};

export default driver;