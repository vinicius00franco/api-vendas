import { Request, Response } from "express";

class ProductController {
  async create(request: Request, response: Response) {
    const { name, EAN, price, description, categoryId } = request.body;
    const product = { name, EAN, price, description, categoryId };
    response.json({ message: "Produto incluído com sucesso" });
  }

  async update(request: Request, response: Response) {
    const { id } = request.params;
    const { name, EAN, price, description, categoryId } = request.body;
    response.json({ message: "Produto atualizado com sucesso", id });
  }

  async delete(request: Request, response: Response) {
    const { id } = request.params;
    response.json({ message: "Produto deletado com sucesso", id });
  }

  async patch(request: Request, response: Response) {
    const { id } = request.params;
    const updates = request.body;
    response.json({ message: "Produto atualizado parcialmente", id, updates });
  }
}

export { ProductController };