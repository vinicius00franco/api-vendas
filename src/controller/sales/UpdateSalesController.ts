import { Request, Response } from "express";

class UpdateSalesController {
  async handle(request: Request, response: Response) {
    const { id } = request.params;
    const { value, discount, productid, ClientId } = request.body;
    response.json({ message: "Venda atualizada com sucesso", id });
  }
}

export { UpdateSalesController };