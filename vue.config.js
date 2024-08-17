const { defineConfig } = require("@vue/cli-service");
const AutoImport = require('unplugin-auto-import/webpack')
const Components = require('unplugin-vue-components/webpack')
const { ElementPlusResolver } = require('unplugin-vue-components/resolvers')

const unocss = require('@unocss/webpack').default

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    plugins: [
      new unocss(),
      AutoImport({
        include: [
          /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
          /\.vue$/,
          /\.vue\?vue/, // .vue
          /\.md$/ // .md
        ],
        imports: [
          'vue',
          'vue-router',
          // 可额外添加需要 autoImport 的组件
          {
            // '@/hooks/web/useI18n': ['useI18n'],
            // '@/hooks/web/useMessage': ['useMessage'],
            // '@/hooks/web/useTable': ['useTable'],
            // '@/hooks/web/useCrudSchemas': ['useCrudSchemas'],
            // '@/utils/formRules': ['required'],
            // '@/utils/dict': ['DICT_TYPE'],
          }
        ],
        dts: 'src/types/auto-imports.d.ts',
        resolvers: [ElementPlusResolver()],
        eslintrc: {
          // 先改成 true 生成文件，再改回 false
          enabled: false, // Default `false`
          filepath: './.eslintrc-auto-import.json', // Default `./.eslintrc-auto-import.json`
          globalsPropValue: true // Default `true`, (true | false | 'readonly' | 'readable' | 'writable' | 'writeable')
        }
      }),
      Components({
        // 生成自定义 `auto-components.d.ts` 全局声明
        dts: 'src/types/auto-components.d.ts',
        // 自定义组件的解析器
        resolvers: [ElementPlusResolver()],
        globs: ["src/components/**/**.{vue, md}", '!src/components/DiyEditor/components/mobile/**']
      }),
    ],
    resolve: { extensions: [".ts", ".tsx", ".js", ".json"] },   // 添加 .ts 和 .tsx 文件的解析 解决导入问题
    module: {
      rules: [
        // ...其他加载器配置

        // TypeScript 加载器配置
        {
          test: /\.ts$/,
          loader: 'ts-loader',
          options: {
            appendTsSuffixTo: [/\.vue$/],
            transpileOnly: true,  // 这个选项会跳过类型检查,只进行 TypeScript 到 JavaScript 的转换,从而加快编译速度。
          },
          exclude: [/node_modules/]
        },
      ],
    },
    entry: './src/main.ts',   // 指定入口文件
  },
  devServer: {
    client: {
        overlay: false,
    },
  },
});
