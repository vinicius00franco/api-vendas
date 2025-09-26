import { Repository } from "typeorm";
import { AppDataSource } from "../../shared/database/data-source.js";
import { Client } from "./Client.js";

export type CreateClientInput = {
  name: string;
  document: string;
  email: string;
  address: string;
  zipCode: string;
  number: string;
  city: string;
  state: string;
};

export type UpdateClientInput = Partial<CreateClientInput>;

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

    const client = this.repository.create({
      ...data,
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

    const updated = this.repository.merge(client, data);
    return this.repository.save(updated);
  }

  async delete(id: number): Promise<void> {
    const client = await this.repository.findOne({ where: { id } });
    if (!client) {
      throw new Error("Cliente não encontrado");
    }

    await this.repository.remove(client);
  }
}

export { ClientService };