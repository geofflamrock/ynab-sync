/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  ignoredRouteFiles: ["**/.*"],
  serverBuildPath: "build/server/index.js",
  appDirectory: "app",
  assetsBuildDirectory: "public/build",
  // serverBuildPath: "build/index.js",
  serverDependenciesToBundle: [/.*/],
  publicPath: "/build/",
};
