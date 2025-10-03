import { Repository } from "typeorm";
import { AppDataSource } from "../../shared/database/data-source.js";
import { repo } from "../../shared/database/transaction-context.js";
import { Category } from "./Category.js";

export type CreateCategoryInput = {
  name: string;
  description?: string | null;
};

export type UpdateCategoryInput = Partial<CreateCategoryInput>;

export type SafeCategory = Omit<Category, "id">;

class CategoryService {
  private get repository(): Repository<Category> { return repo<Category>(Category); }

  async create(data: CreateCategoryInput): Promise<SafeCategory> {
    if (!data.name) {
      throw new Error("Nome da categoria é obrigatório");
    }

    const existing = await this.repository.findOne({ where: { name: data.name } });
    if (existing) {
      throw new Error("Já existe uma categoria com este nome");
    }

    const category = this.repository.create({
      name: data.name,
      description: data.description ?? null,
    });

    const saved = await this.repository.save(category);
    return this.toSafeCategory(saved);
  }

  async findAll(): Promise<SafeCategory[]> {
    const categories = await this.repository.find();
    return categories.map(category => this.toSafeCategory(category));
  }

  async findById(id: number): Promise<SafeCategory | null> {
    const category = await this.repository.findOne({ where: { id } });
    return category ? this.toSafeCategory(category) : null;
  }

  async findByUuid(uuid: string): Promise<SafeCategory | null> {
    const category = await this.repository.findOne({ where: { uuid } });
    return category ? this.toSafeCategory(category) : null;
  }

  async update(id: number, data: UpdateCategoryInput): Promise<SafeCategory> {
    const category = await this.repository.findOne({ where: { id } });
    if (!category) {
      throw new Error("Categoria não encontrada");
    }

    if (data.name && data.name !== category.name) {
      const existing = await this.repository.findOne({ where: { name: data.name } });
      if (existing && existing.id !== id) {
        throw new Error("Já existe uma categoria com este nome");
      }
    }

    if (data.description !== undefined) {
      category.description = data.description ?? null;
    }

    const updated = this.repository.merge(category, {
      ...data,
      description: category.description,
    });

    const saved = await this.repository.save(updated);
    return this.toSafeCategory(saved);
  }

  async delete(id: number): Promise<void> {
    const category = await this.repository.findOne({ where: { id } });
    if (!category) {
      throw new Error("Categoria não encontrada");
    }

    await this.repository.remove(category);
  }

  async updateByUuid(uuid: string, data: UpdateCategoryInput): Promise<SafeCategory> {
    const category = await this.repository.findOne({ where: { uuid } });
    if (!category) {
      throw new Error("Categoria não encontrada");
    }

    if (data.name && data.name !== category.name) {
      const existing = await this.repository.findOne({ where: { name: data.name } });
      if (existing && existing.id !== category.id) {
        throw new Error("Já existe uma categoria com este nome");
      }
    }

    if (data.description !== undefined) {
      category.description = data.description ?? null;
    }

    const updated = this.repository.merge(category, {
      ...data,
      description: category.description,
    });

    const saved = await this.repository.save(updated);
    return this.toSafeCategory(saved);
  }

  async deleteByUuid(uuid: string): Promise<void> {
    const category = await this.repository.findOne({ where: { uuid } });
    if (!category) {
      throw new Error("Categoria não encontrada");
    }

    await this.repository.remove(category);
  }

  toSafeCategory(category: Category): SafeCategory {
    const { id, ...safe } = category;
    return safe;
  }
}

export { CategoryService };
