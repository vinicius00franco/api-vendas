import { Request, Response } from "express";

class DeleteProductController {
  async handle(request: Request, response: Response) {
    const { id } = request.params;
    response.json({ message: "Produto deletado com sucesso", id });
  }
}

export { DeleteProductController };