// pages/mine/mine.js
var chart = require("../../utils/chart.js");
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    title: {
      "bg_color": "#54B8F6",
      "color": "#000",
      "name": "我的"
    },
    accountName:"",
    productName:"",
    productNum:"",
    activedNum:0,
    partnerType:0,
    phone:"",
    getRealNameShow: false,
    ellipsis: true,// 文字是否收起，默认收起

  },

  // 收起/展开按钮点击事件
  ellipsis() {
    if (this.data.activedNum == 0) {
      wx.showToast({
        title: "激活数量为 0",
        icon: "none"
      });
      return;
    }
    
    let that = this;
      app.globalData.hidePie = !that.data.ellipsis;
      that.createPie();
    that.setData({
      ellipsis: !that.data.ellipsis
    })

  },
  //创建饼图

  createPie : function () {
    var array = app.globalData.productList;
    console.log(array);
    var productList = [];
    var activedNum =[];
    for (let i = 0; i < array.length; i++) {
      if (array[i].activatedCount > 0) {
        productList.push(array[i].name);
        activedNum.push(array[i].activatedCount);
      }
    }
    chart.draw(this, 'canvas1', {
      title: {
        text: "激活视图",
        color: "#ffffff"
      },
      xAxis: {
        data: productList
      },
      series: [
        {
          name: productList,
          category: "pie",
          data: activedNum
        }
      ]
    });
  },


  //跳转品牌管理
  pushProductManage: function(){
    if (this.data.ellipsis == false) {
      this.ellipsis();
    }
    wx.navigateTo({
      url: '../mine/product_manage/product_manage'
  })
  },

  //联系客服
  callPhone: function () {
    if (this.data.ellipsis == false) {
      this.ellipsis();
    }
    wx.makePhoneCall({
      phoneNumber: '18611786263',
      success: function () {
        console.log("拨打电话成功！")
      },
      fail: function () {
        console.log("拨打电话失败！")
      }
    })
  },

  changepassword:function(){
    if (this.data.ellipsis == false) {
      this.ellipsis();
    }
    wx.navigateTo({
      url: '../mine/change_password/change_password'
  })
  },

  loginout:function(){
    if (this.data.ellipsis == false) {
      this.ellipsis();
    }
    //删除本地的  token  在请求一下接口
    wx.showModal({
      title: '退出登录',
      success (res) {
        
        if (res.confirm) {
          app.globalData.userInfo = null;
        wx.clearStorage();
        wx.switchTab({
          url: "/pages/index/index",
          success: function (e) {
            let page = getCurrentPages().pop();
            if (page == undefined || page == null) return;
                page.onLoad();
          }
        });

          console.log("点击了退出登录");
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.editTabbar();
    this.createPie();
  },


   /**
   * 生命周期函数--监听页面加载
   */

  onShow: function () {
    console.log("刘璞:   我的页面出现了");
    this.reloadProductList();
    this.changeViewNum();
    
  },

  changeViewNum () {
    console.log("刘璞:   changeViewNum出现了");

    var activedCount = 0;
    var array = app.globalData.productList;
    for (let i = 0; i < array.length; i++) {
      activedCount +=  array[i].activatedCount
    }
    this.data.activedNum = activedCount;
    this.setData({
      partnerType:app.globalData.userInfo.partnerType,
      productNum:app.globalData.productList.length,
      activedNum:activedCount,
      accountName:app.globalData.userInfo.username,
      productName:app.globalData.userInfo.corporation==null?"":app.globalData.userInfo.corporation,
    });
  },

  //激活方法
  requstActive:function (scanCode) {
    console.log("刘璞:   requstActive出现了");

    wx.showToast({
      title: '加载中',
      icon: 'loading'
    });
    // https://test.ivicar.cn/xinyao/miniapp/certs/activate      app.globalData.productItem = temp;
    console.log("刘璞:   requstActive出现了" + app.globalData.productItem);

    util.post(app.globalData.productUrl + "miniapp/certs/activate",{"solutionId":app.globalData.productItem.solutionId,"brandId":app.globalData.productItem.brandId,"templateId":app.globalData.productItem.templateId,"clientId":scanCode}).then((res) => {
      if (res == null ) {
        console.error("god bless you...");
        return;
        }
        wx.hideToast();
        wx.showToast({
          title: "激活成功",
          icon: "none"
        });
        console.log("刘璞:   requstActive成功");
        this.reloadProductList();
    }).catch((errMsg) => {
      if (Object.prototype.toString.call(errMsg) === '[object String]') {
        wx.showToast({
          title: errMsg,
          icon: "none"
        })
      }
    });


  },


reloadProductList () {
  console.log("刘璞:   reloadProductList出现");
  util.get(app.globalData.productUrl + "partners/"+app.globalData.userInfo.id+"/brand/relation").then((res) => {
    console.log(res);
    if (res == null ) {
      console.error("god bless you...");
      return;
      }
      app.globalData.productList = res.data;
      console.log(app.globalData.productList );
      console.log(app.globalData.productList.length );
      if (app.globalData.scanCode.length > 0) {
        var  scanCode = app.globalData.scanCode;
        console.log(scanCode);
        this.requstActive(scanCode);
        //激活方法
        app.globalData.scanCode ="";
      }
      this.changeViewNum();
      console.log("刘璞:   reloadProductList成功");

  }).catch((errMsg) => {
    if (Object.prototype.toString.call(errMsg) === '[object String]') {
      wx.showToast({
        title: errMsg,
        icon: "none"
      })
    }
  });
},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})

var util = require('../../utils/util.js');
