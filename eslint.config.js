import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import perfectionist from 'eslint-plugin-perfectionist';

export default [
  {
    languageOptions: {
      globals: globals.node,
      parser: tseslint.parser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: 'latest',
        project: './tsconfig.json',
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
      // Configure no-unused-vars to ignore prefixed variables
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          'argsIgnorePattern': '^_',
          'caughtErrorsIgnorePattern': '^_',
          'varsIgnorePattern': '^_'
        }
      ],
      // Temporarily commenting out sort-imports due to persistent configuration issues
      /*
      "perfectionist/sort-imports": ["error", {
        type: "natural",
        order: "asc",
        customGroups: {
          "react-group": ["react"],
          "fastify-group": ["fastify"],
          "fastify-plugins-group": ["@fastify/**"],
          "internal-group": ["{components,lib,pages,hooks,utils,types,services,repository,controllers,auth,db,errors,logger,routes,seed}/**"],
        },
        groups: [
          "type",
          "react-group",
          "fastify-group",
          "fastify-plugins-group",
          "internal-group",
          "external",
          "builtin",
          "object",
          "unknown",
        ],
      }],
      */
      'indent': ['error', 2], // 2-space indentation
      'linebreak-style': ['error', 'unix'],
      // Add custom rules or override recommended ones here
      'perfectionist/sort-objects': ['error', {
        order: 'asc',
        type: 'natural',
      }],
      'quotes': ['error', 'single'],
      'semi': ['error', 'always'],
    },
  },
  {
    // Override for declaration files to ignore unused imports
    files: ['**/*.d.ts'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },
  {
    // Ignore build output and node_modules
    ignores: ['dist/', 'node_modules/', 'src/frontend.tsx', 'src/APITester.tsx'],
  },
];
