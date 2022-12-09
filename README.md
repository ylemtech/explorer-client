# explorer-client

## sumary
```
本项目是一个electron客户端和网站的混合项目。
electron客户端是一个套壳网站。

网站：
网站后端代码为：explorer-server，所需的js、css、html资源通过本项目编译。
编译命令为：npm run build
生成结果位于dist目录中，直接复制到explorer-server的static目录。
然后将其中的index.html的内容，复制views的index.tpl中。
在index.tpl中，前后追加{{define "index.tpl"}} {{end}}。

electron：
运行调试： npm run electron:serve
mac打包： npm run electron:build
win打包： npm run electron:buildwin
```

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Vue UI
```
link:https://element.eleme.cn/#/zh-CN/component/installation
```

### Electron Install
```
vue add electron-builder

//npm i electron -g

生成background.js
```

### Electron Command
```
// 运行命令：
npm run electron:serve
// 按照当前系统的构建命令：
npm run electron:build
// 按照windows系统的构建命令：
npm run electron:build

构建时如下需翻墙，可以如下：
下载electron-v13.6.9-darwin-x64.zip,electron-v13.6.9-win32-ia32.zip
放在/Users/wangzebin/Library/Caches/electron下

link:https://juejin.cn/post/6844904122026573831
```

### 跨域问题
```
const win = new BrowserWindow({
  webPreferences: {
    webSecurity: false // remove security
  }
}
```

### Electron Router
```
位于/router的index.js文件中
部署网站需要:
mode: 'history'

部署electron:
mode: 'hash',需要#分割

如果不正确会导致白屏
link:https://www.pudn.com/news/6364e576a4b7e43a5e37a2c3.html
```

### Vue 全局变量
```
定义：
/utils/config.js
var website = "http://192.168.3.25:9000"
export default website

使用：
import website from "../utils/config"

export/export default 区别
link:https://blog.csdn.net/weixin_46129834/article/details/106425246
```

### web3.js
```
link:https://learnblockchain.cn/docs/web3.js/web3-utils.html#hextoascii
```

### Electron Bulid
```
npm config edit
electron_mirror=https://npm.taobao.org/mirrors/electron/
electron-builder-binaries_mirror=https://npm.taobao.org/mirrors/electron-builder-binaries/
```
