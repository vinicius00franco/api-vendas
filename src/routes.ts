import { Router } from "express";
import { UserController } from "./features/user/index.js";
import { ProductController } from "./features/product/index.js";
import { CategoryController } from "./features/category/index.js";
import { BrandController } from "./features/brand/index.js";
import { SalesController } from "./features/sales/index.js";
import { ClientController } from "./features/client/index.js";
import { AuthController, ensureAuthenticated } from "./features/auth/index.js";

const userController = new UserController();
const productController = new ProductController();
const categoryController = new CategoryController();
const salesController = new SalesController();
const clientController = new ClientController();
const authController = new AuthController();

const router = Router();

router.post("/auth/login", authController.login);
router.post("/users", userController.create);

router.use(ensureAuthenticated);

router.put("/users/:id", userController.update.bind(userController));
router.delete("/users/:id", userController.delete.bind(userController));
router.patch("/users/:id", userController.patch.bind(userController));

router.post("/products", productController.create.bind(productController));
router.put("/products/:id", productController.update.bind(productController));
router.delete("/products/:id", productController.delete.bind(productController));
router.patch("/products/:id", productController.patch.bind(productController));

router.post("/categories", categoryController.create.bind(categoryController));
router.put("/categories/:id", categoryController.update.bind(categoryController));
router.delete("/categories/:id", categoryController.delete.bind(categoryController));
router.patch("/categories/:id", categoryController.patch.bind(categoryController));

router.post("/sales", salesController.create.bind(salesController));
router.put("/sales/:id", salesController.update.bind(salesController));
router.delete("/sales/:id", salesController.delete.bind(salesController));
router.patch("/sales/:id", salesController.patch.bind(salesController));

router.post("/clients", clientController.create.bind(clientController));
router.put("/clients/:id", clientController.update.bind(clientController));
router.delete("/clients/:id", clientController.delete.bind(clientController));
router.patch("/clients/:id", clientController.patch.bind(clientController));

export { router };
