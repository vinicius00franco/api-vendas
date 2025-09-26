import { Request, Response } from "express";
import { ClientService, type UpdateClientInput } from "./ClientService.js";

class ClientController {
  private readonly clientService = new ClientService();

  async create(request: Request, response: Response) {
    const { name, cpf, document, email, address, adress, zipCode, zipcode, number, city, state } = request.body;
    try {
      const documentValue = document ?? cpf;
      const addressValue = address ?? adress;
      const zipCodeValue = zipCode ?? zipcode;

      if (!name || !documentValue || !email || !addressValue || !zipCodeValue || !number || !city || !state) {
        return response.status(400).json({ message: "Dados do cliente inválidos" });
      }

      const client = await this.clientService.create({
        name,
        document: documentValue,
        email,
        address: addressValue,
        zipCode: zipCodeValue,
        number,
        city,
        state,
      });

      return response.status(201).json(client);
    } catch (error) {
      return response.status(400).json({ message: (error as Error).message });
    }
  }

  async update(request: Request, response: Response) {
    const { id } = request.params;
    const { name, cpf, document, email, address, adress, zipCode, zipcode, number, city, state } = request.body;
    try {
      const payload: UpdateClientInput = {};
      if (name !== undefined) payload.name = name;
      if (document !== undefined || cpf !== undefined) payload.document = document ?? cpf;
      if (email !== undefined) payload.email = email;
      if (address !== undefined || adress !== undefined) payload.address = address ?? adress;
      if (zipCode !== undefined || zipcode !== undefined) payload.zipCode = zipCode ?? zipcode;
      if (number !== undefined) payload.number = number;
      if (city !== undefined) payload.city = city;
      if (state !== undefined) payload.state = state;

      if (Object.keys(payload).length === 0) {
        return response.status(400).json({ message: "Nenhum dado informado para atualização" });
      }

      const client = await this.clientService.update(Number(id), payload);
      return response.json(client);
    } catch (error) {
      return response.status(400).json({ message: (error as Error).message });
    }
  }

  async delete(request: Request, response: Response) {
    const { id } = request.params;
    try {
      await this.clientService.delete(Number(id));
      return response.status(204).send();
    } catch (error) {
      return response.status(404).json({ message: (error as Error).message });
    }
  }

  async patch(request: Request, response: Response) {
    const { id } = request.params;
    const updates = request.body;
    try {
      const payload: UpdateClientInput = {};
      if (updates.name !== undefined) payload.name = updates.name;
      if (updates.document !== undefined || updates.cpf !== undefined) payload.document = updates.document ?? updates.cpf;
      if (updates.email !== undefined) payload.email = updates.email;
      if (updates.address !== undefined || updates.adress !== undefined) payload.address = updates.address ?? updates.adress;
      if (updates.zipCode !== undefined || updates.zipcode !== undefined) payload.zipCode = updates.zipCode ?? updates.zipcode;
      if (updates.number !== undefined) payload.number = updates.number;
      if (updates.city !== undefined) payload.city = updates.city;
      if (updates.state !== undefined) payload.state = updates.state;

      if (Object.keys(payload).length === 0) {
        return response.status(400).json({ message: "Nenhum dado informado para atualização" });
      }

      const client = await this.clientService.update(Number(id), payload);
      return response.json(client);
    } catch (error) {
      return response.status(400).json({ message: (error as Error).message });
    }
  }
}

export { ClientController };