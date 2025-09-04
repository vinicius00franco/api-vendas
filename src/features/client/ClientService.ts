interface Client {
  id: number;
  name: string;
  cpf: string;
  email: string;
  adress: string;
  zipcode: string;
  number: string;
  city: string;
  state: string;
}

class ClientService {
  private clients: Client[] = [
    {
      id: 1,
      name: "João Silva",
      cpf: "123.456.789-00",
      email: "joao@email.com",
      adress: "Rua das Flores, 123",
      zipcode: "12345-678",
      number: "123",
      city: "São Paulo",
      state: "SP"
    },
    {
      id: 2,
      name: "Maria Santos",
      cpf: "987.654.321-00",
      email: "maria@email.com",
      adress: "Av. Principal, 456",
      zipcode: "87654-321",
      number: "456",
      city: "Rio de Janeiro",
      state: "RJ"
    }
  ];

  async create(data: Omit<Client, 'id'>): Promise<Client> {
    const newClient = { id: this.clients.length + 1, ...data };
    this.clients.push(newClient);
    return newClient;
  }

  async findAll(): Promise<Client[]> {
    return this.clients;
  }

  async findById(id: number): Promise<Client | null> {
    return this.clients.find(client => client.id === id) || null;
  }

  async update(id: number, data: Partial<Omit<Client, 'id'>>): Promise<Client | null> {
    const index = this.clients.findIndex(client => client.id === id);
    if (index === -1) return null;
    
    this.clients[index] = { ...this.clients[index], ...data };
    return this.clients[index];
  }

  async delete(id: number): Promise<boolean> {
    const index = this.clients.findIndex(client => client.id === id);
    if (index === -1) return false;
    
    this.clients.splice(index, 1);
    return true;
  }
}

export { ClientService };