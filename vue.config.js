const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      '/api/alarm': {
        target: 'http://localhost:8081',
        changeOrigin: true,
        pathRewrite: {
          '^/api/alarm': ''
        }
      },
      '/api/wardrobe': {
        target: 'http://localhost:8082',
        changeOrigin: true,
        pathRewrite: {
          '^/api/wardrobe': ''
        }
      },
      '/api/weather': {
        target: 'http://localhost:8083',
        changeOrigin: true,
        pathRewrite: {
          '^/api/weather': ''
        }
      }
    }
  }
})
