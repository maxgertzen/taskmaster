import { Express } from "express";
import { Server } from "http";
import createApp from "@src/app";
import request from "supertest";
import { Socket } from "net";

let app: Express;
let server: Server | null;

export const setupTestServer = async () => {
  app = await createApp();
  server = app.listen(0);
  return app;
};

export const teardownTestServer = async () => {
  if (!server) return;

  const connections = new Set<Socket>();

  server.on("connection", (connection) => {
    connections.add(connection);
    connection.on("close", () => {
      connections.delete(connection);
    });
  });

  connections.forEach((connection) => connection.destroy());

  server.closeAllConnections();
  server.close();
  server = null;
};

export const makeRequest = () => {
  if (!app) {
    throw new Error("Test server not initialized");
  }
  return request(app);
};

export const getTestServer = () => {
  if (!server) {
    throw new Error("Test server not initialized");
  }
  return server;
};
