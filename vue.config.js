const isProd = process.env.NODE_ENV === 'production' // 是否生产环境

let externals = {
  'vue': 'Vue',
  'vue-router': 'VueRouter',
  'element-ui': 'ElementUI',
  'echarts': 'echarts',
  '@wangeditor/editor-for-vue':'window.wangEditor'
}

let cdn = {
  css: [
    // element-ui css
    'https://unpkg.com/element-ui/lib/theme-chalk/index.css',// 样式表
    'https://unpkg.com/@wangeditor/editor@latest/dist/css/style.css'
  ],
  js: [
    // vue must at first!
    'https://unpkg.com/vue/dist/vue.js', // vuejs
    'https://cdn.bootcdn.net/ajax/libs/vue-router/4.4.0/vue-router.cjs.min.js',
    'https://cdn.jsdelivr.net/npm/echarts@5.5.1/dist/echarts.min.js',
    // element-ui js
    'https://unpkg.com/element-ui/lib/index.js', // elementUI
    'https://unpkg.com/@wangeditor/editor@latest/dist/index.js'
  ]
}


cdn = isProd ? cdn : { css: [], js: [] }
externals = isProd ? externals : {}


module.exports = {
  // 添加打包排除，说明以下配置中的包将来不会打包到项目中
  configureWebpack: {
    externals
  },
  // 
  chainWebpack(config) {
    //利用自带的html插件配置，用于HTML文件根据不同环境使用不同的资源或样式
    config.plugin('html').tap(args => {
      //CDN链接
      args[0].cdn = cdn
      //当前环境状态变量
      args[0].isProd=isProd
      return args
    })
  }
}


