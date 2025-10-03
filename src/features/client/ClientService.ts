import { Repository } from "typeorm";
import { AppDataSource } from "../../shared/database/data-source.js";
import { repo } from "../../shared/database/transaction-context.js";
import { Client, type ClientAddress } from "./Client.js";

export type SafeClient = Omit<Client, "id">;

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
    return repo<Client>(Client);
  }

  private toSafeClient(client: Client): SafeClient {
    const { id, ...safe } = client;
    return safe;
  }

  async create(data: CreateClientInput): Promise<SafeClient> {
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

    return this.toSafeClient(await this.repository.save(client));
  }

  async findAll(): Promise<SafeClient[]> {
    const clients = await this.repository.find();
    return clients.map(c => this.toSafeClient(c));
  }

  async findById(id: number): Promise<SafeClient | null> {
    const client = await this.repository.findOne({ where: { id } });
    return client ? this.toSafeClient(client) : null;
  }

  async findByUuid(uuid: string): Promise<SafeClient | null> {
    const client = await this.repository.findOne({ where: { uuid } });
    return client ? this.toSafeClient(client) : null;
  }

  async update(id: number, data: UpdateClientInput): Promise<SafeClient> {
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
    return this.toSafeClient(await this.repository.save(updated));
  }

  async delete(id: number): Promise<void> {
    const client = await this.repository.findOne({ where: { id } });
    if (!client) {
      throw new Error("Cliente não encontrado");
    }

    await this.repository.remove(client);
  }

  async updateByUuid(uuid: string, data: UpdateClientInput): Promise<SafeClient> {
    const client = await this.repository.findOne({ where: { uuid } });
    if (!client) {
      throw new Error("Cliente não encontrado");
    }

    if (data.document && data.document !== client.document) {
      const existing = await this.repository.findOne({ where: { document: data.document } });
      if (existing && existing.uuid !== uuid) {
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
    return this.toSafeClient(await this.repository.save(updated));
  }

  async deleteByUuid(uuid: string): Promise<void> {
    const client = await this.repository.findOne({ where: { uuid } });
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