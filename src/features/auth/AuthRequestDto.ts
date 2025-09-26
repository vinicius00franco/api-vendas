import { type Request } from "express";
import { validationError, validationSuccess, type ValidationResult } from "../../shared/dto/validation.js";
import { type LoginInput } from "./AuthService.js";

type AuthBody = Record<string, unknown>;

class AuthRequestDto {
  private constructor(private readonly body: AuthBody) {}

  static fromRequest(request: Request): AuthRequestDto {
    const body: AuthBody = typeof request.body === "object" && request.body !== null ? request.body : {};
    return new AuthRequestDto(body);
  }

  toLoginInput(): ValidationResult<LoginInput> {
    const email = this.parseString(this.body.email);
    if (!email) {
      return validationError("E-mail é obrigatório");
    }

    const password = this.parseString(this.body.password);
    if (!password) {
      return validationError("Senha é obrigatória");
    }

    return validationSuccess({
      email,
      password,
    });
  }

  private parseString(value: unknown): string | null {
    if (typeof value === "string") {
      const trimmed = value.trim();
      if (trimmed.length > 0) {
        return trimmed;
      }
    }

    return null;
  }
}

export { AuthRequestDto };
