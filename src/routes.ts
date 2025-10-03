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
const brandController = new BrandController();
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

router.get("/users", userController.getAll.bind(userController));
router.get("/users/:id", userController.getById.bind(userController));

router.post("/products", productController.create.bind(productController));
router.put("/products/:id", productController.update.bind(productController));
router.delete("/products/:id", productController.delete.bind(productController));
router.patch("/products/:id", productController.patch.bind(productController));

router.get("/products", productController.getAll.bind(productController));
router.get("/products/:id", productController.getById.bind(productController));

router.post("/categories", categoryController.create.bind(categoryController));
router.put("/categories/:id", categoryController.update.bind(categoryController));
router.delete("/categories/:id", categoryController.delete.bind(categoryController));
router.patch("/categories/:id", categoryController.patch.bind(categoryController));

router.get("/categories", categoryController.getAll.bind(categoryController));
router.get("/categories/:id", categoryController.getById.bind(categoryController));

router.post("/brands", brandController.create.bind(brandController));
router.put("/brands/:id", brandController.update.bind(brandController));
router.delete("/brands/:id", brandController.delete.bind(brandController));
router.patch("/brands/:id", brandController.patch.bind(brandController));

router.get("/brands", brandController.getAll.bind(brandController));
router.get("/brands/:id", brandController.getById.bind(brandController));

router.post("/sales", salesController.create.bind(salesController));
router.put("/sales/:id", salesController.update.bind(salesController));
router.delete("/sales/:id", salesController.delete.bind(salesController));
router.patch("/sales/:id", salesController.patch.bind(salesController));

router.get("/sales", salesController.getAll.bind(salesController));
router.get("/sales/:id", salesController.getById.bind(salesController));

router.post("/clients", clientController.create.bind(clientController));
router.put("/clients/:id", clientController.update.bind(clientController));
router.delete("/clients/:id", clientController.delete.bind(clientController));
router.patch("/clients/:id", clientController.patch.bind(clientController));

router.get("/clients", clientController.getAll.bind(clientController));
router.get("/clients/:id", clientController.getById.bind(clientController));

export { router };
