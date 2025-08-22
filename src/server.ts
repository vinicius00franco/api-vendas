import express from "express";
import { router } from "./routes";

const app = express();

app.use(express.json());

app.use(router);

console.log("Start at =>3000")
app.listen(3000);
