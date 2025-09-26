import { Request, Response } from "express";
import { UserService, type UpdateUserInput } from "./UserService.js";

class UserController {
  private readonly userService = new UserService();

  async create(request: Request, response: Response) {
    const { name, email, admin, password } = request.body;

    try {
      const user = await this.userService.create({
        name,
        email,
        password,
        isAdmin: Boolean(admin),
      });

      return response.status(201).json(user);
    } catch (error) {
      return response.status(400).json({ message: (error as Error).message });
    }
  }

  async update(request: Request, response: Response) {
    const { id } = request.params;
    const { name, email, admin, password } = request.body;

    try {
      const payload: UpdateUserInput = {};
      if (name !== undefined) payload.name = name;
      if (email !== undefined) payload.email = email;
      if (password !== undefined) payload.password = password;
      if (admin !== undefined) payload.isAdmin = Boolean(admin);

      const user = await this.userService.update(Number(id), payload);

      return response.json(user);
    } catch (error) {
      return response.status(400).json({ message: (error as Error).message });
    }
  }

  async delete(request: Request, response: Response) {
    const { id } = request.params;
    try {
      await this.userService.delete(Number(id));
      return response.status(204).send();
    } catch (error) {
      return response.status(404).json({ message: (error as Error).message });
    }
  }

  async patch(request: Request, response: Response) {
    const { id } = request.params;
    const updates = request.body;
    try {
      const payload: UpdateUserInput = {};
      if (updates.name !== undefined) payload.name = updates.name;
      if (updates.email !== undefined) payload.email = updates.email;
      if (updates.password !== undefined) payload.password = updates.password;
      if (updates.admin !== undefined) payload.isAdmin = Boolean(updates.admin);
      if (updates.isAdmin !== undefined) payload.isAdmin = Boolean(updates.isAdmin);

      const user = await this.userService.update(Number(id), payload);

      return response.json(user);
    } catch (error) {
      return response.status(400).json({ message: (error as Error).message });
    }
  }
}

export { UserController };