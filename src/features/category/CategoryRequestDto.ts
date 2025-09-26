import { type Request } from "express";
import { BaseRequestDto, type RequestBody, type RequestParams } from "../../shared/dto/BaseRequestDto.js";
import { type ValidationResult } from "../../shared/dto/validation.js";
import { type CreateCategoryInput, type UpdateCategoryInput } from "./CategoryService.js";

class CategoryRequestDto extends BaseRequestDto {
  private constructor(body: RequestBody, params: RequestParams) {
    super(body, params);
  }

  static fromRequest(request: Request): CategoryRequestDto {
    const body = this.extractBody(request);
    const params = this.extractParams(request);
    return new CategoryRequestDto(body, params);
  }

  getId(): ValidationResult<number> {
    return this.requireIdParam("id", {
      missing: "Identificador da categoria não informado",
      invalid: "Identificador da categoria inválido",
    });
  }

  toCreateInput(): ValidationResult<CreateCategoryInput> {
    const nameResult = this.requireString(this.firstValue("name"), "Nome da categoria é obrigatório");
    if (!nameResult.success) {
      return nameResult;
    }

    const description = this.optionalNullableString(this.firstValue("description"));

    const createInput: CreateCategoryInput = {
      name: nameResult.data,
    };

    if (description !== undefined) {
      createInput.description = description;
    }

    return this.success(createInput);
  }

  toUpdateInput(): ValidationResult<UpdateCategoryInput> {
    const update: UpdateCategoryInput = {};

    if (this.hasAnyField("name")) {
      const nameResult = this.validateStringIfPresent(this.firstValue("name"), {
        invalid: "Nome da categoria inválido",
      });
      if (!nameResult.success) {
        return nameResult;
      }
      if (nameResult.data !== undefined) {
        update.name = nameResult.data;
      }
    }

    if (this.hasAnyField("description")) {
      const description = this.optionalNullableString(this.firstValue("description"));
      if (description !== undefined) {
        update.description = description;
      }
    }

    if (Object.keys(update).length === 0) {
      return this.error("Nenhum dado informado para atualização");
    }

    return this.success(update);
  }
}

export { CategoryRequestDto };
