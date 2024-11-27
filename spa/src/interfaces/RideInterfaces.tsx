export interface RideContextProps {
    rideEstimate: RideEstimate | null,
    setRideEstimate: (newValue: RideEstimate | null) => void,
    rideHistory: RideHistory | null,
    setRideHistory: (newValue: RideHistory | null) => void,
    rideConfirm: RideConfirm | null,
    setRideConfirm: (newValue: RideConfirm | null) => void
}

export interface RideEstimate {
    origin: {
        latitude: number,
        longitude: number
    },
    destination: {
        latitude: number,
        longitude: number,
    },
    distance: number,
    duration: string,
    options: Driver[],
    routeResponse: any
}

export interface RideConfirm {
    customer_id: string,
    origin: string,
    destination: string,
    distance: number,
    duration: string,
    driver: {
        id: number,
        name: string
    },
    value: number
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
        date: string,
        origin: string,
        destination: string,
        distance: number,
        duration: string,
        driver: {
            id: number,
            name: string
        },
        value: number
    }[]
}

export interface FormattedRideHistory {
    id: number,
    date: string,
    origin: string,
    destination: string,
    distance: number,
    duration: string,
    driver_id: number,
    driver_name: string,
    value: number
}