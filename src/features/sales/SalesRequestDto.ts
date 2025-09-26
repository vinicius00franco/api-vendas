import { type Request } from "express";
import { validationError, validationSuccess, type ValidationResult } from "../../shared/dto/validation.js";
import { type CreateSaleInput, type UpdateSaleInput } from "./SalesService.js";

type SalesBody = Record<string, unknown>;

type SalesParams = {
  id?: string;
};

class SalesRequestDto {
  private constructor(private readonly body: SalesBody, private readonly params: SalesParams) {}

  static fromRequest(request: Request): SalesRequestDto {
    const body: SalesBody = typeof request.body === "object" && request.body !== null ? request.body : {};
    return new SalesRequestDto(body, request.params ?? {});
  }

  getId(): ValidationResult<number> {
    const rawId = this.params.id;
    if (!rawId) {
      return validationError("Identificador da venda não informado");
    }

    const parsedId = Number(rawId);
    if (!Number.isInteger(parsedId) || parsedId <= 0) {
      return validationError("Identificador da venda inválido");
    }

    return validationSuccess(parsedId);
  }

  toCreateInput(): ValidationResult<CreateSaleInput> {
    const valueResult = this.parseNumber(this.body.value);
    if (!valueResult.success) {
      return valueResult;
    }
    if (valueResult.data === undefined) {
      return validationError("Valor da venda é obrigatório");
    }

    const productIdResult = this.parseInteger(this.body.productId ?? this.body.product_id);
    if (!productIdResult.success) {
      return productIdResult;
    }
    if (productIdResult.data === undefined) {
      return validationError("Produto da venda é obrigatório");
    }

    const clientIdResult = this.parseInteger(this.body.clientId ?? this.body.client_id);
    if (!clientIdResult.success) {
      return clientIdResult;
    }
    if (clientIdResult.data === undefined) {
      return validationError("Cliente da venda é obrigatório");
    }

    const discountResult = this.parseNumber(this.body.discount);
    if (!discountResult.success) {
      return discountResult;
    }

    const createInput: CreateSaleInput = {
      value: valueResult.data,
      productId: productIdResult.data,
      clientId: clientIdResult.data,
    };

    if (discountResult.data !== undefined) {
      createInput.discount = discountResult.data;
    }

    return validationSuccess(createInput);
  }

  toUpdateInput(): ValidationResult<UpdateSaleInput> {
    const update: UpdateSaleInput = {};

    if (this.hasField("value")) {
      const valueResult = this.parseNumber(this.body.value);
      if (!valueResult.success) {
        return valueResult;
      }
      if (valueResult.data === undefined) {
        return validationError("Valor da venda inválido");
      }
      update.value = valueResult.data;
    }

    if (this.hasField("discount")) {
      const discountResult = this.parseNumber(this.body.discount);
      if (!discountResult.success) {
        return discountResult;
      }
      if (discountResult.data === undefined) {
        return validationError("Desconto inválido");
      }
      update.discount = discountResult.data;
    }

    if (this.hasField("productId") || this.hasField("product_id")) {
      const productIdResult = this.parseInteger(this.body.productId ?? this.body.product_id);
      if (!productIdResult.success) {
        return productIdResult;
      }
      if (productIdResult.data === undefined) {
        return validationError("Produto inválido");
      }
      update.productId = productIdResult.data;
    }

    if (this.hasField("clientId") || this.hasField("client_id")) {
      const clientIdResult = this.parseInteger(this.body.clientId ?? this.body.client_id);
      if (!clientIdResult.success) {
        return clientIdResult;
      }
      if (clientIdResult.data === undefined) {
        return validationError("Cliente inválido");
      }
      update.clientId = clientIdResult.data;
    }

    if (Object.keys(update).length === 0) {
      return validationError("Nenhum dado informado para atualização");
    }

    return validationSuccess(update);
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

export { SalesRequestDto };
