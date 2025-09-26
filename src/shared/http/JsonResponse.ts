import { type Response } from "express";
import { type ValidationResult } from "../dto/validation.js";

type SuccessOptions<T> = {
  status?: number;
  message?: string;
  meta?: Record<string, unknown>;
  mapper?: (data: T) => unknown;
};

type ErrorOptions = {
  status?: number;
  code?: string;
  details?: unknown;
};

class JsonResponse {
  private constructor(private readonly response: Response) {}

  static using(response: Response): JsonResponse {
    return new JsonResponse(response);
  }

  success<T>(data: T, options: SuccessOptions<T> = {}) {
    const { status = 200, message, meta, mapper } = options;
    const payload: Record<string, unknown> = {
      data: mapper ? mapper(data) : data,
    };

    if (message) {
      payload.message = message;
    }

    if (meta) {
      payload.meta = meta;
    }

    return this.response.status(status).json(payload);
  }

  created<T>(data: T, options: Omit<SuccessOptions<T>, "status"> = {}) {
    return this.success(data, { ...options, status: 201 });
  }

  noContent() {
    return this.response.status(204).send();
  }

  error(message: string, options: ErrorOptions = {}) {
    const { status = 400, code, details } = options;
    const payload: Record<string, unknown> = { message };

    if (code) {
      payload.code = code;
    }

    if (details !== undefined) {
      payload.details = details;
    }

    return this.response.status(status).json(payload);
  }

  fromValidation<T>(result: ValidationResult<T>, options: SuccessOptions<T> = {}) {
    if (!result.success) {
      return this.error(
        result.message,
        result.status !== undefined ? { status: result.status } : {}
      );
    }

    return this.success(result.data, options);
  }
}

export { JsonResponse };
