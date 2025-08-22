import { Request, Response } from "express";

class PatchUserController {
  async handle(request: Request, response: Response) {
    const { id } = request.params;
    const updates = request.body;
    response.json({ message: "Usuário atualizado parcialmente", id, updates });
  }
}

export { PatchUserController };