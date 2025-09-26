import { type Request } from "express";
import { validationError, validationSuccess, type ValidationResult } from "../../shared/dto/validation.js";
import { type CreateUserInput, type UpdateUserInput } from "./UserService.js";

type UserBody = Record<string, unknown>;

type UserParams = {
  id?: string;
};

class UserRequestDto {
  private constructor(private readonly body: UserBody, private readonly params: UserParams) {}

  static fromRequest(request: Request): UserRequestDto {
    const body: UserBody = typeof request.body === "object" && request.body !== null ? request.body : {};
    return new UserRequestDto(body, request.params ?? {});
  }

  getId(): ValidationResult<number> {
    const rawId = this.params.id;
    if (!rawId) {
      return validationError("Identificador do usuário não informado");
    }

    const parsedId = Number(rawId);
    if (!Number.isInteger(parsedId) || parsedId <= 0) {
      return validationError("Identificador do usuário inválido");
    }

    return validationSuccess(parsedId);
  }

  toCreateInput(): ValidationResult<CreateUserInput> {
    const name = this.parseString(this.body.name);
    if (!name) {
      return validationError("Nome do usuário é obrigatório");
    }

    const email = this.parseString(this.body.email);
    if (!email) {
      return validationError("E-mail do usuário é obrigatório");
    }

    const password = this.parseString(this.body.password);
    if (!password) {
      return validationError("Senha do usuário é obrigatória");
    }

    const isAdmin = this.parseBoolean(this.body.admin ?? this.body.isAdmin ?? this.body.role);

    return validationSuccess({
      name,
      email,
      password,
      isAdmin,
    });
  }

  toUpdateInput(): ValidationResult<UpdateUserInput> {
    const update: UpdateUserInput = {};

    if (this.hasField("name")) {
      const name = this.parseString(this.body.name);
      if (!name) {
        return validationError("Nome do usuário inválido");
      }
      update.name = name;
    }

    if (this.hasField("email")) {
      const email = this.parseString(this.body.email);
      if (!email) {
        return validationError("E-mail do usuário inválido");
      }
      update.email = email;
    }

    if (this.hasField("password")) {
      const password = this.parseString(this.body.password);
      if (!password) {
        return validationError("Senha do usuário inválida");
      }
      update.password = password;
    }

    if (this.hasField("admin") || this.hasField("isAdmin") || this.hasField("role")) {
      update.isAdmin = this.parseBoolean(
        this.body.admin ?? this.body.isAdmin ?? this.body.role
      );
    }

    if (Object.keys(update).length === 0) {
      return validationError("Nenhum dado informado para atualização");
    }

    return validationSuccess(update);
  }

  private parseString(value: unknown): string | null {
    if (typeof value === "string") {
      const trimmed = value.trim();
      return trimmed.length > 0 ? trimmed : null;
    }

    return null;
  }

  private parseBoolean(value: unknown): boolean {
    if (typeof value === "boolean") {
      return value;
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

    if (typeof value === "number") {
      return value !== 0;
    }

    return false;
  }

  private hasField(field: string): boolean {
    return Object.prototype.hasOwnProperty.call(this.body, field);
  }
}

export { UserRequestDto };
