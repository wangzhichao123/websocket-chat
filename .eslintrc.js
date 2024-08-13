module.exports = {
  root: false,
  env: {
    node: true,
  },
  extends: [
    "plugin:vue/vue3-essential",
    "eslint:recommended",
    "plugin:prettier/recommended",
    './.eslintrc-auto-import.json',
    
  ],
  // parse: 'babel-eslint',  // 错误的 parse
  // parser: '@typescript-eslint/parser',  // 解决 ts 报错
	parserOptions: { 
		"ecmaVersion": 2020, // 7
		"sourceType": "module",  // 这个选项指定了要解析的代码是以模块的形式。"module" 表示代码是按照 ECMAScript 模块的语法进行编写的。
    parser: "@typescript-eslint/parser",
	},
  // parserOptions: {
  //   parser: "@babel/eslint-parser",
  // },
  rules: {
    'prettier/prettier': 'off',
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    'no-unused-vars': 'off',
    "no-undef": "off",  // 允许未定义变量 ts 会检查
    'vue/multi-word-component-names': 'off',
  },
};
