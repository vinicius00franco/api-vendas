import { type Request } from "express";
import { validationError, validationSuccess, type ValidationResult } from "../../shared/dto/validation.js";
import { type CreateProductInput, type UpdateProductInput } from "./ProductService.js";

type ProductBody = Record<string, unknown>;

type ProductParams = {
  id?: string;
};

class ProductRequestDto {
  private constructor(private readonly body: ProductBody, private readonly params: ProductParams) {}

  static fromRequest(request: Request): ProductRequestDto {
    const body: ProductBody = typeof request.body === "object" && request.body !== null ? request.body : {};
    return new ProductRequestDto(body, request.params ?? {});
  }

  getId(): ValidationResult<number> {
    const rawId = this.params.id;
    if (!rawId) {
      return validationError("Identificador do produto não informado");
    }

    const parsedId = Number(rawId);
    if (!Number.isInteger(parsedId) || parsedId <= 0) {
      return validationError("Identificador do produto inválido");
    }

    return validationSuccess(parsedId);
  }

  toCreateInput(): ValidationResult<CreateProductInput> {
    const name = this.parseString(this.body.name ?? this.body.Name);
    if (!name) {
      return validationError("Nome do produto é obrigatório");
    }

    const ean = this.parseString(this.body.ean ?? this.body.EAN);
    if (!ean) {
      return validationError("EAN do produto é obrigatório");
    }

    const priceResult = this.parseNumber(this.body.price);
    if (!priceResult.success) {
      return priceResult;
    }
    if (priceResult.data === undefined) {
      return validationError("Preço do produto é obrigatório");
    }

    const categoryResult = this.parseInteger(this.body.categoryId ?? this.body.category_id);
    if (!categoryResult.success) {
      return categoryResult;
    }
    if (categoryResult.data === undefined) {
      return validationError("Categoria do produto é obrigatória");
    }

    const description = this.parseOptionalString(this.body.description);

    const createInput: CreateProductInput = {
      name,
      ean,
      price: priceResult.data,
      categoryId: categoryResult.data,
    };

    if (description !== undefined) {
      createInput.description = description;
    }

    return validationSuccess(createInput);
  }

  toUpdateInput(): ValidationResult<UpdateProductInput> {
    const update: UpdateProductInput = {};

    if (this.hasField("name")) {
      const name = this.parseString(this.body.name);
      if (!name) {
        return validationError("Nome do produto inválido");
      }
      update.name = name;
    }

    if (this.hasField("ean") || this.hasField("EAN")) {
      const ean = this.parseString(this.body.ean ?? this.body.EAN);
      if (!ean) {
        return validationError("EAN do produto inválido");
      }
      update.ean = ean;
    }

    if (this.hasField("price")) {
      const priceResult = this.parseNumber(this.body.price);
      if (!priceResult.success) {
        return priceResult;
      }
      if (priceResult.data === undefined) {
        return validationError("Preço do produto inválido");
      }
      update.price = priceResult.data;
    }

    if (this.hasField("description")) {
      const description = this.parseOptionalString(this.body.description);
      if (description !== undefined) {
        update.description = description;
      }
    }

    if (this.hasField("categoryId") || this.hasField("category_id")) {
      const categoryResult = this.parseInteger(this.body.categoryId ?? this.body.category_id);
      if (!categoryResult.success) {
        return categoryResult;
      }
      if (categoryResult.data === undefined) {
        return validationError("Categoria do produto inválida");
      }
      update.categoryId = categoryResult.data;
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

  private parseOptionalString(value: unknown): string | undefined {
    if (value === undefined || value === null) {
      return undefined;
    }

    const parsed = this.parseString(value);
    return parsed ?? undefined;
  }

  private parseNumber(value: unknown): ValidationResult<number | undefined> {
    if (value === undefined || value === null || value === "") {
      return validationSuccess(undefined);
    }

    if (typeof value === "number" && Number.isFinite(value)) {
      return validationSuccess(value);
    }

    if (typeof value === "string") {
      const numeric = Number(value);
      if (!Number.isNaN(numeric)) {
        return validationSuccess(numeric);
      }
    }

    return validationError("Valor numérico inválido");
  }

  private parseInteger(value: unknown): ValidationResult<number | undefined> {
    if (value === undefined || value === null || value === "") {
      return validationSuccess(undefined);
    }

    if (typeof value === "number" && Number.isInteger(value)) {
      return validationSuccess(value);
    }

    if (typeof value === "string") {
      const numeric = Number(value);
      if (Number.isInteger(numeric)) {
        return validationSuccess(numeric);
      }
    }

    return validationError("Identificador inválido");
  }

  private hasField(field: string): boolean {
    return Object.prototype.hasOwnProperty.call(this.body, field);
  }
}

export { ProductRequestDto };
