import { Repository } from "typeorm";
import { AppDataSource } from "../../shared/database/data-source.js";
import { Client, type ClientAddress } from "./Client.js";

export type ClientAddressInput = ClientAddress;

export type CreateClientInput = {
  name: string;
  document: string;
  email: string;
  phone?: string;
  address: ClientAddressInput;
};

export type UpdateClientInput = Partial<Omit<CreateClientInput, "address">> & {
  address?: Partial<ClientAddressInput>;
};

class ClientService {
  private get repository(): Repository<Client> {
    return AppDataSource.getRepository(Client);
  }

  async create(data: CreateClientInput): Promise<Client> {
    if (!data.document) {
      throw new Error("Documento do cliente é obrigatório");
    }

    if (!data.email) {
      throw new Error("E-mail do cliente é obrigatório");
    }

    const existing = await this.repository.findOne({ where: { document: data.document } });
    if (existing) {
      throw new Error("Já existe um cliente com este documento");
    }

    this.validateAddress(data.address);

    const client = this.repository.create({
      name: data.name,
      document: data.document,
      email: data.email,
      phone: data.phone ?? null,
      address: data.address,
    });

    return this.repository.save(client);
  }

  async findAll(): Promise<Client[]> {
    return this.repository.find();
  }

  async findById(id: number): Promise<Client | null> {
    return this.repository.findOne({ where: { id } });
  }

  async update(id: number, data: UpdateClientInput): Promise<Client> {
    const client = await this.repository.findOne({ where: { id } });
    if (!client) {
      throw new Error("Cliente não encontrado");
    }

    if (data.document && data.document !== client.document) {
      const existing = await this.repository.findOne({ where: { document: data.document } });
      if (existing && existing.id !== id) {
        throw new Error("Já existe um cliente com este documento");
      }
    }

    if (data.address) {
      const mergedAddress = {
        ...client.address,
        ...data.address,
      } as ClientAddress;
      client.address = mergedAddress;
      this.validateAddress(client.address);
    }

    const updated = this.repository.merge(client, {
      ...data,
      address: client.address,
      phone: data.phone ?? client.phone,
    });
    return this.repository.save(updated);
  }

  async delete(id: number): Promise<void> {
    const client = await this.repository.findOne({ where: { id } });
    if (!client) {
      throw new Error("Cliente não encontrado");
    }

    await this.repository.remove(client);
  }

  private validateAddress(address: ClientAddressInput): void {
    const requiredFields: Array<keyof ClientAddressInput> = ["street", "city", "postalCode", "country"];

    const missing = requiredFields.filter((field) => {
      const value = address[field];
      return value === undefined || value === null || String(value).trim() === "";
    });

    if (missing.length > 0) {
      throw new Error(`Endereço inválido. Campos obrigatórios ausentes: ${missing.join(", ")}`);
    }
  }
}

export { ClientService };