import parser from "eslint-parser-oxc";
import globals from "globals";
import js from "@eslint/js";

export default {
    configs: {
        language: {
            globals: { ...globals.node },
            parser: parser
        },
        recommended: {
            ...js.configs.recommended.rules,
            "indent": ["error", 4, {
                "SwitchCase": 1,
                "ignoredNodes": [
                    "FunctionExpression > .params[decorators.length > 0]",
                    "FunctionExpression > .params > :matches(Decorator, :not(:first-child))",
                    "ClassBody.body > PropertyDefinition[decorators.length > 0] > .key",
                ],
            }],
            "linebreak-style": ["error", "unix"],
            "quotes": ["error", "double", { "allowTemplateLiterals": true }],
            "semi": ["error", "always"],
            "no-unused-vars": "off", /* this is disabled as a tradeoff for using the oxc parser */
        },
        plugins: {}
    }
};