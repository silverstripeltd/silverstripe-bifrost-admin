export class ApiError extends Error {
    code: number;
    body: string;

    constructor(code: number, message?: string, body?: string) {
        super(message);

        // Maintains proper stack trace for where our error was thrown (non-standard)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ApiError);
        }

        this.name = "ApiError";
        this.code = code
        if (typeof body !== 'undefined') {
            this.body = body
        }

    }
}

export class ForbiddenError extends ApiError {
    constructor(code: number, message?: string, body?: string) {
        super(code, message, body);

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ForbiddenError);
        }

        this.name = "ForbiddenError";
    }
}

export class JsonError extends ApiError {
    constructor(code: number, message?: string, body?: string) {
        super(code, message, body);

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, JsonError);
        }

        this.name = "JsonError";
    }
}
