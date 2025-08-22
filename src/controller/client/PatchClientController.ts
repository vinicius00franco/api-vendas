import { Request, Response } from "express";

class PatchClientController {
  async handle(request: Request, response: Response) {
    const { id } = request.params;
    const updates = request.body;
    response.json({ message: "Cliente atualizado parcialmente", id, updates });
  }
}

export { PatchClientController };