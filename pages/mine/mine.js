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
    activedNum:"",
    partnerType:0,
    phone:"",
    getRealNameShow: false,
    ellipsis: true,// 文字是否收起，默认收起

  },

  // 收起/展开按钮点击事件
  ellipsis() {
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
    wx.navigateTo({
      url: '../mine/product_manage/product_manage'
  })
  },

  //联系客服
  callPhone: function () {
    wx.makePhoneCall({
      phoneNumber: '18612321893',
      success: function () {
        console.log("拨打电话成功！")
      },
      fail: function () {
        console.log("拨打电话失败！")
      }
    })
  },

  changepassword:function(){
    wx.navigateTo({
      url: '../mine/change_password/change_password'
  })
  },

  loginout:function(){

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
    var activedCount = 0;
    var array = app.globalData.productList;
    for (let i = 0; i < array.length; i++) {
      activedCount +=  array[i].activatedCount
    }
    this.setData({
      partnerType:app.globalData.userInfo.partnerType,
      productNum:app.globalData.productList.length,
      activedNum:activedCount,
      accountName:app.globalData.userInfo.username,
      productName:app.globalData.userInfo.corporation,
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