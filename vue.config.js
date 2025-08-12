const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true
})

module.exports = {
  devServer: {
    proxy: {
      '/root': {
        changeOrigin: true,
        target: 'https://www.ylemscan.io',
        pathRewrite: {
          '^/root': ''
        },
      },
    }
  }
}