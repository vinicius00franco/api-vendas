import { type Request } from "express";
import { BaseRequestDto, type RequestBody, type RequestParams } from "../../shared/dto/BaseRequestDto.js";
import { type ValidationResult } from "../../shared/dto/validation.js";
import { type CreateSaleInput, type UpdateSaleInput } from "./SalesService.js";

class SalesRequestDto extends BaseRequestDto {
  private constructor(body: RequestBody, params: RequestParams) {
    super(body, params);
  }

  static fromRequest(request: Request): SalesRequestDto {
    const body = this.extractBody(request);
    const params = this.extractParams(request);
    return new SalesRequestDto(body, params);
  }

  getId(): ValidationResult<number> {
    return this.requireIdParam("id", {
      missing: "Identificador da venda não informado",
      invalid: "Identificador da venda inválido",
    });
  }

  getUuid(): ValidationResult<string> {
    const raw = this.getParam("id");
    if (!raw) return this.error("Identificador da venda não informado");
    if (typeof raw !== 'string' || raw.trim() === '') return this.error("Identificador da venda inválido");
    return this.success(raw);
  }

  toCreateInput(): ValidationResult<CreateSaleInput> {
    const valueResult = this.validateNumber(
      this.firstValue("value"),
      {
        invalid: "Valor numérico inválido",
        missing: "Valor da venda é obrigatório",
      },
      { required: true }
    );
    if (!valueResult.success) {
      return valueResult;
    }

    const productUuidResult = this.requireString(this.firstValue("productUuid", "product_uuid"), "UUID do produto é obrigatório");
    if (!productUuidResult.success) {
      return productUuidResult;
    }

    const clientUuidResult = this.requireString(this.firstValue("clientUuid", "client_uuid"), "UUID do cliente é obrigatório");
    if (!clientUuidResult.success) {
      return clientUuidResult;
    }

    const discountResult = this.validateNumber(this.firstValue("discount"), {
      invalid: "Valor numérico inválido",
    });
    if (!discountResult.success) {
      return discountResult;
    }

    const createInput: CreateSaleInput = {
      value: valueResult.data!,
      productUuid: productUuidResult.data,
      clientUuid: clientUuidResult.data,
    };

    if (discountResult.data !== undefined) {
      createInput.discount = discountResult.data;
    }

    return this.success(createInput);
  }

  toUpdateInput(): ValidationResult<UpdateSaleInput> {
    const update: UpdateSaleInput = {};

    if (this.hasAnyField("value")) {
      const valueResult = this.validateNumber(this.firstValue("value"), {
        invalid: "Valor numérico inválido",
      });
      if (!valueResult.success) {
        return valueResult;
      }
      if (valueResult.data === undefined) {
        return this.error("Valor da venda inválido");
      }
      update.value = valueResult.data;
    }

    if (this.hasAnyField("discount")) {
      const discountResult = this.validateNumber(this.firstValue("discount"), {
        invalid: "Valor numérico inválido",
      });
      if (!discountResult.success) {
        return discountResult;
      }
      if (discountResult.data === undefined) {
        return this.error("Desconto inválido");
      }
      update.discount = discountResult.data;
    }

    if (this.hasAnyField("productUuid", "product_uuid")) {
      const productUuid = this.requireString(this.firstValue("productUuid", "product_uuid"), "UUID do produto inválido");
      if (!productUuid.success) {
        return productUuid;
      }
      (update as any).productUuid = productUuid.data;
    }

    if (this.hasAnyField("clientUuid", "client_uuid")) {
      const clientUuid = this.requireString(this.firstValue("clientUuid", "client_uuid"), "UUID do cliente inválido");
      if (!clientUuid.success) {
        return clientUuid;
      }
      (update as any).clientUuid = clientUuid.data;
    }

    if (Object.keys(update).length === 0) {
      return this.error("Nenhum dado informado para atualização");
    }

    return this.success(update);
  }
}

export { SalesRequestDto };
