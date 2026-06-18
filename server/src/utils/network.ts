import os from "node:os";

interface NetworkUrl {
  interfaceName: string;
  url: string;
  priority: number;
}

const getInterfacePriority = (name: string): number => {
  const normalized = name.toLowerCase();

  if (
    normalized.includes("vmware") ||
    normalized.includes("virtual") ||
    normalized.includes("vethernet") ||
    normalized.includes("loopback") ||
    normalized.includes("default switch")
  ) {
    return 2;
  }

  if (normalized.includes("wi-fi") || normalized.includes("wifi")) {
    return 0;
  }

  if (normalized.includes("ethernet")) {
    return 1;
  }

  return 1;
};

export const getNetworkUrls = (port: number): string[] => {
  const interfaces = os.networkInterfaces();
  const urls = new Map<string, NetworkUrl>();

  Object.entries(interfaces).forEach(([interfaceName, networkInterface]) => {
    networkInterface?.forEach((address) => {
      if (address.family === "IPv4" && !address.internal) {
        const url = `http://${address.address}:${port}`;

        urls.set(url, {
          interfaceName,
          url,
          priority: getInterfacePriority(interfaceName)
        });
      }
    });
  });

  return [...urls.values()]
    .sort((left, right) => {
      if (left.priority !== right.priority) {
        return left.priority - right.priority;
      }

      return left.interfaceName.localeCompare(right.interfaceName);
    })
    .map((item) => item.url);
};
