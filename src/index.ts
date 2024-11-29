import { WebSocketServer } from "ws";
import http from "http";
import * as URL from "url";
import { v4 as uuidv4 } from "uuid";
import { fruits, trees } from "./lib/data";
import type { Connections, Clients } from "./lib/types";
import { clearInterval } from "timers";

const server = http.createServer();
const webSocketServer = new WebSocketServer({ server });

const randomName = (array: string[]) => {
  const index = Math.floor(Math.random() * array.length);
  return array[index];
};

const connections: Connections = {};
const clients: Clients = {};

// Handle WebSocket connections
webSocketServer.on("connection", (connection, request) => {
  const uuid = uuidv4();
  const { type } = URL.parse(request?.url!, true)?.query;
  console.log(`\x1b[34m Requested data type: ${type}`);
  console.log(
    `\x1b[34m New client connected: Host ${request.headers.host} - Assigned UUID: ${uuid}`
  );

  connections[uuid] = connection;
  clients[uuid] = { requestedType: type as "trees" | "fruits" };
  console.log(
    `\x1b[34m Connections after new connection: ${JSON.stringify(
      Object.keys(connections)
    )}`
  );

  const autoBroadcast = setInterval(() => {
    const messageToSend = randomName(type === "trees" ? trees : fruits);
    console.log(`\x1b[34m Sending message: ${messageToSend} to ${uuid}`);
    connections[uuid]?.send(messageToSend);
  }, 3000);

  connection.on("message", (message) => {
    console.log(`Received message: ${message.toString()}`);
    connections[uuid].send(`${randomName(type === "trees" ? trees : fruits)}`);
  });

  connection.on("close", () => {
    delete connections[uuid];
    delete clients[uuid];
    clearInterval(autoBroadcast);
    console.log(`Client ${uuid} disconnected`);
    console.log(
      `\x1b[34m Connections after disconnection: ${Object.keys(connections)}`
    );
  });
});

// Start the server
const PORT = 8081;
server.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
});
