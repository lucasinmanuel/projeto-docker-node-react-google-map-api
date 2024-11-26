import { Request, Response } from 'express';

const googleApiKey = async (request: Request, response: Response) => {
    try {
        const googleApiKey = process.env.GOOGLE_API_KEY;
        if (!googleApiKey) {
            throw new Error('Variáveis de ambiente obrigatórias não definidas.');
        }

        console.log("A chave da API foi acessada.");

        return response.status(200).json(googleApiKey);
    } catch (error: any) {
        console.error(error);  // Log do erro para depuração
        return response.status(400).json({ error: error.message });
    }
};

export default googleApiKey;