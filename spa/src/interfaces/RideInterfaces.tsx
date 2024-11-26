import { GoogleApiKey } from "../types/RideTypes"

export interface RideContextProps {
    rideEstimate: RideEstimate | null,
    setRideEstimate: (newValue: RideEstimate | null) => void,
    rideHistory: RideHistory | null,
    setRideHistory: (newValue: RideHistory | null) => void,
    googleApiKey: GoogleApiKey | null,
    setGoogleApiKey: (newValue: GoogleApiKey | null) => void,
    selectedDriver: FormattedDriver | null,
    setSelectedDriver: (newValue: FormattedDriver | null) => void
}

export interface RideEstimate {
    customer_id?: number,
    origin: {
        latitude: number,
        longitude: number
    },
    origin_name?: string,
    destination: {
        latitude: number,
        longitude: number,
    },
    destination_name?: string,
    distance: number,
    duration: string,
    options: Driver[],
    routeResponse: any
}

export interface Driver {
    description: string
    id: number,
    name: string
    review: { rating: number, comment: string },
    value: number,
    vehicle: string
}

export interface FormattedDriver {
    description: string
    id: number,
    name: string
    review_rating: number,
    review_comment: string,
    value: number,
    vehicle: string
}

export interface RideHistory {
    customer_id: string,
    rides: {
        id: number,
        date: Date,
        origin: string,
        destination:
        string,
        distance: number,
        duration:
        string,
        driver: {
            id: number,
            name: string
        },
        value: number
    }[]
}