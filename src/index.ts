import express from "express";
import cors from "cors";
// import axios from "axios";
// import path from "path";
// import fs from "fs";
// import { EXTERNALS_PATH, IMPORT_MAP_DEPLOYER_URL, PORT } from "./constants";
// import { Request } from "express";

const app = express();

app.use(cors());
app.use(express.json());

app.listen(5050, () => {
  console.log(`External libraries server running on port 5050`);
});
