import { Request, Response } from "express";

class ClientController {
  async create(request: Request, response: Response) {
    const { name, cpf, email, adress, zipcode, number, city, state } = request.body;
    const client = { name, cpf, email, adress, zipcode, number, city, state };
    response.json({ message: "Cliente incluído com sucesso" });
  }

  async update(request: Request, response: Response) {
    const { id } = request.params;
    const { name, cpf, email, adress, zipcode, number, city, state } = request.body;
    response.json({ message: "Cliente atualizado com sucesso", id });
  }

  async delete(request: Request, response: Response) {
    const { id } = request.params;
    response.json({ message: "Cliente deletado com sucesso", id });
  }

  async patch(request: Request, response: Response) {
    const { id } = request.params;
    const updates = request.body;
    response.json({ message: "Cliente atualizado parcialmente", id, updates });
  }
}

export { ClientController };