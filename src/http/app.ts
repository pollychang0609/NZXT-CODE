/* istanbul ignore file */
import express from "express";
import { RegisterRoutes } from "./routes/routes";
import path from "path";
import fs from "fs";
import { initAuth, initSession } from "../service/authService";
import cfg from "../cfg";

const swaggerUi = require("swagger-ui-express");
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
//default for health check
app.get("/", function (req, res) {
  // console.info('====>OK')
  res.send("OK");
});

initSession(app);
initAuth(app);
bindRoutes();

if (process.env.NODE_ENV != "test") {
  bindStaticFiles();
}

function bindRoutes() {
  const router = express.Router();
  RegisterRoutes(router);
  app.use(router);
}

function bindStaticFiles() {
  const swagger_file_dev = path.join(__dirname, "../swagger.json");
  if (fs.existsSync(swagger_file_dev)) {
    const swaggerDocument = require(swagger_file_dev);
    app.use(cfg.API_DIR, swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  } else if ("development" === process.env.NODE_ENV) {
    const swaggerDevDocument = require(swagger_file_dev.replace(
      "/src/",
      "/build/"
    ));
    app.use(cfg.API_DIR, swaggerUi.serve, swaggerUi.setup(swaggerDevDocument));
  } else {
    console.error(
      `[npm run build-swagger] to generage swagger.json ${swagger_file_dev}`
    );
  }
}

export default app;
