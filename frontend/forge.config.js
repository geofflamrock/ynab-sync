module.exports = {
  packagerConfig: {
    ignore: "node_modules",
  },
  makers: [
    {
      name: "@electron-forge/maker-squirrel",
      config: {
        name: "ynab-sync",
      },
    },
    {
      name: "@electron-forge/maker-zip",
      platforms: ["darwin"],
    },
    {
      name: "@electron-forge/maker-deb",
      config: {},
    },
  ],
};
