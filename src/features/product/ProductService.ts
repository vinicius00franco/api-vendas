import { Repository } from "typeorm";
import { AppDataSource } from "../../shared/database/data-source.js";
import { Category } from "../category/Category.js";
import { Product } from "./Product.js";

export type CreateProductInput = {
  name: string;
  ean: string;
  price: number;
  description?: string;
  categoryId: number;
};

export type UpdateProductInput = Partial<CreateProductInput>;

class ProductService {
  private get repository(): Repository<Product> {
    return AppDataSource.getRepository(Product);
  }

  private get categoryRepository(): Repository<Category> {
    return AppDataSource.getRepository(Category);
  }

  async create(data: CreateProductInput): Promise<Product> {
    if (!data.name) {
      throw new Error("Nome do produto é obrigatório");
    }

    if (!data.ean) {
      throw new Error("EAN do produto é obrigatório");
    }

    const existing = await this.repository.findOne({ where: { name: data.name } });
    if (existing) {
      throw new Error("Já existe um produto com este nome");
    }

    const existingEAN = await this.repository.findOne({ where: { ean: data.ean } });
    if (existingEAN) {
      throw new Error("Já existe um produto com este EAN");
    }

    const category = await this.categoryRepository.findOne({ where: { id: data.categoryId } });
    if (!category) {
      throw new Error("Categoria informada não foi encontrada");
    }

    const product = this.repository.create({
      name: data.name,
      ean: data.ean,
      price: data.price,
      description: data.description ?? null,
      categoryId: data.categoryId,
    });

    return this.repository.save(product);
  }

  async findAll(): Promise<Product[]> {
    return this.repository.find({ relations: { category: true } });
  }

  async findById(id: number): Promise<Product | null> {
    return this.repository.findOne({ where: { id }, relations: { category: true } });
  }

  async findByCategory(categoryId: number): Promise<Product[]> {
    return this.repository.find({ where: { categoryId } });
  }

  async update(id: number, data: UpdateProductInput): Promise<Product> {
    const product = await this.repository.findOne({ where: { id } });
    if (!product) {
      throw new Error("Produto não encontrado");
    }

    if (data.name && data.name !== product.name) {
      const existing = await this.repository.findOne({ where: { name: data.name } });
      if (existing && existing.id !== id) {
        throw new Error("Já existe um produto com este nome");
      }
    }

    if (data.ean && data.ean !== product.ean) {
      const existingEAN = await this.repository.findOne({ where: { ean: data.ean } });
      if (existingEAN && existingEAN.id !== id) {
        throw new Error("Já existe um produto com este EAN");
      }
    }

    if (data.categoryId && data.categoryId !== product.categoryId) {
      const category = await this.categoryRepository.findOne({ where: { id: data.categoryId } });
      if (!category) {
        throw new Error("Categoria informada não foi encontrada");
      }
    }

    if (data.description !== undefined) {
      product.description = data.description ?? null;
    }

    const updated = this.repository.merge(product, {
      ...data,
      description: product.description,
    });

    return this.repository.save(updated);
  }

  async delete(id: number): Promise<void> {
    const product = await this.repository.findOne({ where: { id } });
    if (!product) {
      throw new Error("Produto não encontrado");
    }

    await this.repository.remove(product);
  }
}

export { ProductService };