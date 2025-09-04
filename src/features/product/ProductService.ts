interface Product {
  id: number;
  name: string;
  EAN: string;
  price: number;
  description: string;
  categoryId: number;
}

class ProductService {
  private products: Product[] = [
    {
      id: 1,
      name: "Smartphone Samsung",
      EAN: "7891234567890",
      price: 899.99,
      description: "Smartphone Android com 128GB",
      categoryId: 1
    },
    {
      id: 2,
      name: "Camiseta Polo",
      EAN: "7891234567891",
      price: 79.90,
      description: "Camiseta polo masculina azul",
      categoryId: 2
    },
    {
      id: 3,
      name: "Mesa de Centro",
      EAN: "7891234567892",
      price: 299.99,
      description: "Mesa de centro em madeira",
      categoryId: 3
    }
  ];

  async create(data: Omit<Product, 'id'>): Promise<Product> {
    const newProduct = { id: this.products.length + 1, ...data };
    this.products.push(newProduct);
    return newProduct;
  }

  async findAll(): Promise<Product[]> {
    return this.products;
  }

  async findById(id: number): Promise<Product | null> {
    return this.products.find(product => product.id === id) || null;
  }

  async findByCategory(categoryId: number): Promise<Product[]> {
    return this.products.filter(product => product.categoryId === categoryId);
  }

  async update(id: number, data: Partial<Omit<Product, 'id'>>): Promise<Product | null> {
    const index = this.products.findIndex(product => product.id === id);
    if (index === -1) return null;
    
    this.products[index] = { ...this.products[index], ...data };
    return this.products[index];
  }

  async delete(id: number): Promise<boolean> {
    const index = this.products.findIndex(product => product.id === id);
    if (index === -1) return false;
    
    this.products.splice(index, 1);
    return true;
  }
}

export { ProductService };