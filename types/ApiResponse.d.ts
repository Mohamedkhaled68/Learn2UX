// API Error Response
interface ApiErrorResponse {
    message?: string;
    error?: string;
}

// Login Response
interface LoginResponse {
    data: {
        token: string;
        message?: string;
    };
}

export { ApiErrorResponse, LoginResponse };
