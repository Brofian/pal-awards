import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from "globals";

export default tseslint.config(
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    {
        // do not apply any rules to the generated dist directory
        ignores: ["dist/**/*"]
    },
    {
        // Apply this rule ONLY to files in the server directory: prevent importing from the client directory
        files: ["src/server/**/*.ts"],
        rules: {
            "@typescript-eslint/no-restricted-imports": ["error", {
                "patterns": [{
                    "group": ["**/client/*"],
                    "message": "You cannot import from 'src/client' into 'src/server'. Use 'src/shared' instead."
                }]
            }]
        }
    },
    {
        // Apply this rule ONLY to files in the client directory: prevent importing from the server directory
        files: ["src/client/**/*.{ts,tsx}"],
        rules: {
            "@typescript-eslint/no-restricted-imports": ["error", {
                "patterns": [{
                    "group": ["**/server/*"],
                    "message": "You cannot import from 'src/server' into 'src/client'. Use 'src/shared' instead."
                }]
            }]
        }
    },
    {
        // Apply this rule ONLY to files in the shared directory: prevent importing from the outside
        files: ["src/shared/**/*.{ts,tsx}"],
        rules: {
            "@typescript-eslint/no-restricted-imports": ["error", {
                "patterns": [{
                    "group": ["**/server/*", "**/client/*"],
                    "message": "You cannot import from the outside into 'src/shared'. Keep types and functions in 'src/shared' pure."
                }]
            }]
        }
    },
    {
        files: ["src/**/*.{ts,tsx}"],
        rules: {
            // disable default no-unused-vars rule to replace it with a custom one
            "no-unused-vars": "off",
            "@typescript-eslint/no-unused-vars": ["error", {
                // Check all variables, but ignore those starting with _
                // "varsIgnorePattern": "^_",

                // Check all arguments, but ignore those starting with _
                "args": "all",
                "argsIgnorePattern": "^_",

                // Ignore unused catch block variables starting with _
                "caughtErrorsIgnorePattern": "^_",

                // Useful for pulling members out of objects by deconstruction: const { password, ...userWithoutPassword } = user;
                "ignoreRestSiblings": true
            }
            ]
        }
    },
    {
        // Global settings
        languageOptions: {
            globals: {
                ...
                    globals.node, // Bun supports most Node globals
                Bun:
                    "readonly", // Specifically define the Bun global
                process:
                    "readonly",
            }
        }
    }
)
;