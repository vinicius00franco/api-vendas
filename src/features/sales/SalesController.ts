import { Request, Response } from "express";
import { SalesService, type CreateSaleInput, type UpdateSaleInput } from "./SalesService.js";

class SalesController {
  private readonly salesService = new SalesService();

  async create(request: Request, response: Response) {
    const { value, discount, productId, clientId } = request.body;
    try {
      const payload: CreateSaleInput = {
        value: Number(value),
        productId: Number(productId),
        clientId: Number(clientId),
      };

      if (Number.isNaN(payload.value) || Number.isNaN(payload.productId) || Number.isNaN(payload.clientId)) {
        return response.status(400).json({ message: "Dados da venda inválidos" });
      }

      if (discount !== undefined) {
        const numericDiscount = Number(discount);
        if (Number.isNaN(numericDiscount)) {
          return response.status(400).json({ message: "Desconto inválido" });
        }
        payload.discount = numericDiscount;
      }

      const sale = await this.salesService.create(payload);

      return response.status(201).json(sale);
    } catch (error) {
      return response.status(400).json({ message: (error as Error).message });
    }
  }

  async update(request: Request, response: Response) {
    const { id } = request.params;
    const { value, discount, productId, clientId } = request.body;
    try {
      const payload: UpdateSaleInput = {};
      if (value !== undefined) payload.value = Number(value);
      if (discount !== undefined) payload.discount = Number(discount);
      if (productId !== undefined) payload.productId = Number(productId);
      if (clientId !== undefined) payload.clientId = Number(clientId);

      if (payload.value !== undefined && Number.isNaN(payload.value)) {
        return response.status(400).json({ message: "Valor inválido" });
      }
      if (payload.discount !== undefined && Number.isNaN(payload.discount)) {
        return response.status(400).json({ message: "Desconto inválido" });
      }
      if (payload.productId !== undefined && Number.isNaN(payload.productId)) {
        return response.status(400).json({ message: "Produto inválido" });
      }
      if (payload.clientId !== undefined && Number.isNaN(payload.clientId)) {
        return response.status(400).json({ message: "Cliente inválido" });
      }

      if (Object.keys(payload).length === 0) {
        return response.status(400).json({ message: "Nenhum dado informado para atualização" });
      }

      const sale = await this.salesService.update(Number(id), payload);
      return response.json(sale);
    } catch (error) {
      return response.status(400).json({ message: (error as Error).message });
    }
  }

  async delete(request: Request, response: Response) {
    const { id } = request.params;
    try {
      await this.salesService.delete(Number(id));
      return response.status(204).send();
    } catch (error) {
      return response.status(404).json({ message: (error as Error).message });
    }
  }

  async patch(request: Request, response: Response) {
    const { id } = request.params;
    const updates = request.body;
    try {
      const payload: UpdateSaleInput = {};
      if (updates.value !== undefined) payload.value = Number(updates.value);
      if (updates.discount !== undefined) payload.discount = Number(updates.discount);
      if (updates.productId !== undefined) payload.productId = Number(updates.productId);
      if (updates.clientId !== undefined) payload.clientId = Number(updates.clientId);

      if (payload.value !== undefined && Number.isNaN(payload.value)) {
        return response.status(400).json({ message: "Valor inválido" });
      }
      if (payload.discount !== undefined && Number.isNaN(payload.discount)) {
        return response.status(400).json({ message: "Desconto inválido" });
      }
      if (payload.productId !== undefined && Number.isNaN(payload.productId)) {
        return response.status(400).json({ message: "Produto inválido" });
      }
      if (payload.clientId !== undefined && Number.isNaN(payload.clientId)) {
        return response.status(400).json({ message: "Cliente inválido" });
      }

      if (Object.keys(payload).length === 0) {
        return response.status(400).json({ message: "Nenhum dado informado para atualização" });
      }

      const sale = await this.salesService.update(Number(id), payload);
      return response.json(sale);
    } catch (error) {
      return response.status(400).json({ message: (error as Error).message });
    }
  }
}

export { SalesController };