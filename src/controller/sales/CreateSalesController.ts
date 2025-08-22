import { Request, Response } from "express";

class CreateSalesController {
  async handle(request: Request, response: Response) {
    const { value, discount, productid, ClientId } = request.body;
    const sales = { value, discount, productid, ClientId };
    response.json({ message: "Venda incluída com sucesso" });
  }
}

export { CreateSalesController };