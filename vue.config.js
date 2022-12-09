const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true
})

module.exports = {
  pluginOptions:{
    electronBuilder:{
      customFileProtocol: "./",
      builderOptions:{
        "mac": {
          "icon": "./public/bst_explorer_icon.png",
        },
        "win": {
          "icon": "./public/bst_explorer_icon.png",
          // get top priority in os windows
          "requestedExecutionLevel": "highestAvailable",
        },
        // nsis: {
        //   oneClick: false,
        //   // permit changing installatio directory
        //   allowToChangeInstallationDirectory: true, 
        //   allowElevation: true,
        //   createDesktopShortcut: true,
        //   createStartMenuShortcut: true,
        //   shortcutName: 'Block Explorer'
        // }
      },
    } 
  }
}