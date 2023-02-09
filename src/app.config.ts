export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/help/index',
    'pages/shanten/index',
    'pages/shanten/result/index',
    'pages/furoShanten/index',
    'pages/furoShanten/result/index',
    'pages/hora/index',
    'pages/hora/result/index',
    'pages/pointByHanHu/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    selectedColor: '#1296db',
    list: [
      {
        text: '首页',
        pagePath: 'pages/index/index',
        iconPath: 'assets/images/icons/home.png',
        selectedIconPath: 'assets/images/icons/home_selected.png'
      },
      {
        text: '帮助',
        pagePath: 'pages/help/index',
        iconPath: 'assets/images/icons/help.png',
        selectedIconPath: 'assets/images/icons/help_selected.png'
      }
    ]
  },
  "lazyCodeLoading": "requiredComponents"
})
