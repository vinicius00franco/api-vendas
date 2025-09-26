import { Repository } from "typeorm";
import { AppDataSource } from "../../shared/database/data-source.js";
import { Category } from "./Category.js";

export type CreateCategoryInput = {
  name: string;
  description?: string | null;
};

export type UpdateCategoryInput = Partial<CreateCategoryInput>;

class CategoryService {
  private get repository(): Repository<Category> {
    return AppDataSource.getRepository(Category);
  }

  async create(data: CreateCategoryInput): Promise<Category> {
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

    return this.repository.save(category);
  }

  async findAll(): Promise<Category[]> {
    return this.repository.find();
  }

  async findById(id: number): Promise<Category | null> {
    return this.repository.findOne({ where: { id } });
  }

  async update(id: number, data: UpdateCategoryInput): Promise<Category> {
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

    return this.repository.save(updated);
  }

  async delete(id: number): Promise<void> {
    const category = await this.repository.findOne({ where: { id } });
    if (!category) {
      throw new Error("Categoria não encontrada");
    }

    await this.repository.remove(category);
  }
}

export { CategoryService };