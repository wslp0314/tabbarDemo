Page({

  data: {
    oldPassword:"",
    newPassword:"",
    rePassword:"",
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function() {
    
    var pages = getCurrentPages();//获取页面栈
    if (pages.length > 1) {
    //上一个页面实例对象
    var prePage = pages[pages.length - 2];
    console.log("刘璞");
    console.log(pages);
    console.log(prePage);
    console.log("刘璞");
    //调用上一个页面的onShow方法
    // prePage.onShow()
    } 
  },

  //键盘输入时触发事件

  inputoldPassword(e) {
    this.data.oldPassword  = e.detail.value.replace(/[^\w_@.!]/g,'');
    this.setData({
      oldPassword: this.data.oldPassword
    })
  },
  inputnewPassword(e) {
    this.data.newPassword = e.detail.value;
  },
  inputrePassword(e) {
    this.data.rePassword  = e.detail.value;
  } ,


  sendConfirm(e) {
    var str = "";
    if (this.data.oldPassword.length == 0){
      str = "请输入原密码";
    } else if (this.data.newPassword.length == 0){
      str = "请输入新密码";
    } else if (this.data.rePassword.length == 0) {
      str = "请输入确认新密码";
    } else if (this.data.rePassword != this.data.newPassword) {
      str = "请输入的两次新密码不一致";
    }
    if (str.length > 0) {
      wx.showToast({
        title: str,
        icon: "none",
        duration:2000
      })
      return;
    }

    console.log("liupu"+getApp().globalData.userInfo.id);
    util.post(app.globalData.testUrl + "partners/"+app.globalData.userInfo.id+"/password/change", {"oldPassword":this.data.oldPassword,"newPassword":this.data.newPassword,"paertnerId":app.globalData.userInfo.id}).then((res) => {
      console.log(res);
      if (res == null ) {
        console.error("god bless you...");
        return;
        }
        wx.hideToast();
        console.log("liupu:"+res.data.msg);
        wx.showToast({
          title: res.data.msg,
          icon: "none",
          duration:2000
        })
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

    }).catch((errMsg) => {
      wx.showToast({
          title: errMsg,
          icon: "none",
          duration:2000
        })
    });




  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
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
var util = require('../../../utils/util.js');
const app = getApp();
