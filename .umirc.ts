import { defineConfig } from 'dumi';

// more config: https://d.umijs.org/config
export default defineConfig({
  title: 'P5R',
  mode: 'doc',
  locales: [['zh-CN', '中文']],
  publicPath: process.env.NODE_ENV === 'production' ? '/p5r/' : '/',
  base: process.env.NODE_ENV === 'production' ? '/p5r/' : '/',
});
