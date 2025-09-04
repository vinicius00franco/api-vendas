interface Category {
  id: number;
  name: string;
  description: string;
}

class CategoryService {
  private categories: Category[] = [
    { id: 1, name: "Eletrônicos", description: "Produtos eletrônicos e tecnologia" },
    { id: 2, name: "Roupas", description: "Vestuário e acessórios" },
    { id: 3, name: "Casa", description: "Produtos para casa e decoração" }
  ];

  async create(data: Omit<Category, 'id'>): Promise<Category> {
    const newCategory = { id: this.categories.length + 1, ...data };
    this.categories.push(newCategory);
    return newCategory;
  }

  async findAll(): Promise<Category[]> {
    return this.categories;
  }

  async findById(id: number): Promise<Category | null> {
    return this.categories.find(category => category.id === id) || null;
  }

  async update(id: number, data: Partial<Omit<Category, 'id'>>): Promise<Category | null> {
    const index = this.categories.findIndex(category => category.id === id);
    if (index === -1) return null;
    
    this.categories[index] = { ...this.categories[index], ...data };
    return this.categories[index];
  }

  async delete(id: number): Promise<boolean> {
    const index = this.categories.findIndex(category => category.id === id);
    if (index === -1) return false;
    
    this.categories.splice(index, 1);
    return true;
  }
}

export { CategoryService };