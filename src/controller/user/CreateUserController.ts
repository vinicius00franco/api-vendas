import { Request, Response } from "express";
class CreateUserController {
  async handle(request: Request, response: Response) {
    const { name, email, admin, password } = request.body;
    const user = { name, email, admin, password };
    response.json({ message: "Usuário incluído com sucesso" });
  }
}
export { CreateUserController };