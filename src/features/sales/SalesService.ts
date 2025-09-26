import { Repository } from "typeorm";
import { AppDataSource } from "../../shared/database/data-source.js";
import { Client } from "../client/Client.js";
import { Product } from "../product/Product.js";
import { Sale } from "./Sale.js";

export type CreateSaleInput = {
  value: number;
  discount?: number;
  productId: number;
  clientId: number;
};

export type UpdateSaleInput = Partial<CreateSaleInput>;

class SalesService {
  private get repository(): Repository<Sale> {
    return AppDataSource.getRepository(Sale);
  }

  private get productRepository(): Repository<Product> {
    return AppDataSource.getRepository(Product);
  }

  private get clientRepository(): Repository<Client> {
    return AppDataSource.getRepository(Client);
  }

  async create(data: CreateSaleInput): Promise<Sale> {
    if (Number.isNaN(data.value)) {
      throw new Error("Valor da venda é obrigatório");
    }

    if (data.discount !== undefined && Number.isNaN(data.discount)) {
      throw new Error("Desconto inválido");
    }

    const product = await this.productRepository.findOne({ where: { id: data.productId } });
    if (!product) {
      throw new Error("Produto informado não foi encontrado");
    }

    const client = await this.clientRepository.findOne({ where: { id: data.clientId } });
    if (!client) {
      throw new Error("Cliente informado não foi encontrado");
    }

    const sale = this.repository.create({
      value: data.value,
      discount: data.discount ?? 0,
      productId: data.productId,
      clientId: data.clientId,
    });

    return this.repository.save(sale);
  }

  async findAll(): Promise<Sale[]> {
    return this.repository.find({ relations: { product: true, client: true } });
  }

  async findById(id: number): Promise<Sale | null> {
    return this.repository.findOne({ where: { id }, relations: { product: true, client: true } });
  }

  async findByClient(clientId: number): Promise<Sale[]> {
    return this.repository.find({ where: { clientId } });
  }

  async findByProduct(productId: number): Promise<Sale[]> {
    return this.repository.find({ where: { productId } });
  }

  async update(id: number, data: UpdateSaleInput): Promise<Sale> {
    const sale = await this.repository.findOne({ where: { id } });
    if (!sale) {
      throw new Error("Venda não encontrada");
    }

    if (data.value !== undefined && Number.isNaN(data.value)) {
      throw new Error("Valor inválido");
    }

    if (data.discount !== undefined && Number.isNaN(data.discount)) {
      throw new Error("Desconto inválido");
    }

    if (data.productId && data.productId !== sale.productId) {
      const product = await this.productRepository.findOne({ where: { id: data.productId } });
      if (!product) {
        throw new Error("Produto informado não foi encontrado");
      }
    }

    if (data.clientId && data.clientId !== sale.clientId) {
      const client = await this.clientRepository.findOne({ where: { id: data.clientId } });
      if (!client) {
        throw new Error("Cliente informado não foi encontrado");
      }
    }

    const updated = this.repository.merge(sale, {
      ...data,
      discount: data.discount ?? sale.discount,
    });

    return this.repository.save(updated);
  }

  async delete(id: number): Promise<void> {
    const sale = await this.repository.findOne({ where: { id } });
    if (!sale) {
      throw new Error("Venda não encontrada");
    }

    await this.repository.remove(sale);
  }

  async getTotalSales(): Promise<number> {
    const sales = await this.repository.find();
    return sales.reduce((total, sale) => total + (Number(sale.value) - Number(sale.discount)), 0);
  }
}

export { SalesService };