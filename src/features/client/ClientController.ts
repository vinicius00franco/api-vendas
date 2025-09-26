import { Request, Response } from "express";
import { ClientService } from "./ClientService.js";
import { ClientRequestDto } from "./ClientRequestDto.js";

class ClientController {
  private readonly clientService = new ClientService();

  async create(request: Request, response: Response) {
    try {
      const dto = ClientRequestDto.fromRequest(request);
      const payload = dto.toCreateInput();
      if (!payload.success) {
        return response.status(payload.status ?? 400).json({ message: payload.message });
      }

      const client = await this.clientService.create(payload.data);

      return response.status(201).json(client);
    } catch (error) {
      return response.status(400).json({ message: (error as Error).message });
    }
  }

  async update(request: Request, response: Response) {
    try {
      const dto = ClientRequestDto.fromRequest(request);
      const idResult = dto.getId();
      if (!idResult.success) {
        return response.status(idResult.status ?? 400).json({ message: idResult.message });
      }

      const payload = dto.toUpdateInput();
      if (!payload.success) {
        return response.status(payload.status ?? 400).json({ message: payload.message });
      }

      const client = await this.clientService.update(idResult.data, payload.data);
      return response.json(client);
    } catch (error) {
      return response.status(400).json({ message: (error as Error).message });
    }
  }

  async delete(request: Request, response: Response) {
    try {
      const dto = ClientRequestDto.fromRequest(request);
      const idResult = dto.getId();
      if (!idResult.success) {
        return response.status(idResult.status ?? 400).json({ message: idResult.message });
      }

      await this.clientService.delete(idResult.data);
      return response.status(204).send();
    } catch (error) {
      return response.status(404).json({ message: (error as Error).message });
    }
  }

  async patch(request: Request, response: Response) {
    try {
      const dto = ClientRequestDto.fromRequest(request);
      const idResult = dto.getId();
      if (!idResult.success) {
        return response.status(idResult.status ?? 400).json({ message: idResult.message });
      }

      const payload = dto.toUpdateInput();
      if (!payload.success) {
        return response.status(payload.status ?? 400).json({ message: payload.message });
      }

      const client = await this.clientService.update(idResult.data, payload.data);
      return response.json(client);
    } catch (error) {
      return response.status(400).json({ message: (error as Error).message });
    }
  }
}

export { ClientController };