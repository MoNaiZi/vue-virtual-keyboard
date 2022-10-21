// const { defineConfig } = require('@vue/cli-service')
module.exports = {
  // configureWebpack: config => {
  //   config.module.rules.push({
  //     test: /\.worker.js$/,
  //     use: {
  //       loader: 'worker-loader',
  //       // 允许将内联的 web worker 作为 BLOB
  //     },
  //   })
  // },
  parallel: false, // 打包报错的配置
  publicPath: process.env.NODE_ENV === 'production'
    ? './'
    : '/'
}
