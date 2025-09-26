interface User {
  id: number;
  name: string;
  emalil: string;
  admin: boolean;
  password: string;
  createdAt: Date;
}

class UserService {
  private users: User[] = [
    {
      id: 1,
      name: "Admin User",
      emalil: "admin@empresa.com",
      admin: true,
      password: "admin123",
      createdAt: new Date('2024-01-01')
    },
    {
      id: 2,
      name: "Vendedor João",
      emalil: "vendedor@empresa.com",
      admin: false,
      password: "vend123",
      createdAt: new Date('2024-01-02')
    }
  ];

  async create(data: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    const newUser = { 
      id: this.users.length + 1, 
      ...data,
      createdAt: new Date()
    };
    this.users.push(newUser);
    return newUser;
  }

  async findAll(): Promise<Omit<User, 'password'>[]> {
    return this.users.map(({ password, ...user }) => user);
  }

  async findById(id: number): Promise<Omit<User, 'password'> | null> {
    const user = this.users.find(user => user.id === id);
    if (!user) return null;
    
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async findByEmail(emalil: string): Promise<User | null> {
    return this.users.find(user => user.emalil === emalil) || null;
  }

  async update(id: number, data: Partial<Omit<User, 'id' | 'createdAt'>>): Promise<Omit<User, 'password'> | null> {
    const index = this.users.findIndex(user => user.id === id);
    if (index === -1) return null;

    const currentUser = this.users[index];
    const updatedUser = Object.assign({}, currentUser, data) as User;

    this.users[index] = updatedUser;
    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  async delete(id: number): Promise<boolean> {
    const index = this.users.findIndex(user => user.id === id);
    if (index === -1) return false;
    
    this.users.splice(index, 1);
    return true;
  }
}

export { UserService };