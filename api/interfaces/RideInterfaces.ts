export interface RideEstimateError {
    message: {
        error_code: string,
        error_description: string
    },
    status: number
}
