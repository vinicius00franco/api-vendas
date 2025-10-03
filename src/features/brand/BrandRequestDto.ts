import { type Request } from "express";
import { BaseRequestDto, type RequestBody, type RequestParams } from "../../shared/dto/BaseRequestDto.js";
import { type ValidationResult } from "../../shared/dto/validation.js";
import { type CreateBrandInput, type UpdateBrandInput } from "./BrandService.js";

class BrandRequestDto extends BaseRequestDto {
  private constructor(body: RequestBody, params: RequestParams) {
    super(body, params);
  }

  static fromRequest(request: Request): BrandRequestDto {
    const body = this.extractBody(request);
    const params = this.extractParams(request);
    return new BrandRequestDto(body, params);
  }

  getId(): ValidationResult<number> {
    return this.requireIdParam("id", {
      missing: "Identificador da marca não informado",
      invalid: "Identificador da marca inválido",
    });
  }

  getUuid(): ValidationResult<string> {
    const raw = this.getParam("id");
    if (!raw) return this.error("Identificador da marca não informado");
    if (typeof raw !== 'string' || raw.trim() === '') return this.error("Identificador da marca inválido");
    return this.success(raw);
  }

  toCreateInput(): ValidationResult<CreateBrandInput> {
    const nameResult = this.requireString(this.firstValue("name"), "Nome da marca é obrigatório");
    if (!nameResult.success) return nameResult;

    const description = this.optionalString(this.firstValue("description"));

    const createInput: CreateBrandInput = {
      name: nameResult.data,
    };

    if (description) {
      createInput.description = description;
    }

    return this.success(createInput);
  }

  toUpdateInput(): ValidationResult<UpdateBrandInput> {
    const update: UpdateBrandInput = {};

    if (this.hasAnyField("name")) {
      const nameResult = this.validateStringIfPresent(this.firstValue("name"), {
        invalid: "Nome da marca inválido",
      });
      if (!nameResult.success) {
        return nameResult;
      }
      if (nameResult.data !== undefined) {
        update.name = nameResult.data;
      }
    }

    if (this.hasAnyField("description")) {
      const description = this.optionalString(this.firstValue("description"));
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

export { BrandRequestDto };