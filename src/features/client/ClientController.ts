import { Request, Response } from "express";
import { JsonResponse } from "../../shared/http/JsonResponse.js";
import { ClientService } from "./ClientService.js";
import { ClientRequestDto } from "./ClientRequestDto.js";

class ClientController {
  private readonly clientService = new ClientService();

  async create(request: Request, response: Response) {
    const responder = JsonResponse.using(response);
    try {
      const dto = ClientRequestDto.fromRequest(request);
      const payload = dto.toCreateInput();
      if (!payload.success) {
        return responder.fromValidation(payload);
      }

      const client = await this.clientService.create(payload.data);

      return responder.created(client);
    } catch (error) {
      return responder.error((error as Error).message);
    }
  }

  async update(request: Request, response: Response) {
    const responder = JsonResponse.using(response);
    try {
      const dto = ClientRequestDto.fromRequest(request);
      const uuidResult = dto.getUuid();
      if (!uuidResult.success) {
        return responder.fromValidation(uuidResult);
      }

      const payload = dto.toUpdateInput();
      if (!payload.success) {
        return responder.fromValidation(payload);
      }

      const client = await this.clientService.updateByUuid(uuidResult.data, payload.data);
      return responder.success(client);
    } catch (error) {
      return responder.error((error as Error).message);
    }
  }

  async delete(request: Request, response: Response) {
    const responder = JsonResponse.using(response);
    try {
      const dto = ClientRequestDto.fromRequest(request);
      const uuidResult = dto.getUuid();
      if (!uuidResult.success) {
        return responder.fromValidation(uuidResult);
      }

      const deletedUuid = await this.clientService.deleteByUuid(uuidResult.data);
      return responder.success({ message: `Cliente com UUID ${deletedUuid} foi deletado com sucesso` });
    } catch (error) {
      return responder.error((error as Error).message, { status: 404 });
    }
  }

  async patch(request: Request, response: Response) {
    const responder = JsonResponse.using(response);
    try {
      const dto = ClientRequestDto.fromRequest(request);
      const uuidResult = dto.getUuid();
      if (!uuidResult.success) {
        return responder.fromValidation(uuidResult);
      }

      const payload = dto.toUpdateInput();
      if (!payload.success) {
        return responder.fromValidation(payload);
      }

      const client = await this.clientService.updateByUuid(uuidResult.data, payload.data);
      return responder.success(client);
    } catch (error) {
      return responder.error((error as Error).message);
    }
  }

  async getAll(request: Request, response: Response) {
    const responder = JsonResponse.using(response);
    try {
      const clients = await this.clientService.findAll();
      return responder.success(clients);
    } catch (error) {
      return responder.error((error as Error).message);
    }
  }

  async getById(request: Request, response: Response) {
    const responder = JsonResponse.using(response);
    try {
      const dto = ClientRequestDto.fromRequest(request);
      const uuidResult = dto.getUuid();
      if (!uuidResult.success) {
        return responder.fromValidation(uuidResult);
      }

      const client = await this.clientService.findByUuid(uuidResult.data);
      if (!client) {
        return responder.error("Cliente não encontrado", { status: 404 });
      }

      return responder.success(client);
    } catch (error) {
      return responder.error((error as Error).message);
    }
  }
}

export { ClientController };