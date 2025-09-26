import type { Request } from "express";
import {
  validationError,
  validationSuccess,
  type ValidationResult,
} from "./validation.js";

export type RequestBody = Record<string, unknown>;
export type RequestParams = Record<string, string | undefined>;

type NumberMessages = {
  invalid: string;
  missing?: string;
};

type StringMessages = {
  invalid: string;
};

type IdMessages = {
  missing: string;
  invalid: string;
};

abstract class BaseRequestDto {
  protected constructor(
    protected readonly body: RequestBody,
    protected readonly params: RequestParams
  ) {}

  protected static extractBody(request: Request): RequestBody {
    if (typeof request.body === "object" && request.body !== null) {
      return request.body as RequestBody;
    }

    return {};
  }

  protected static extractParams(request: Request): RequestParams {
    const params: RequestParams = {};
    const source = (request.params ?? {}) as Record<string, unknown>;
    for (const [key, value] of Object.entries(source)) {
      if (typeof value === "string" || typeof value === "number") {
        params[key] = String(value);
      }
    }

    return params;
  }

  protected static buildFromRequest<T extends BaseRequestDto>(
    this: new (body: RequestBody, params: RequestParams) => T,
    request: Request
  ): T {
    const body = BaseRequestDto.extractBody(request);
    const params = BaseRequestDto.extractParams(request);
    return new this(body, params);
  }

  protected success<T>(data: T): ValidationResult<T> {
    return validationSuccess(data);
  }

  protected error(message: string, status = 400): ValidationResult<never> {
    return validationError(message, status);
  }

  protected getParam(name: string): string | undefined {
    return this.params[name];
  }

  protected requireIdParam(name: string, messages: IdMessages): ValidationResult<number> {
    const raw = this.getParam(name);
    if (!raw) {
      return this.error(messages.missing);
    }

    const parsed = Number(raw);
    if (!Number.isInteger(parsed) || parsed <= 0) {
      return this.error(messages.invalid);
    }

    return this.success(parsed);
  }

  protected hasAnyField(...keys: string[]): boolean {
    return keys.some((key) => Object.prototype.hasOwnProperty.call(this.body, key));
  }

  protected firstValue<T = unknown>(...keys: string[]): T | undefined {
    for (const key of keys) {
      if (Object.prototype.hasOwnProperty.call(this.body, key)) {
        return this.body[key] as T;
      }
    }

    return undefined;
  }

  protected normalizeString(value: unknown): string | null {
    if (typeof value === "string") {
      const trimmed = value.trim();
      return trimmed.length > 0 ? trimmed : null;
    }

    return null;
  }

  protected optionalString(value: unknown): string | undefined {
    if (value === undefined || value === null) {
      return undefined;
    }

    const normalized = this.normalizeString(value);
    return normalized ?? undefined;
  }

  protected optionalNullableString(value: unknown): string | null | undefined {
    if (value === undefined) {
      return undefined;
    }

    if (value === null) {
      return null;
    }

    const normalized = this.normalizeString(value);
    return normalized ?? null;
  }

  protected requireString(value: unknown, message: string): ValidationResult<string> {
    const normalized = this.normalizeString(value);
    if (!normalized) {
      return this.error(message);
    }

    return this.success(normalized);
  }

  protected validateStringIfPresent(
    value: unknown,
    messages: StringMessages
  ): ValidationResult<string | undefined> {
    if (value === undefined) {
      return this.success(undefined);
    }

    const normalized = this.normalizeString(value);
    if (!normalized) {
      return this.error(messages.invalid);
    }

    return this.success(normalized);
  }

  protected validateNullableStringIfPresent(
    value: unknown,
    messages: StringMessages
  ): ValidationResult<string | null | undefined> {
    if (value === undefined) {
      return this.success(undefined);
    }

    if (value === null) {
      return this.success(null);
    }

    const normalized = this.normalizeString(value);
    if (!normalized) {
      return this.error(messages.invalid);
    }

    return this.success(normalized);
  }

  protected normalizeNumber(value: unknown): number | null {
    if (typeof value === "number" && Number.isFinite(value)) {
      return value;
    }

    if (typeof value === "string" && value.trim().length > 0) {
      const parsed = Number(value);
      if (!Number.isNaN(parsed) && Number.isFinite(parsed)) {
        return parsed;
      }
    }

    return null;
  }

  protected normalizeInteger(value: unknown): number | null {
    const numeric = this.normalizeNumber(value);
    if (numeric === null) {
      return null;
    }

    return Number.isInteger(numeric) ? numeric : null;
  }

  protected validateNumber(
    value: unknown,
    messages: NumberMessages,
    options: { required?: boolean } = {}
  ): ValidationResult<number | undefined> {
    if (value === undefined || value === null || value === "") {
      if (options.required) {
        return this.error(messages.missing ?? messages.invalid);
      }

      return this.success(undefined);
    }

    const numeric = this.normalizeNumber(value);
    if (numeric === null) {
      return this.error(messages.invalid);
    }

    return this.success(numeric);
  }

  protected validateInteger(
    value: unknown,
    messages: NumberMessages,
    options: { required?: boolean } = {}
  ): ValidationResult<number | undefined> {
    if (value === undefined || value === null || value === "") {
      if (options.required) {
        return this.error(messages.missing ?? messages.invalid);
      }

      return this.success(undefined);
    }

    const numeric = this.normalizeInteger(value);
    if (numeric === null) {
      return this.error(messages.invalid);
    }

    return this.success(numeric);
  }

  protected coerceBoolean(value: unknown, fallback = false): boolean {
    if (typeof value === "boolean") {
      return value;
    }

    if (typeof value === "number") {
      return value !== 0;
    }

    if (typeof value === "string") {
      const normalized = value.trim().toLowerCase();
      if (["true", "1", "yes", "sim"].includes(normalized)) {
        return true;
      }
      if (["false", "0", "no", "não", "nao"].includes(normalized)) {
        return false;
      }
    }

    return fallback;
  }
}

export { BaseRequestDto };
