import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import perfectionist from "eslint-plugin-perfectionist";

export default [
  {
    languageOptions: {
      globals: globals.node,
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json',
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      perfectionist: perfectionist,
    },
    rules: {
      // Add custom rules or override recommended ones here
      "perfectionist/sort-objects": ["error", {
        type: "natural",
        order: "asc",
      }],
      "perfectionist/sort-imports": ["error", {
        type: "natural",
        order: "asc",
        'custom-groups': {
          value: {
            react: "react",
            fastify: "fastify",
            "fastify-plugins": "@fastify/**",
            internal: "{components,lib,pages,hooks,utils,types,services,repository,controllers,auth,db,errors,logger,routes,seed}/**",
          },
        },
        groups: [
          "type",
          "react",
          "fastify",
          "fastify-plugins",
          "internal",
          "external",
          "builtin",
          "object",
          "unknown",
        ],
      }],
      "indent": ["error", 2], // 2-space indentation
      "linebreak-style": ["error", "unix"],
      "quotes": ["error", "single"],
      "semi": ["error", "always"],
    },
  },
  {
    // Ignore build output and node_modules
    ignores: ["dist/", "node_modules/", "src/frontend.tsx", "src/APITester.tsx"],
  },
];
