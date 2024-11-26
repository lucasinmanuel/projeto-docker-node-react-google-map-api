import dotenv from 'dotenv';
dotenv.config({ path: '/app/.env' })

if (!process.env.GOOGLE_API_KEY) {
    throw new Error('Variáveis de ambiente obrigatórias não definidas.');
}

import express from "express";
import cors from "cors";
import routes from "./routes.js";

const app = express();

app.use(cors())

app.use(express.json());
app.use(routes);

app.listen(8080);