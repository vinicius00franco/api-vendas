interface Sale {
  id: number;
  value: number;
  discount: number;
  productid: number;
  ClientId: number;
  createdAt: Date;
}

class SalesService {
  private sales: Sale[] = [
    {
      id: 1,
      value: 899.99,
      discount: 50.00,
      productid: 1,
      ClientId: 1,
      createdAt: new Date('2024-01-15')
    },
    {
      id: 2,
      value: 79.90,
      discount: 0,
      productid: 2,
      ClientId: 2,
      createdAt: new Date('2024-01-16')
    },
    {
      id: 3,
      value: 299.99,
      discount: 30.00,
      productid: 3,
      ClientId: 1,
      createdAt: new Date('2024-01-17')
    }
  ];

  async create(data: Omit<Sale, 'id' | 'createdAt'>): Promise<Sale> {
    const newSale = { 
      id: this.sales.length + 1, 
      ...data,
      createdAt: new Date()
    };
    this.sales.push(newSale);
    return newSale;
  }

  async findAll(): Promise<Sale[]> {
    return this.sales;
  }

  async findById(id: number): Promise<Sale | null> {
    return this.sales.find(sale => sale.id === id) || null;
  }

  async findByClient(clientId: number): Promise<Sale[]> {
    return this.sales.filter(sale => sale.ClientId === clientId);
  }

  async findByProduct(productId: number): Promise<Sale[]> {
    return this.sales.filter(sale => sale.productid === productId);
  }

  async update(id: number, data: Partial<Omit<Sale, 'id' | 'createdAt'>>): Promise<Sale | null> {
    const index = this.sales.findIndex(sale => sale.id === id);
    if (index === -1) return null;
    
    this.sales[index] = { ...this.sales[index], ...data };
    return this.sales[index];
  }

  async delete(id: number): Promise<boolean> {
    const index = this.sales.findIndex(sale => sale.id === id);
    if (index === -1) return false;
    
    this.sales.splice(index, 1);
    return true;
  }

  async getTotalSales(): Promise<number> {
    return this.sales.reduce((total, sale) => total + (sale.value - sale.discount), 0);
  }
}

export { SalesService };