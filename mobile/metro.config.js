const path = require("path");
const fs = require("fs");

const { getDefaultConfig } = require("expo/metro-config");

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, "..");
const config = getDefaultConfig(projectRoot);
const projectNodeModules = path.resolve(projectRoot, "node_modules");
const workspaceNodeModules = path.resolve(workspaceRoot, "node_modules");

config.watchFolders = [path.resolve(workspaceRoot, "node_modules")];
config.resolver.nodeModulesPaths = [projectNodeModules, workspaceNodeModules];
config.resolver.disableHierarchicalLookup = true;
config.resolver.unstable_enableSymlinks = true;
config.resolver.extraNodeModules = new Proxy(
  {},
  {
    get: (_target, moduleName) => {
      const name = String(moduleName);
      const projectPath = path.join(projectNodeModules, name);

      if (fs.existsSync(projectPath)) {
        return projectPath;
      }

      return path.join(workspaceNodeModules, name);
    }
  }
);

module.exports = config;
