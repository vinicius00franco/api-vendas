import { Router } from "express";
import { UserController } from "./controller/user/UserController";
import { ProductController } from "./controller/product/ProductController";
import { CategoryController } from "./controller/category/CategoryController";
import { SalesController } from "./controller/sales/SalesController";
import { ClientController } from "./controller/client/ClientController";

const userController = new UserController();
const productController = new ProductController();
const categoryController = new CategoryController();
const salesController = new SalesController();
const clientController = new ClientController();

const router = Router();

router.post("/users", userController.create);
router.put("/users/:id", userController.update);
router.delete("/users/:id", userController.delete);
router.patch("/users/:id", userController.patch);

router.post("/products", productController.create);
router.put("/products/:id", productController.update);
router.delete("/products/:id", productController.delete);
router.patch("/products/:id", productController.patch);

router.post("/categories", categoryController.create);
router.put("/categories/:id", categoryController.update);
router.delete("/categories/:id", categoryController.delete);
router.patch("/categories/:id", categoryController.patch);

router.post("/sales", salesController.create);
router.put("/sales/:id", salesController.update);
router.delete("/sales/:id", salesController.delete);
router.patch("/sales/:id", salesController.patch);

router.post("/clients", clientController.create);
router.put("/clients/:id", clientController.update);
router.delete("/clients/:id", clientController.delete);
router.patch("/clients/:id", clientController.patch);

export {router}