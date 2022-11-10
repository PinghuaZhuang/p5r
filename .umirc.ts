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
  links: [
    {
      rel: 'stylesheet',
      href: '/global.css',
    },
  ],
});
