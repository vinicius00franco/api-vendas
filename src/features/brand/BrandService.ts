import { Repository } from "typeorm";
import { AppDataSource } from "../../shared/database/data-source.js";
import { repo } from "../../shared/database/transaction-context.js";
import { Brand } from "./Brand.js";

export type SafeBrand = Omit<Brand, 'id'>; // Omit id from responses

export type CreateBrandInput = {
  name: string;
  description?: string;
};

export type UpdateBrandInput = Partial<CreateBrandInput>;

class BrandService {
  private get repository(): Repository<Brand> {
    return repo<Brand>(Brand);
  }

  private toSafeBrand(brand: Brand): SafeBrand {
    const { id, ...safe } = brand;
    return safe;
  }

  async create(data: CreateBrandInput): Promise<SafeBrand> {
    if (!data.name) {
      throw new Error("Nome da marca é obrigatório");
    }

    const existing = await this.repository.findOne({ where: { name: data.name } });
    if (existing) {
      throw new Error("Já existe uma marca com este nome");
    }

    const brand = this.repository.create({
      name: data.name,
    });

    return this.toSafeBrand(await this.repository.save(brand));
  }

  async findAll(): Promise<SafeBrand[]> {
    const brands = await this.repository.find();
    return brands.map(b => this.toSafeBrand(b));
  }

  async findById(id: number): Promise<SafeBrand | null> {
    const brand = await this.repository.findOne({ where: { id } });
    return brand ? this.toSafeBrand(brand) : null;
  }

  async findByUuid(uuid: string): Promise<SafeBrand | null> {
    const brand = await this.repository.findOne({ where: { uuid } });
    return brand ? this.toSafeBrand(brand) : null;
  }

  async update(id: number, data: UpdateBrandInput): Promise<SafeBrand> {
    const brand = await this.repository.findOne({ where: { id } });
    if (!brand) {
      throw new Error("Marca não encontrada");
    }

    if (data.name && data.name !== brand.name) {
      const existing = await this.repository.findOne({ where: { name: data.name } });
      if (existing && existing.id !== id) {
        throw new Error("Já existe uma marca com este nome");
      }
    }

    const updated = this.repository.merge(brand, data);
    return this.toSafeBrand(await this.repository.save(updated));
  }

  async delete(id: number): Promise<void> {
    const brand = await this.repository.findOne({ where: { id } });
    if (!brand) {
      throw new Error("Marca não encontrada");
    }

    await this.repository.remove(brand);
  }

  async updateByUuid(uuid: string, data: UpdateBrandInput): Promise<SafeBrand> {
    const brand = await this.repository.findOne({ where: { uuid } });
    if (!brand) {
      throw new Error("Marca não encontrada");
    }

    if (data.name && data.name !== brand.name) {
      const existing = await this.repository.findOne({ where: { name: data.name } });
      if (existing && existing.uuid !== uuid) {
        throw new Error("Já existe uma marca com este nome");
      }
    }

    const updated = this.repository.merge(brand, data);
    return this.toSafeBrand(await this.repository.save(updated));
  }

  async deleteByUuid(uuid: string): Promise<string> {
    const brand = await this.repository.findOne({ where: { uuid } });
    if (!brand) {
      throw new Error("Marca não encontrada");
    }

    await this.repository.remove(brand);
    return uuid;
  }
}

export { BrandService };