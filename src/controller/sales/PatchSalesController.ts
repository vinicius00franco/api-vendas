import { Request, Response } from "express";

class PatchSalesController {
  async handle(request: Request, response: Response) {
    const { id } = request.params;
    const updates = request.body;
    response.json({ message: "Venda atualizada parcialmente", id, updates });
  }
}

export { PatchSalesController };