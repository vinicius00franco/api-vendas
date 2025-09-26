import { type Request } from "express";
import { validationError, validationSuccess, type ValidationResult } from "../../shared/dto/validation.js";
import { type ClientAddressInput, type CreateClientInput, type UpdateClientInput } from "./ClientService.js";
import { type ClientAddress } from "./Client.js";

type ClientBody = Record<string, unknown>;

type ClientParams = {
  id?: string;
};

type AddressSource = Record<string, unknown> | undefined;

type AddressValidationResult = ValidationResult<ClientAddressInput>;

type AddressUpdateValidationResult = ValidationResult<Partial<ClientAddress> | undefined>;

class ClientRequestDto {
  private constructor(private readonly body: ClientBody, private readonly params: ClientParams) {}

  static fromRequest(request: Request): ClientRequestDto {
    const body: ClientBody = typeof request.body === "object" && request.body !== null ? request.body : {};
    return new ClientRequestDto(body, request.params ?? {});
  }

  getId(): ValidationResult<number> {
    const rawId = this.params.id;
    if (!rawId) {
      return validationError("Identificador do cliente não informado");
    }

    const parsedId = Number(rawId);
    if (!Number.isInteger(parsedId) || parsedId <= 0) {
      return validationError("Identificador do cliente inválido");
    }

    return validationSuccess(parsedId);
  }

  toCreateInput(): ValidationResult<CreateClientInput> {
    const name = this.parseRequiredString(this.body.name, "Nome do cliente é obrigatório");
    if (!name.success) {
      return name;
    }

    const documentValue = this.parseRequiredString(
      this.body.document ?? this.body.cpf,
      "Documento do cliente é obrigatório"
    );
    if (!documentValue.success) {
      return documentValue;
    }

    const email = this.parseRequiredString(this.body.email, "E-mail do cliente é obrigatório");
    if (!email.success) {
      return email;
    }

    const phone = this.parseOptionalString(this.body.phone ?? this.body.telephone ?? this.body.tel);

    const addressResult = this.parseAddressForCreate();
    if (!addressResult.success) {
      return addressResult;
    }

    const createInput: CreateClientInput = {
      name: name.data,
      document: documentValue.data,
      email: email.data,
      address: addressResult.data,
    };

    if (phone !== undefined) {
      createInput.phone = phone;
    }

    return validationSuccess(createInput);
  }

  toUpdateInput(): ValidationResult<UpdateClientInput> {
    const update: UpdateClientInput = {};

    if (this.hasField("name")) {
      const name = this.parseRequiredString(this.body.name, "Nome do cliente inválido");
      if (!name.success) {
        return name;
      }
      update.name = name.data;
    }

    if (this.hasField("document") || this.hasField("cpf")) {
      const documentValue = this.parseRequiredString(
        this.body.document ?? this.body.cpf,
        "Documento do cliente inválido"
      );
      if (!documentValue.success) {
        return documentValue;
      }
      update.document = documentValue.data;
    }

    if (this.hasField("email")) {
      const email = this.parseRequiredString(this.body.email, "E-mail do cliente inválido");
      if (!email.success) {
        return email;
      }
      update.email = email.data;
    }

    if (this.hasField("phone") || this.hasField("telephone") || this.hasField("tel")) {
      const phone = this.parseOptionalString(this.body.phone ?? this.body.telephone ?? this.body.tel);
      if (phone !== undefined) {
        update.phone = phone;
      }
    }

    const addressResult = this.parseAddressForUpdate();
    if (!addressResult.success) {
      return addressResult;
    }
    if (addressResult.data) {
      update.address = addressResult.data;
    }

    if (Object.keys(update).length === 0) {
      return validationError("Nenhum dado informado para atualização");
    }

    return validationSuccess(update);
  }

  private parseAddressForCreate(): AddressValidationResult {
    const nestedAddress = this.getNestedAddress();
    const street = this.parseRequiredString(
      nestedAddress?.street ??
        this.body.street ??
        this.body.adress ??
        (typeof this.body.address === "string" ? this.body.address : undefined),
      "Logradouro do cliente é obrigatório"
    );
    if (!street.success) {
      return street;
    }

    const city = this.parseRequiredString(
      nestedAddress?.city ?? this.body.city,
      "Cidade do cliente é obrigatória"
    );
    if (!city.success) {
      return city;
    }

    const postalCode = this.parseRequiredString(
      nestedAddress?.postalCode ??
        nestedAddress?.zipCode ??
        nestedAddress?.postal_code ??
        this.body.postalCode ??
        this.body.postal_code ??
        this.body.zipCode ??
        this.body.zipcode,
      "Código postal do cliente é obrigatório"
    );
    if (!postalCode.success) {
      return postalCode;
    }

    const state = this.parseOptionalString(nestedAddress?.state ?? this.body.state);
    const countryRaw =
      nestedAddress?.country ?? this.body.country ?? (state !== undefined ? "BR" : undefined);
    const country = this.parseRequiredString(countryRaw, "País do cliente é obrigatório");
    if (!country.success) {
      return country;
    }

    const number = this.parseOptionalString(nestedAddress?.number ?? this.body.number);
    const complement = this.parseOptionalString(nestedAddress?.complement ?? this.body.complement);
    const district = this.parseOptionalString(nestedAddress?.district ?? this.body.district);
    const region = this.parseOptionalString(nestedAddress?.region ?? this.body.region);
    const parsedState = this.parseOptionalString(state);

    const address: ClientAddressInput = {
      street: street.data,
      city: city.data,
      postalCode: postalCode.data,
      country: country.data,
    };

    if (number !== undefined) address.number = number;
    if (complement !== undefined) address.complement = complement;
    if (district !== undefined) address.district = district;
    if (region !== undefined) address.region = region;
    if (parsedState !== undefined) address.state = parsedState;

    return validationSuccess(address);
  }

