import { defineConfig } from 'dumi';

const publicPath = process.env.NODE_ENV === 'production' ? '/p5r/' : '/';

// more config: https://d.umijs.org/config
export default defineConfig({
  title: 'P5R',
  mode: 'doc',
  locales: [['zh-CN', '中文']],
  publicPath,
  base: publicPath,
  exportStatic: {},
  logo: `${publicPath}assets/logo.png`,
  links: [
    {
      rel: 'stylesheet',
      href: `${publicPath}global.css`,
    },
  ],
  extraBabelPlugins: [
    [
      'babel-plugin-import',
      {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true,
      },
      'antd',
    ],
  ],
});
