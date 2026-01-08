
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');
const fs = require('fs');

// Helper: get all first-level subfolders of a folder
function getSubfolders(folderPath) {
  return fs.readdirSync(folderPath)
    .map(name => path.join(folderPath, name))
    .filter(f => fs.statSync(f).isDirectory());
}

// Recursively collect all nested subfolders
function getAllSubfolders(rootFolders) {
  const result = [];
  rootFolders.forEach(folder => {
    result.push(folder);
    const nested = getSubfolders(folder);
    if (nested.length) {
      result.push(...getAllSubfolders(nested));
    }
  });
  return result;
}

const config = getDefaultConfig(__dirname);
const packagesRoot = path.resolve(__dirname, '../../packages');

// Start from top-level packages/* (lib, ui, etc.)
const topLevelFolders = getSubfolders(packagesRoot);
const watchFolders = getAllSubfolders(topLevelFolders);

config.watchFolders = watchFolders;

// Optional: if you want a global `@` alias for all subpackages
config.resolver.extraNodeModules = {
  '@': path.resolve(__dirname, '../../packages/ig-game/ig-game-ui/src'),
};

module.exports = config;
