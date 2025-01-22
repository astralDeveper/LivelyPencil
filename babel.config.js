module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module:react-native-dotenv",
        {
          envName: "APP_ENV",
          moduleName: "@env",
          path: ".env",
        },
      ],
      [
        "module-resolver",
        {
          alias: {
            app: "./app",
            assets: "./app/assets",
            components: "./app/components",
            screens: "./app/screens",
            shared: "./app/shared",
            store: "./app/store",
          },
        },
      ],
      "nativewind/babel",
      "@babel/plugin-proposal-export-namespace-from",
      "react-native-reanimated/plugin",
    ],
  };
};
