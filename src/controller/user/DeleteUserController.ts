import { Request, Response } from "express";

class DeleteUserController {
  async handle(request: Request, response: Response) {
    const { id } = request.params;
    response.json({ message: "Usuário deletado com sucesso", id });
  }
}

export { DeleteUserController };