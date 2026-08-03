import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import pluginUnusedImports from "eslint-plugin-unused-imports";

export default [
  {
    files: [
      "src/components/**/*.{js,mjs,cjs,jsx}",
      "src/pages/**/*.{js,mjs,cjs,jsx}",
      // src/lib = les moteurs (activation des programmes, coaching, douleur,
      // traductions…). Ils n'étaient PAS vérifiés du tout jusqu'ici.
      "src/lib/**/*.{js,mjs,cjs,jsx}",
      "src/Layout.jsx",
    ],
    // src/components/ui = composants générés (shadcn), on ne les corrige pas.
    ignores: ["src/components/ui/**/*"],
    ...pluginJs.configs.recommended,
    ...pluginReact.configs.flat.recommended,
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    plugins: {
      react: pluginReact,
      "react-hooks": pluginReactHooks,
      "unused-imports": pluginUnusedImports,
    },
    rules: {
      "no-unused-vars": "off",
      "react/jsx-uses-vars": "error",
      "react/jsx-uses-react": "error",
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
        },
      ],
      "react/prop-types": "off",
      "react/react-in-jsx-scope": "off",
      "react/no-unknown-property": [
        "error",
        { ignore: ["cmdk-input-wrapper", "toast-close"] },
      ],
      "react-hooks/rules-of-hooks": "error",
      // Détecte la lecture d'une variable avant sa déclaration. C'est ce qui a
      // planté toute la page Accueil (« Cannot access 'X' before initialization »)
      // sans qu'aucun outil ne le signale. En avertissement : la majorité des cas
      // existants sont inoffensifs (variable lue dans une fonction appelée plus
      // tard) — ce qui compte, c'est de VOIR les nouveaux.
      "no-use-before-define": [
        "warn",
        { variables: true, functions: false, classes: false },
      ],
    },
  },
];
