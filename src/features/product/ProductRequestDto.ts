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

  getUuid(): ValidationResult<string> {
    const raw = this.getParam("id");
    if (!raw) return this.error("Identificador do produto não informado");
    if (typeof raw !== 'string' || raw.trim() === '') return this.error("Identificador do produto inválido");
    return this.success(raw);
  }

  toCreateInput(): ValidationResult<CreateProductInput> {
    const nameResult = this.requireString(this.firstValue("name", "Name"), "Nome do produto é obrigatório");
    if (!nameResult.success) return nameResult;

    const categoryResult = this.validateInteger(this.firstValue("categoryId", "category_id"), {
      invalid: "Identificador inválido",
      missing: "Categoria do produto é obrigatória",
    }, { required: true });
    if (!categoryResult.success) return categoryResult;

    const brandUuid = this.optionalString(this.firstValue("brandUuid", "brand_uuid"));
    if (!brandUuid) {
      return this.error("Marca do produto é obrigatória");
    }

    const priceResult = this.validateNumber(this.firstValue("price", "variant.price"), {
      invalid: "Valor numérico inválido",
      missing: "Preço do produto é obrigatório",
    }, { required: true });
    if (!priceResult.success) return priceResult;

  const ean = this.optionalString(this.firstValue("ean", "variant.ean", "EAN"));
  const sku = this.optionalString(this.firstValue("sku", "variant.sku", "SKU"));
    const stock = this.validateInteger(this.firstValue("stockQuantity", "variant.stockQuantity"), {
      invalid: "Quantidade em estoque inválida",
    });
    if (!stock.success) return stock;

  const description = this.optionalString(this.firstValue("description"));

    const createInput: CreateProductInput = {
      name: nameResult.data,
  description: description ?? null,
      categoryId: categoryResult.data!,
      brandUuid: brandUuid,
      variant: {
        price: priceResult.data!,
        ean: ean ?? null,
        sku: sku ?? null,
        stockQuantity: stock.data ?? 0,
      },
    };

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

    // SKU/EAN/price now belong to variant. Allow passing brandId as well.

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

    if (this.hasAnyField("brandUuid", "brand_uuid")) {
      const brandUuid = this.optionalString(this.firstValue("brandUuid", "brand_uuid"));
      if (!brandUuid || brandUuid.trim() === '') {
        return this.error("Marca do produto inválida");
      }
      (update as any).brandUuid = brandUuid;
    }

    if (Object.keys(update).length === 0) {
      return this.error("Nenhum dado informado para atualização");
    }

    return this.success(update);
  }
}

export { ProductRequestDto };
