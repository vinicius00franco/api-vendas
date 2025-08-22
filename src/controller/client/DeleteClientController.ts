import { Request, Response } from "express";

class DeleteClientController {
  async handle(request: Request, response: Response) {
    const { id } = request.params;
    response.json({ message: "Cliente deletado com sucesso", id });
  }
}

export { DeleteClientController };