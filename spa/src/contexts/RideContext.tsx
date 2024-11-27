import React, { createContext, useContext, useState, ReactNode } from 'react';
import { FormattedDriver, RideConfirm, RideContextProps, RideEstimate, RideHistory } from '../interfaces/RideInterfaces';
import { GoogleApiKey } from '../types/RideTypes';

const RideContext = createContext<RideContextProps | undefined>(undefined);

interface RideContextProviderProps {
    children: ReactNode;
}

const exampleRideEstimate: RideEstimate = {
    origin: {
        latitude: -23.55052,
        longitude: -46.633308,
    },
    destination: {
        latitude: -23.559616,
        longitude: -46.658867,
    },
    distance: 2.8, // Distância em km
    duration: "15 minutos",
    options: [
        {
            description: "Carro confortável com ar condicionado",
            id: 1,
            name: "João Silva",
            review: { rating: 4.8, comment: "Motorista muito educado e pontual" },
            value: 25.5, // Valor da corrida em reais
            vehicle: "Toyota Corolla, Preto",
        },
        {
            description: "Carro econômico",
            id: 2,
            name: "Maria Oliveira",
            review: { rating: 4.2, comment: "Carro limpo e agradável" },
            value: 20.0,
            vehicle: "Volkswagen Gol, Branco",
        },
    ],
    routeResponse: {
        polyline: "encoded-polyline-data", // Dados fictícios de uma rota
        legs: [
            {
                start_address: "Avenida Paulista, São Paulo, SP",
                end_address: "Rua Oscar Freire, São Paulo, SP",
                distance: { text: "2.8 km", value: 2800 },
                duration: { text: "15 minutos", value: 900 },
            },
        ],
    },
};

export const RideContextProvider: React.FC<RideContextProviderProps> = ({ children }) => {
    const [rideEstimate, setRideEstimate] = useState<RideEstimate | null>(null);
    const [rideConfirm, setRideConfirm] = useState<RideConfirm | null>(null);
    const [rideHistory, setRideHistory] = useState<RideHistory | null>(null);
    return (
        <RideContext.Provider value={{
            rideEstimate, setRideEstimate,
            rideHistory, setRideHistory,
            rideConfirm, setRideConfirm
        }}>
            {children}
        </RideContext.Provider>
    );
};

export const useRideContext = (): RideContextProps => {
    const context = useContext(RideContext);
    if (!context) {
        throw new Error('useRideContext  must be used within a RideContextProvider');
    }
    return context;
};