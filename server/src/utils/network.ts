import os from "node:os";

export const getNetworkUrls = (port: number): string[] => {
  const interfaces = os.networkInterfaces();
  const urls = new Set<string>();

  Object.values(interfaces).forEach((networkInterface) => {
    networkInterface?.forEach((address) => {
      if (address.family === "IPv4" && !address.internal) {
        urls.add(`http://${address.address}:${port}`);
      }
    });
  });

  return [...urls].sort();
};
