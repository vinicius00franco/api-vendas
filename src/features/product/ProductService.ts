import { Repository } from "typeorm";
import { AppDataSource } from "../../shared/database/data-source.js";
import { Category } from "../category/Category.js";
import { Brand } from "../brand/Brand.js";
import { Product } from "./Product.js";
import { ProductVariant } from "./ProductVariant.js";

export type CreateProductInput = {
  name: string;
  description?: string | null;
  categoryId: number;
  brandId: number;
  variant: {
    sku?: string | null;
    ean?: string | null;
    price: number;
    stockQuantity?: number;
  };
};

export type UpdateProductInput = Partial<Omit<CreateProductInput, "variant">> & {
  brandId?: number;
};

class ProductService {
  private get repository(): Repository<Product> {
    return AppDataSource.getRepository(Product);
  }

  private get categoryRepository(): Repository<Category> { return AppDataSource.getRepository(Category); }
  private get brandRepository(): Repository<Brand> { return AppDataSource.getRepository(Brand); }
  private get variantRepository(): Repository<ProductVariant> { return AppDataSource.getRepository(ProductVariant); }

  async create(data: CreateProductInput): Promise<Product> {
    if (!data.name) {
      throw new Error("Nome do produto é obrigatório");
    }

    const existing = await this.repository.findOne({ where: { name: data.name } });
    if (existing) {
      throw new Error("Já existe um produto com este nome");
    }

    const category = await this.categoryRepository.findOne({ where: { id: data.categoryId } });
    if (!category) {
      throw new Error("Categoria informada não foi encontrada");
    }

    const brand = await this.brandRepository.findOne({ where: { id: data.brandId } });
    if (!brand) {
      throw new Error("Marca informada não foi encontrada");
    }

    const product = this.repository.create({
      name: data.name,
      description: data.description ?? null,
      categoryId: data.categoryId,
      brandId: data.brandId,
    });

    const saved = await this.repository.save(product);

    const variant = this.variantRepository.create({
      productId: saved.id,
      sku: data.variant.sku ?? null,
      ean: data.variant.ean ?? null,
      price: data.variant.price,
      stockQuantity: data.variant.stockQuantity ?? 0,
    });

    await this.variantRepository.save(variant);
    return this.findById(saved.id) as Promise<Product>;
  }

  async findAll(): Promise<Product[]> {
    return this.repository.find({ relations: { category: true, brand: true, variants: true } });
  }

  async findById(id: number): Promise<Product | null> {
    return this.repository.findOne({ where: { id }, relations: { category: true, brand: true, variants: true } });
  }

  async findByCategory(categoryId: number): Promise<Product[]> { return this.repository.find({ where: { categoryId }, relations: { variants: true, brand: true } }); }

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

    if (data.categoryId && data.categoryId !== product.categoryId) {
      const category = await this.categoryRepository.findOne({ where: { id: data.categoryId } });
      if (!category) {
        throw new Error("Categoria informada não foi encontrada");
      }
    }

    if ((data as any).brandId && (data as any).brandId !== product.brandId) {
      const brand = await this.brandRepository.findOne({ where: { id: (data as any).brandId } });
      if (!brand) {
        throw new Error("Marca informada não foi encontrada");
      }
    }

    if (data.description !== undefined) { product.description = data.description ?? null; }

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