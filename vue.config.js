const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  configureWebpack: config => {
    config.module.rules.push({
      test: /\.worker.js$/,
      use: {
        loader: 'worker-loader',
        // 允许将内联的 web worker 作为 BLOB
        options: { inline: 'no-fallback' }
      },
    })
  },
  parallel: false, // 打包报错的配置
  transpileDependencies: true
})
