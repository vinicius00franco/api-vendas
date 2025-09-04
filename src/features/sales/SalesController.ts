import { Request, Response } from "express";

class SalesController {
  async create(request: Request, response: Response) {
    const { value, discount, productId, clientId } = request.body;
    const sales = { value, discount, productId, clientId };
    response.json({ message: "Venda incluída com sucesso" });
  }

  async update(request: Request, response: Response) {
    const { id } = request.params;
    const { value, discount, productId, clientId } = request.body;
    response.json({ message: "Venda atualizada com sucesso", id });
  }

  async delete(request: Request, response: Response) {
    const { id } = request.params;
    response.json({ message: "Venda deletada com sucesso", id });
  }

  async patch(request: Request, response: Response) {
    const { id } = request.params;
    const updates = request.body;
    response.json({ message: "Venda atualizada parcialmente", id, updates });
  }
}

export { SalesController };