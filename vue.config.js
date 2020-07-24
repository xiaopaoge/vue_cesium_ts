/* eslint-disable @typescript-eslint/no-var-requires */
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
// const path = require('path');
// const CompressionPlugin = require('compression-webpack-plugin');

// function resolve(dir) {
//   return path.join(__dirname, './', dir);
// }

// const { openGzip } = require('./package.json');

// All configuration item explanations can be find in https://cli.vuejs.org/config/
module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  outputDir: 'dist',
  lintOnSave: true,
  productionSourceMap: false,
  css: {
    loaderOptions: {
      scss: {
        prependData: `
        @import "@/styles/variables.scss";
        @import "@/styles/mixin.scss";
        `,
      },
    },
  },
  configureWebpack: (config) => {
    if (process.env.NODE_ENV === 'production') {
      // 为生产环境修改配置...
      config.mode = 'production';
    } else {
      // 为开发环境修改配置...
      config.mode = 'development';
      config.devtool = 'source-map'; // 开发环境显示源码，方便调试
    }
    config.plugins = [
      ...config.plugins,
      new CopyWebpackPlugin({
        patterns: [
          {
            from: 'node_modules/cesium/Build/Cesium/Workers',
            to: 'cesium/Workers',
          },
        ],
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: 'node_modules/cesium/Build/Cesium/ThirdParty',
            to: 'cesium/ThirdParty',
          },
        ],
      }),
      new CopyWebpackPlugin({
        patterns: [{ from: 'node_modules/cesium/Build/Cesium/Assets', to: 'cesium/Assets' }],
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: 'node_modules/cesium/Build/Cesium/Widgets',
            to: 'cesium/Widgets',
          },
        ],
      }),
      new webpack.DefinePlugin({
        // Define relative base path in cesium for loading assets
        CESIUM_BASE_URL: JSON.stringify('./cesium'),
      }),
    ];
  },
  chainWebpack: (config) => {
    config.plugin('preload').tap(() => [
      {
        rel: 'preload',
        fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
        include: 'initial',
      },
    ]);
    // 修复HMR（热更新）失效
    config.resolve.symlinks(true);

    // 移除prefetch插件
    config.plugins.delete('prefetch');

    // 程序入口
    // config.plugin('html').tap((args) => {
    //   args[0].template = process.env.template;
    //   return args;
    // });

    // 开发环境下，保存时通过eslint自动格式化
    //   config.module
    //     .rule('eslint')
    //     .use('eslint-loader')
    //     .loader('eslint-loader')
    //     .tap((options) => {
    //       options.fix = true;
    //       return options;
    //     });
    // },
  },
};