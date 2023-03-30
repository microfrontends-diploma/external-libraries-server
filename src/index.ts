import "reflect-metadata";
import express from "express";
import cors from "cors";
import { container } from "tsyringe";
import { ExternalsController } from "./controllers/externals/index";
import { registerDI } from "./DI";

const PORT = process.argv[2] || "5050";

registerDI();
const app = express();

app.use(cors());
app.use(express.json());

app.post(
  "/update-externals",
  container.resolve(ExternalsController).updateExternals("mf-externals")
);

app.listen(PORT, () => {
  console.log(`External libraries server running on port ${PORT}`);
});
