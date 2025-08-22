import { Router } from "express";
import { CreateUserController } from "./controller/user/CreateUserController";

const createUserController  = new CreateUserController();

const router = Router();
router.post("/users", createUserController.handle);

export {router}