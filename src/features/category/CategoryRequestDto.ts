import { type Request } from "express";
import { validationError, validationSuccess, type ValidationResult } from "../../shared/dto/validation.js";
import { type CreateCategoryInput, type UpdateCategoryInput } from "./CategoryService.js";

type CategoryBody = Record<string, unknown>;

type CategoryParams = {
  id?: string;
};

class CategoryRequestDto {
  private constructor(private readonly body: CategoryBody, private readonly params: CategoryParams) {}

  static fromRequest(request: Request): CategoryRequestDto {
    const body: CategoryBody = typeof request.body === "object" && request.body !== null ? request.body : {};
    return new CategoryRequestDto(body, request.params ?? {});
  }

  getId(): ValidationResult<number> {
    const rawId = this.params.id;
    if (!rawId) {
      return validationError("Identificador da categoria não informado");
    }

    const parsedId = Number(rawId);
    if (!Number.isInteger(parsedId) || parsedId <= 0) {
      return validationError("Identificador da categoria inválido");
    }

    return validationSuccess(parsedId);
  }

  toCreateInput(): ValidationResult<CreateCategoryInput> {
    const name = this.parseString(this.body.name);
    if (!name) {
      return validationError("Nome da categoria é obrigatório");
    }

    const description = this.parseNullableString(this.body.description);

    const createInput: CreateCategoryInput = {
      name,
    };

    if (description !== undefined) {
      createInput.description = description;
    }

    return validationSuccess(createInput);
  }

  toUpdateInput(): ValidationResult<UpdateCategoryInput> {
    const update: UpdateCategoryInput = {};

    if (this.hasField("name")) {
      const name = this.parseString(this.body.name);
      if (!name) {
        return validationError("Nome da categoria inválido");
      }
      update.name = name;
    }

    if (this.hasField("description")) {
      const description = this.parseNullableString(this.body.description);
      if (description !== undefined) {
        update.description = description;
      }
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

  private parseNullableString(value: unknown): string | null | undefined {
    if (value === undefined) {
      return undefined;
    }

    if (value === null) {
      return null;
    }

    const parsed = this.parseString(value);
    if (parsed === null) {
      return null;
    }

    return parsed;
  }

  private hasField(field: string): boolean {
    return Object.prototype.hasOwnProperty.call(this.body, field);
  }
}

export { CategoryRequestDto };
