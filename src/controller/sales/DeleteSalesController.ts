import { Request, Response } from "express";

class DeleteSalesController {
  async handle(request: Request, response: Response) {
    const { id } = request.params;
    response.json({ message: "Venda deletada com sucesso", id });
  }
}

export { DeleteSalesController };