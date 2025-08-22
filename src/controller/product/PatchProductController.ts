import { Request, Response } from "express";

class PatchProductController {
  async handle(request: Request, response: Response) {
    const { id } = request.params;
    const updates = request.body;
    response.json({ message: "Produto atualizado parcialmente", id, updates });
  }
}

export { PatchProductController };