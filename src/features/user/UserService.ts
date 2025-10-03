import bcrypt from "bcryptjs";
import { Repository } from "typeorm";
import { AppDataSource } from "../../shared/database/data-source.js";
import { User } from "./User.js";

export type CreateUserInput = {
  name: string;
  email: string;
  password: string;
  isAdmin?: boolean;
};

export type UpdateUserInput = Partial<{
  name: string;
  email: string;
  password: string;
  isAdmin: boolean;
}>;

export type SafeUser = Omit<User, "passwordHash" | "id">;

export default class UserService {
  constructor() {
    console.log("UserService instantiated");
  }

  private get repository(): Repository<User> {
    return AppDataSource.getRepository(User);
  }

  async create(data: CreateUserInput): Promise<SafeUser> {
    await this.ensureEmailAvailability(data.email);

    const passwordHash = await this.hashPassword(data.password);

    const user = this.repository.create({
      name: data.name,
      email: data.email,
      passwordHash,
      isAdmin: data.isAdmin ?? false,
    });

    const savedUser = await this.repository.save(user);
    return this.toSafeUser(savedUser);
  }

  async findAll(): Promise<SafeUser[]> {
    const users = await this.repository.find();
    return users.map((user) => this.toSafeUser(user));
  }

  async findById(id: number): Promise<SafeUser | null> {
    const user = await this.repository.findOne({ where: { id } });
    if (!user) return null;
    return this.toSafeUser(user);
  }

  async findByUuid(uuid: string): Promise<SafeUser | null> {
    const user = await this.repository.findOne({ where: { uuid } });
    if (!user) return null;
    return this.toSafeUser(user);
  }

  async findByEmail(email: string): Promise<SafeUser | null> {
    const user = await this.repository.findOne({ where: { email } });
    if (!user) return null;
    return this.toSafeUser(user);
  }

  async findByEmailWithPassword(email: string): Promise<User | null> {
    return this.repository
      .createQueryBuilder("user")
      .addSelect("user.passwordHash")
      .where("user.email = :email", { email })
      .getOne();
  }

  async update(id: number, data: UpdateUserInput): Promise<SafeUser> {
    const user = await this.repository.findOne({ where: { id } });
    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    if (data.email && data.email !== user.email) {
      await this.ensureEmailAvailability(data.email, id);
    }

    const partial: Partial<User> = {};

    if (data.password) {
      partial.passwordHash = await this.hashPassword(data.password);
    }

    if (data.name !== undefined) partial.name = data.name;
    if (data.email !== undefined) partial.email = data.email;
    if (data.isAdmin !== undefined) partial.isAdmin = data.isAdmin;

    const updated = this.repository.merge(user, partial);
    const saved = await this.repository.save(updated);
    return this.toSafeUser(saved);
  }

  async delete(id: number): Promise<void> {
    const user = await this.repository.findOne({ where: { id } });
    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    await this.repository.remove(user);
  }

  async verifyPassword(user: User, password: string): Promise<boolean> {
    if (!user.passwordHash) {
      throw new Error("Senha do usuário não está disponível para verificação");
    }
    return bcrypt.compare(password, user.passwordHash);
  }

  toSafeUser(user: User): SafeUser {
    const { id, passwordHash, ...safe } = user;
    return safe;
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS ?? 10);
    return bcrypt.hash(password, saltRounds);
  }

  private async ensureEmailAvailability(email: string, ignoreUserId?: number): Promise<void> {
    const existing = await this.repository.findOne({ where: { email } });
    if (existing && existing.id !== ignoreUserId) {
      throw new Error("Já existe um usuário com este e-mail");
    }
  }
}