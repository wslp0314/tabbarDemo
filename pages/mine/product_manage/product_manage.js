const app = getApp();
var util = require('../../../utils/util.js');
Page({
  data: {
    demoData: [
      {
        username:"",
        templateName:"",
        canActivate:"",
        terminalLimit:"",
        availableTerminalLimit: "",
        activatedCount: "",
      },
    ]
  },
  onLoad: function () {
    this.setData({
      demoData:app.globalData.productList,
    });
  },

   //更新本页面
   go_update(){
    console.log('我更新啦')
    this.getUserProductInfoOrPlanInfo();
  },

  //点击行
  onItemClick: function (event) {
    console.log("刘璞");
      wx.navigateTo({
        url: '../product_manage/product_change/product_change'+"?brandId="+event.currentTarget.dataset.url,
    })
  },



//获取用户绑定品牌/方案列表
 getUserProductInfoOrPlanInfo:function (){

  wx.showToast({
    title: '加载列表...',
    icon: 'loading'
  });

  util.get(app.globalData.testUrl + "partners/"+app.globalData.userInfo.id+"/brand/relation").then((res) => {
    console.log(res);
    if (res == null ) {
      console.error("god bless you...");
      return;
      }
      var tempItem = res.data[0];
      
      app.globalData.productList = res.data;
      this.setData({
        demoData:app.globalData.productList,
      });
  }).catch((errMsg) => {
    if (Object.prototype.toString.call(errMsg) === '[object String]') {
      wx.showToast({
        title: errMsg,
        icon: "none",
        duration:2000
      })
    }
  });
},



  anniu:function(){
    wx.navigateTo({
      url: '../product_manage/add_product/add_product'
  })
    // collect
    // var zhuijia = {demoTime: "2017-7-7", demoCon: '我是追加的测试代码'};
    // this.data.demoData.unshift(zhuijia);
    // this.setData({
    //   demoData: this.data.demoData
    // });
  }
})