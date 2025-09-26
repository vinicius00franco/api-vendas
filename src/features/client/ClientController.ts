import { Request, Response } from "express";
import {
  ClientService,
  type ClientAddressInput,
  type UpdateClientInput,
} from "./ClientService.js";

class ClientController {
  private readonly clientService = new ClientService();

  async create(request: Request, response: Response) {
    const { name, cpf, document, email, phone } = request.body;
    try {
      const documentValue = document ?? cpf;
      const address = this.buildAddressFromBody(request.body);

      if (!name || !documentValue || !email || !address) {
        return response.status(400).json({ message: "Dados do cliente inválidos" });
      }

      const client = await this.clientService.create({
        name,
        document: documentValue,
        email,
        phone: phone ?? undefined,
        address,
      });

      return response.status(201).json(client);
    } catch (error) {
      return response.status(400).json({ message: (error as Error).message });
    }
  }

  async update(request: Request, response: Response) {
    const { id } = request.params;
    try {
      const payload = this.buildUpdatePayload(request.body);

      if (Object.keys(payload).length === 0) {
        return response.status(400).json({ message: "Nenhum dado informado para atualização" });
      }

      const client = await this.clientService.update(Number(id), payload);
      return response.json(client);
    } catch (error) {
      return response.status(400).json({ message: (error as Error).message });
    }
  }

  async delete(request: Request, response: Response) {
    const { id } = request.params;
    try {
      await this.clientService.delete(Number(id));
      return response.status(204).send();
    } catch (error) {
      return response.status(404).json({ message: (error as Error).message });
    }
  }

  async patch(request: Request, response: Response) {
    const { id } = request.params;
    try {
      const payload = this.buildUpdatePayload(request.body);

      if (Object.keys(payload).length === 0) {
        return response.status(400).json({ message: "Nenhum dado informado para atualização" });
      }

      const client = await this.clientService.update(Number(id), payload);
      return response.json(client);
    } catch (error) {
      return response.status(400).json({ message: (error as Error).message });
    }
  }

  private buildAddressFromBody(body: any): ClientAddressInput | null {
    if (body.address && typeof body.address !== "object" && typeof body.address !== "string") {
      return null;
    }

    const nestedAddress = typeof body.address === "object" && body.address !== null ? body.address : undefined;

    const street =
      nestedAddress?.street ??
      (typeof body.address === "string" ? body.address : undefined) ??
      body.street ??
      body.adress;

    const number = nestedAddress?.number ?? body.number;
    const complement = nestedAddress?.complement ?? body.complement;
    const district = nestedAddress?.district ?? body.district;
    const city = nestedAddress?.city ?? body.city;
    const region = nestedAddress?.region ?? body.region;
    const state = nestedAddress?.state ?? body.state;
    const postalCode =
      nestedAddress?.postalCode ??
      nestedAddress?.zipCode ??
      nestedAddress?.postal_code ??
      body.postalCode ??
      body.postal_code ??
      body.zipCode ??
      body.zipcode;
    const country = nestedAddress?.country ?? body.country ?? (this.hasValue(state) ? "BR" : undefined);

    if (!this.hasValue(street) || !this.hasValue(city) || !this.hasValue(postalCode) || !this.hasValue(country)) {
      return null;
    }

    const address: ClientAddressInput = {
      street: String(street).trim(),
      city: String(city).trim(),
      postalCode: String(postalCode).trim(),
      country: String(country).trim(),
    };

    if (this.hasValue(number)) address.number = String(number).trim();
    if (this.hasValue(complement)) address.complement = String(complement).trim();
    if (this.hasValue(district)) address.district = String(district).trim();
    if (this.hasValue(region)) address.region = String(region).trim();
    if (this.hasValue(state)) address.state = String(state).trim();

    return address;
  }

  private buildUpdatePayload(body: any): UpdateClientInput {
    const payload: UpdateClientInput = {};

  if (body.name !== undefined) payload.name = body.name;
  if (body.document !== undefined || body.cpf !== undefined) payload.document = body.document ?? body.cpf;
  if (body.email !== undefined) payload.email = body.email;
  if (body.phone !== undefined) payload.phone = body.phone;

    const addressUpdate = this.buildAddressUpdate(body);
    if (addressUpdate) {
      payload.address = addressUpdate;
    }

    return payload;
  }

  private buildAddressUpdate(body: any): Partial<ClientAddressInput> | undefined {
    const nestedAddress = typeof body.address === "object" && body.address !== null ? body.address : undefined;
    const update: Partial<ClientAddressInput> = {};

    const street =
      nestedAddress?.street ??
      (typeof body.address === "string" ? body.address : undefined) ??
      body.street ??
      body.adress;
    if (street !== undefined && this.hasValue(street)) update.street = String(street).trim();

    const number = nestedAddress?.number ?? body.number;
    if (number !== undefined && this.hasValue(number)) update.number = String(number).trim();

    const complement = nestedAddress?.complement ?? body.complement;
    if (complement !== undefined && this.hasValue(complement)) update.complement = String(complement).trim();

    const district = nestedAddress?.district ?? body.district;
    if (district !== undefined && this.hasValue(district)) update.district = String(district).trim();

    const city = nestedAddress?.city ?? body.city;
    if (city !== undefined && this.hasValue(city)) update.city = String(city).trim();

    const region = nestedAddress?.region ?? body.region;
    if (region !== undefined && this.hasValue(region)) update.region = String(region).trim();

    const state = nestedAddress?.state ?? body.state;
    if (state !== undefined && this.hasValue(state)) update.state = String(state).trim();

    const postalCode =
      nestedAddress?.postalCode ??
      nestedAddress?.zipCode ??
      nestedAddress?.postal_code ??
      body.postalCode ??
      body.postal_code ??
      body.zipCode ??
      body.zipcode;
    if (postalCode !== undefined && this.hasValue(postalCode)) update.postalCode = String(postalCode).trim();

    const country = nestedAddress?.country ?? body.country;
    if (country !== undefined && this.hasValue(country)) update.country = String(country).trim();

    return Object.keys(update).length > 0 ? update : undefined;
  }

  private hasValue(value: unknown): value is string | number {
    if (value === undefined || value === null) {
      return false;
    }

    if (typeof value === "string") {
      return value.trim().length > 0;
    }

    if (typeof value === "number") {
      return true;
    }

    return false;
  }
}

export { ClientController };