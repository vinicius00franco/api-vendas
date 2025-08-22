import { Router } from "express";
import { CreateUserController } from "./controller/user/CreateUserController";
import { UpdateUserController } from "./controller/user/UpdateUserController";
import { DeleteUserController } from "./controller/user/DeleteUserController";
import { PatchUserController } from "./controller/user/PatchUserController";
import { CreateProductController } from "./controller/product/CreateProductController";
import { UpdateProductController } from "./controller/product/UpdateProductController";
import { DeleteProductController } from "./controller/product/DeleteProductController";
import { PatchProductController } from "./controller/product/PatchProductController";
import { CreateCategoryController } from "./controller/category/CreateCategoryController";
import { UpdateCategoryController } from "./controller/category/UpdateCategoryController";
import { DeleteCategoryController } from "./controller/category/DeleteCategoryController";
import { PatchCategoryController } from "./controller/category/PatchCategoryController";
import { CreateSalesController } from "./controller/sales/CreateSalesController";
import { UpdateSalesController } from "./controller/sales/UpdateSalesController";
import { DeleteSalesController } from "./controller/sales/DeleteSalesController";
import { PatchSalesController } from "./controller/sales/PatchSalesController";
import { CreateClientController } from "./controller/client/CreateClientController";
import { UpdateClientController } from "./controller/client/UpdateClientController";
import { DeleteClientController } from "./controller/client/DeleteClientController";
import { PatchClientController } from "./controller/client/PatchClientController";

const createUserController = new CreateUserController();
const updateUserController = new UpdateUserController();
const deleteUserController = new DeleteUserController();
const patchUserController = new PatchUserController();
const createProductController = new CreateProductController();
const updateProductController = new UpdateProductController();
const deleteProductController = new DeleteProductController();
const patchProductController = new PatchProductController();
const createCategoryController = new CreateCategoryController();
const updateCategoryController = new UpdateCategoryController();
const deleteCategoryController = new DeleteCategoryController();
const patchCategoryController = new PatchCategoryController();
const createSalesController = new CreateSalesController();
const updateSalesController = new UpdateSalesController();
const deleteSalesController = new DeleteSalesController();
const patchSalesController = new PatchSalesController();
const createClientController = new CreateClientController();
const updateClientController = new UpdateClientController();
const deleteClientController = new DeleteClientController();
const patchClientController = new PatchClientController();

const router = Router();

router.post("/users", createUserController.handle);
router.put("/users/:id", updateUserController.handle);
router.delete("/users/:id", deleteUserController.handle);
router.patch("/users/:id", patchUserController.handle);

router.post("/products", createProductController.handle);
router.put("/products/:id", updateProductController.handle);
router.delete("/products/:id", deleteProductController.handle);
router.patch("/products/:id", patchProductController.handle);

router.post("/categories", createCategoryController.handle);
router.put("/categories/:id", updateCategoryController.handle);
router.delete("/categories/:id", deleteCategoryController.handle);
router.patch("/categories/:id", patchCategoryController.handle);

router.post("/sales", createSalesController.handle);
router.put("/sales/:id", updateSalesController.handle);
router.delete("/sales/:id", deleteSalesController.handle);
router.patch("/sales/:id", patchSalesController.handle);

router.post("/clients", createClientController.handle);
router.put("/clients/:id", updateClientController.handle);
router.delete("/clients/:id", deleteClientController.handle);
router.patch("/clients/:id", patchClientController.handle);

export {router}