  private parseAddressForUpdate(): AddressUpdateValidationResult {
    const nestedAddress = this.getNestedAddress();
    const hasAddressChange =
      nestedAddress !== undefined ||
      this.hasAddressField("street") ||
      this.hasAddressField("adress") ||
      this.hasAddressField("number") ||
      this.hasAddressField("complement") ||
      this.hasAddressField("district") ||
      this.hasAddressField("city") ||
      this.hasAddressField("region") ||
      this.hasAddressField("state") ||
      this.hasAddressField("postalCode") ||
      this.hasAddressField("postal_code") ||
      this.hasAddressField("zipCode") ||
      this.hasAddressField("zipcode") ||
      this.hasAddressField("country");

    if (!hasAddressChange) {
      return validationSuccess(undefined);
    }

    const updates: Partial<ClientAddress> = {};

    const street = this.parseOptionalString(
      nestedAddress?.street ??
        this.body.street ??
        this.body.adress ??
        (typeof this.body.address === "string" ? this.body.address : undefined)
    );
    if (street !== undefined) {
      if (street === null || street.trim().length === 0) {
        return validationError("Logradouro do cliente inválido");
      }
      updates.street = street;
    }

    const number = this.parseOptionalString(nestedAddress?.number ?? this.body.number);
    if (number !== undefined) {
      if (number === null || number.trim().length === 0) {
        return validationError("Número do endereço inválido");
      }
      updates.number = number;
    }

    const complement = this.parseOptionalString(nestedAddress?.complement ?? this.body.complement);
    if (complement !== undefined) {
      updates.complement = complement ?? undefined;
    }

    const district = this.parseOptionalString(nestedAddress?.district ?? this.body.district);
    if (district !== undefined) {
      if (district === null || district.trim().length === 0) {
        return validationError("Bairro do endereço inválido");
      }
      updates.district = district;
    }

    const city = this.parseOptionalString(nestedAddress?.city ?? this.body.city);
    if (city !== undefined) {
      if (city === null || city.trim().length === 0) {
        return validationError("Cidade do cliente inválida");
      }
      updates.city = city;
    }

    const region = this.parseOptionalString(nestedAddress?.region ?? this.body.region);
    if (region !== undefined) {
      updates.region = region ?? undefined;
    }

    const state = this.parseOptionalString(nestedAddress?.state ?? this.body.state);
    if (state !== undefined) {
      if (state === null || state.trim().length === 0) {
        return validationError("Estado do cliente inválido");
      }
      updates.state = state;
    }

    const postalCode = this.parseOptionalString(
      nestedAddress?.postalCode ??
        nestedAddress?.zipCode ??
        nestedAddress?.postal_code ??
        this.body.postalCode ??
        this.body.postal_code ??
        this.body.zipCode ??
        this.body.zipcode
    );
    if (postalCode !== undefined) {
      if (postalCode === null || postalCode.trim().length === 0) {
        return validationError("Código postal do cliente inválido");
      }
      updates.postalCode = postalCode;
    }

    const country = this.parseOptionalString(nestedAddress?.country ?? this.body.country);
    if (country !== undefined) {
      if (country === null || country.trim().length === 0) {
        return validationError("País do cliente inválido");
      }
      updates.country = country;
    }

    if (Object.keys(updates).length === 0) {
      return validationSuccess(undefined);
    }

    return validationSuccess(updates);
  }

  private parseRequiredString(value: unknown, message: string): ValidationResult<string> {
    const parsed = this.parseBasicString(value);
    if (!parsed) {
      return validationError(message);
    }
    return validationSuccess(parsed);
  }

  private parseOptionalString(value: unknown): string | undefined {
    if (value === undefined) {
      return undefined;
    }

    if (value === null) {
      return undefined;
    }

    const parsed = this.parseBasicString(value);
    return parsed ?? undefined;
  }

  private parseBasicString(value: unknown): string | null {
    if (typeof value === "string") {
      const trimmed = value.trim();
      return trimmed.length > 0 ? trimmed : null;
    }

    return null;
  }

  private getNestedAddress(): AddressSource {
    if (typeof this.body.address === "object" && this.body.address !== null) {
      return this.body.address as Record<string, unknown>;
    }

    if (typeof this.body.adress === "object" && this.body.adress !== null) {
      return this.body.adress as Record<string, unknown>;
    }

    return undefined;
  }

  private hasField(field: string): boolean {
    return Object.prototype.hasOwnProperty.call(this.body, field);
  }

  private hasAddressField(field: string): boolean {
    const nested = this.getNestedAddress();
    if (nested && Object.prototype.hasOwnProperty.call(nested, field)) {
      return true;
    }

    return this.hasField(field);
  }
}

export { ClientRequestDto };
