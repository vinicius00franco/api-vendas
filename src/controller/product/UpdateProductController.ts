import { Request, Response } from "express";

class UpdateProductController {
  async handle(request: Request, response: Response) {
    const { id } = request.params;
    const { name, EAN, price, description, categoryId } = request.body;
    response.json({ message: "Produto atualizado com sucesso", id });
  }
}

export { UpdateProductController };