import type { WebSocket } from "ws";

export type Connections = {
  [uuid: string]: WebSocket;
};

export type Client = {
  requestedType: "trees" | "fruits";
};

export type Clients = {
  [uuid: string]: Client;
};
