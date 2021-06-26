import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

// import * as appInsights from 'applicationinsights'
// appInsights.setup().start()
import app from "./app";

import { createServer } from "http";

/**
 * Normalize a port into a number, string, or false.
 */

export function normalizePort(val: string): string | number {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return "";
}

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.PORT || "3600");
app.set("port", port);

/**
 * Create HTTP server.
 */

const server = createServer(app);

function listen() {
  if (app.get("env") === "test") return;
  server.listen(port, Number.MAX_SAFE_INTEGER, () => {
    console.log(`Running on port:${port}`);
  });
}

function connect() {
  console.info(` MONGODB_URL = ${process.env.MONGODB_URL}`);
  const testOption = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "test",
  };
  mongoose.connection
    .on("error", console.log)
    .on("disconnected", connect)
    .once("open", listen);
  return mongoose.connect(process.env.MONGODB_URL!, testOption);
}

/**
 * Listen on provided port, on all network interfaces.
 */
async function main() {
  /* eslint-disable */
  setInterval(
    function() {
      console.info(new Date());
      console.log(process.memoryUsage()); 
    },  
  60 * 1000);

  connect();
  
}

main();
