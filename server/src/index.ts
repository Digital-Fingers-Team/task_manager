import cors from "cors";
import express from "express";
import helmet from "helmet";

import { connectDatabase, disconnectDatabase } from "./config/database";
import { env } from "./config/env";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";
import { authRouter } from "./routes/authRoutes";
import { taskRouter } from "./routes/taskRoutes";
import { getNetworkUrls } from "./utils/network";

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.clientOrigin === "*" ? true : env.clientOrigin,
    credentials: true
  })
);
app.use(express.json({ limit: "1mb" }));

app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    service: "tasks-manager-api"
  });
});

app.use("/api/auth", authRouter);
app.use("/api/tasks", taskRouter);
app.use(notFoundHandler);
app.use(errorHandler);

const startServer = async (): Promise<void> => {
  try {
    await connectDatabase();

    const host = "0.0.0.0";
    const server = app.listen(env.port, host, () => {
      const localUrl = `http://localhost:${env.port}`;
      const networkUrls = getNetworkUrls(env.port);

      console.log(`API server listening on ${host}:${env.port}`);
      console.log(`Local:   ${localUrl}`);

      if (networkUrls.length > 0) {
        networkUrls.forEach((url) => {
          console.log(`Network: ${url}`);
        });
        console.log(`Mobile API URL example: ${networkUrls[0]}/api`);
      } else {
        console.log("Network: no external IPv4 address found");
      }
    });

    const shutdown = async (signal: string): Promise<void> => {
      console.log(`${signal} received. Shutting down API server.`);
      server.close(async () => {
        await disconnectDatabase();
        process.exit(0);
      });
    };

    process.on("SIGINT", () => {
      void shutdown("SIGINT");
    });
    process.on("SIGTERM", () => {
      void shutdown("SIGTERM");
    });
  } catch (error) {
    console.error("Failed to start API server:", error);
    process.exit(1);
  }
};

void startServer();
