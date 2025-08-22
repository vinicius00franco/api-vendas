import { Request, Response } from "express";

class UpdateUserController {
  async handle(request: Request, response: Response) {
    const { id } = request.params;
    const { name, email, admin, password } = request.body;
    response.json({ message: "Usuário atualizado com sucesso", id });
  }
}

export { UpdateUserController };