import { Request, Response } from "express";

class CreateCategoryController {
  async handle(request: Request, response: Response) {
    const { name, description } = request.body;
    const category = { name, description };
    response.json({ message: "Categoria incluída com sucesso" });
  }
}

export { CreateCategoryController };