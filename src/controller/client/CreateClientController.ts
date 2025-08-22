import { Request, Response } from "express";

class CreateClientController {
  async handle(request: Request, response: Response) {
    const { name, cpf, email, adress, zipcode, number, city, state } = request.body;
    const client = { name, cpf, email, adress, zipcode, number, city, state };
    response.json({ message: "Cliente incluído com sucesso" });
  }
}

export { CreateClientController };