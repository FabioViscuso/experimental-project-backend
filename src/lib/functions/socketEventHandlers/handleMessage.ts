import type { RawData } from "ws";

export const handleMessage = (bytes: RawData, uuid: string) => {
  const message = JSON.parse(bytes.toString());
};
