var util = require('../../../../utils/util.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */

  data: {
    productName:"",
    username:"",
    password:"",
    limitNum:"",
  },
  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function() {
  },


  //键盘输入时触发事件

  inputProductName(e) {
    this.data.productName = e.detail.value;
  },

  inputUsername(e) {
    this.data.username  = e.detail.value.replace(/[^\w_@.!]/g,'');
    this.setData({
      username: this.data.username
    })
  },
  
  inputPassword(e) {
    this.data.password  = e.detail.value.replace(/[^\w_@.!]/g,'');
    this.setData({
      password: this.data.password
    })
  },
  inputLimitNum(e) {
    this.data.limitNum  = e.detail.value.replace(/\D/g, '');
    this.setData({
      limitNum: this.data.limitNum
    })
  } ,



  sendConfirm() {
    var str = "";
    if (this.data.productName.length == 0){
      str = "请输入品牌/方案";
    } else if (this.data.username.length == 0){
      str = "请输入账号";
    } else if (this.data.password.length == 0) {
      str = "请输入密码";
    } 
    if (str.length > 0) {
      wx.showToast({
        title: str,
        icon: "none",
        duration:2000
      })
      return;
    }

    util.post(app.globalData.testUrl + "partners/"+app.globalData.userInfo.id+"/brand", {"username":this.data.username,"password":this.data.password,"name":this.data.productName,"terminalLimit":this.data.limitNum > 0?this.data.limitNum:-1,"standalone": 0,"undertaker": 0},).then((res) => {
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
        let pages = getCurrentPages();   //获取小程序页面栈
        let beforePage = pages[pages.length -2];  //获取上个页面的实例对象
        beforePage.setData({      //直接修改上个页面的数据（可通过这种方式直接传递参数）
          txt:'修改数据了'
        })
        beforePage.go_update();   //触发上个页面自定义的go_update方法
        wx.navigateBack({         //返回上一页  
          delta:1
        })
        app.globalData.addProduct = true;

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
