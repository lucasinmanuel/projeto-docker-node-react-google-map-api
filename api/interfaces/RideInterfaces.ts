export interface InvalidDataError {
    message: {
        error_code: "INVALID_DATA",
        error_description: "string"
    },
    status: 400
}

export interface DriverNotFound {
    message: {
        error_code: "DRIVER_NOT_FOUND",
        error_description: "string"
    },
    status: 404
}

export interface InvalidDistance {
    message: {
        error_code: "INVALID_DISTANCE",
        error_description: "string"
    },
    status: 406
}

export interface InvalidDriverError {
    message: {
        error_code: "INVALID_DRIVER",
        error_description: "string"
    },
    status: 400
}

export interface NoRidesFoundError {
    message: {
        error_code: "NO_RIDES_FOUND",
        error_description: "string"
    },
    status: 404
}
