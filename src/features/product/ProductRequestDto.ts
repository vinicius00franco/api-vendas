import { type Request } from "express";
import { BaseRequestDto, type RequestBody, type RequestParams } from "../../shared/dto/BaseRequestDto.js";
import { type ValidationResult } from "../../shared/dto/validation.js";
import { type CreateProductInput, type UpdateProductInput } from "./ProductService.js";

class ProductRequestDto extends BaseRequestDto {
  private constructor(body: RequestBody, params: RequestParams) {
    super(body, params);
  }

  static fromRequest(request: Request): ProductRequestDto {
    const body = this.extractBody(request);
    const params = this.extractParams(request);
    return new ProductRequestDto(body, params);
  }

  getId(): ValidationResult<number> {
    return this.requireIdParam("id", {
      missing: "Identificador do produto não informado",
      invalid: "Identificador do produto inválido",
    });
  }

  toCreateInput(): ValidationResult<CreateProductInput> {
    const nameResult = this.requireString(this.firstValue("name", "Name"), "Nome do produto é obrigatório");
    if (!nameResult.success) {
      return nameResult;
    }

    const eanResult = this.requireString(this.firstValue("ean", "EAN"), "EAN do produto é obrigatório");
    if (!eanResult.success) {
      return eanResult;
    }

    const priceResult = this.validateNumber(
      this.firstValue("price"),
      {
        invalid: "Valor numérico inválido",
        missing: "Preço do produto é obrigatório",
      },
      { required: true }
    );
    if (!priceResult.success) {
      return priceResult;
    }

    const categoryResult = this.validateInteger(
      this.firstValue("categoryId", "category_id"),
      {
        invalid: "Identificador inválido",
        missing: "Categoria do produto é obrigatória",
      },
      { required: true }
    );
    if (!categoryResult.success) {
      return categoryResult;
    }

    const description = this.optionalString(this.firstValue("description"));

    const createInput: CreateProductInput = {
      name: nameResult.data,
      ean: eanResult.data,
      price: priceResult.data!,
      categoryId: categoryResult.data!,
    };

    if (description !== undefined) {
      createInput.description = description;
    }

    return this.success(createInput);
  }

  toUpdateInput(): ValidationResult<UpdateProductInput> {
    const update: UpdateProductInput = {};

    if (this.hasAnyField("name", "Name")) {
      const nameResult = this.validateStringIfPresent(this.firstValue("name", "Name"), {
        invalid: "Nome do produto inválido",
      });
      if (!nameResult.success) {
        return nameResult;
      }
      if (nameResult.data !== undefined) {
        update.name = nameResult.data;
      }
    }

    if (this.hasAnyField("ean", "EAN")) {
      const eanResult = this.validateStringIfPresent(this.firstValue("ean", "EAN"), {
        invalid: "EAN do produto inválido",
      });
      if (!eanResult.success) {
        return eanResult;
      }
      if (eanResult.data !== undefined) {
        update.ean = eanResult.data;
      }
    }

    if (this.hasAnyField("price")) {
      const priceResult = this.validateNumber(
        this.firstValue("price"),
        {
          invalid: "Valor numérico inválido",
        }
      );
      if (!priceResult.success) {
        return priceResult;
      }
      if (priceResult.data === undefined) {
        return this.error("Preço do produto inválido");
      }
      update.price = priceResult.data;
    }

    if (this.hasAnyField("description")) {
      const description = this.optionalString(this.firstValue("description"));
      if (description !== undefined) {
        update.description = description;
      }
    }

    if (this.hasAnyField("categoryId", "category_id")) {
      const categoryResult = this.validateInteger(
        this.firstValue("categoryId", "category_id"),
        {
          invalid: "Identificador inválido",
        }
      );
      if (!categoryResult.success) {
        return categoryResult;
      }
      if (categoryResult.data === undefined) {
        return this.error("Categoria do produto inválida");
      }
      update.categoryId = categoryResult.data;
    }

    if (Object.keys(update).length === 0) {
      return this.error("Nenhum dado informado para atualização");
    }

    return this.success(update);
  }
}

export { ProductRequestDto };
