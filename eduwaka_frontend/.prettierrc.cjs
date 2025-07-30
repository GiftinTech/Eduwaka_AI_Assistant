// .prettierrc.cjs
/** @type {import("prettier").Config} */
const config = {
  trailingComma: "all",
  singleQuote: true,
  tabWidth: 2,
  semi: true,

  // This is how you add the plugin
  plugins: ["prettier-plugin-tailwindcss"],
};

module.exports = config;