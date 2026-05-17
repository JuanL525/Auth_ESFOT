module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      ["module-resolver", { root: ["./src"], alias: { "@": "./src" } }],
      [
        "@tamagui/babel-plugin",
        {
          config: "./tamagui.config.ts",
          components: [
            "tamagui",
            "@tamagui/core",
            "@tamagui/button",
            "@tamagui/card",
            "@tamagui/dialog",
            "@tamagui/sheet",
            "@tamagui/stacks",
            "@tamagui/text",
            "@tamagui/input",
          ],
        },
      ],
      ["react-native-reanimated/plugin"],
    ],
  };
};
