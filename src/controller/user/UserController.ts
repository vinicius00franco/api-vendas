import { Request, Response } from "express";

class UserController {
  async create(request: Request, response: Response) {
    const { name, emalil, admin, password } = request.body;
    const user = { name, emalil, admin, password };
    response.json({ message: "Usuário incluído com sucesso" });
  }

  async update(request: Request, response: Response) {
    const { id } = request.params;
    const { name, emalil, admin, password } = request.body;
    response.json({ message: "Usuário atualizado com sucesso", id });
  }

  async delete(request: Request, response: Response) {
    const { id } = request.params;
    response.json({ message: "Usuário deletado com sucesso", id });
  }

  async patch(request: Request, response: Response) {
    const { id } = request.params;
    const updates = request.body;
    response.json({ message: "Usuário atualizado parcialmente", id, updates });
  }
}

export { UserController };