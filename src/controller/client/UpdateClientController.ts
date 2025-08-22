import { Request, Response } from "express";

class UpdateClientController {
  async handle(request: Request, response: Response) {
    const { id } = request.params;
    const { name, cpf, email, adress, zipcode, number, city, state } = request.body;
    response.json({ message: "Cliente atualizado com sucesso", id });
  }
}

export { UpdateClientController };