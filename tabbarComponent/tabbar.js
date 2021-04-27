// tabBarComponent/tabBar.js
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tabbar: {
      type: Object,
      value: {
        "backgroundColor": "#ffffff",
        "color": "#979795",
        "selectedColor": "#1c1c1b",
        "list": [
          {
            "pagePath": "/pages/index/index",
            "iconPath": "icon/icon_home.png",
            "selectedIconPath": "icon/icon_home_HL.png",
            "text": "首页"
          },
          {
            "pagePath": "/pages/middle/middle",
            "iconPath": "icon/icon_release.png",
            "isSpecial": true,
            "text": "激活"
          },
          {
            "pagePath": "/pages/mine/mine",
            "iconPath": "icon/icon_mine.png",
            "selectedIconPath": "icon/icon_mine_HL.png",
            "text": "我的"
          }
        ]
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isIphoneX: app.globalData.systemInfo.model.search('iPhone X') != -1 ? true : false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    scanview:function(){
      var that = this;
      if ( app.globalData.canActive) {
        wx.scanCode({
          onlyFromCamera: true,// 只允许从相机扫码
          success(res){
            console.log("扫码成功："+JSON.stringify(res))
            // 扫码成功后  在此处理接下来的逻辑
            app.globalData.scanCode = res.result;
            console.log(getCurrentPages());
            getCurrentPages()[0].onShow();
          }
        })
      } else {
        wx.showToast({
          title: "当前"+(app.globalData.userInfo.partnerType == 0?'品牌':'方案')+"无法激活设备",
          icon: "none"
        })
      }
      
    },
  },

  
})
