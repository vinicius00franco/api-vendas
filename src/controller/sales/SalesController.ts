import { Request, Response } from "express";

class SalesController {
  async create(request: Request, response: Response) {
    const { value, discount, productid, ClientId } = request.body;
    const sales = { value, discount, productid, ClientId };
    response.json({ message: "Venda incluída com sucesso" });
  }

  async update(request: Request, response: Response) {
    const { id } = request.params;
    const { value, discount, productid, ClientId } = request.body;
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