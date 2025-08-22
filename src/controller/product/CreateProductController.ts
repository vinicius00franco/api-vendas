import { Request, Response } from "express";

class CreateProductController {
  async handle(request: Request, response: Response) {
    const { name, EAN, price, description, categoryId } = request.body;
    const product = { name, EAN, price, description, categoryId };
    response.json({ message: "Produto incluído com sucesso" });
  }
}

export { CreateProductController };