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

    const productIdResult = this.validateInteger(
      this.firstValue("productId", "product_id"),
      {
        invalid: "Identificador inválido",
        missing: "Produto da venda é obrigatório",
      },
      { required: true }
    );
    if (!productIdResult.success) {
      return productIdResult;
    }

    const clientIdResult = this.validateInteger(
      this.firstValue("clientId", "client_id"),
      {
        invalid: "Identificador inválido",
        missing: "Cliente da venda é obrigatório",
      },
      { required: true }
    );
    if (!clientIdResult.success) {
      return clientIdResult;
    }

    const discountResult = this.validateNumber(this.firstValue("discount"), {
      invalid: "Valor numérico inválido",
    });
    if (!discountResult.success) {
      return discountResult;
    }

    const createInput: CreateSaleInput = {
      value: valueResult.data!,
      productId: productIdResult.data!,
      clientId: clientIdResult.data!,
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

    if (this.hasAnyField("productId", "product_id")) {
      const productIdResult = this.validateInteger(this.firstValue("productId", "product_id"), {
        invalid: "Identificador inválido",
      });
      if (!productIdResult.success) {
        return productIdResult;
      }
      if (productIdResult.data === undefined) {
        return this.error("Produto inválido");
      }
      update.productId = productIdResult.data;
    }

    if (this.hasAnyField("clientId", "client_id")) {
      const clientIdResult = this.validateInteger(this.firstValue("clientId", "client_id"), {
        invalid: "Identificador inválido",
      });
      if (!clientIdResult.success) {
        return clientIdResult;
      }
      if (clientIdResult.data === undefined) {
        return this.error("Cliente inválido");
      }
      update.clientId = clientIdResult.data;
    }

    if (Object.keys(update).length === 0) {
      return this.error("Nenhum dado informado para atualização");
    }

    return this.success(update);
  }
}

export { SalesRequestDto };
