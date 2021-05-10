Page({

  data: {
    brandId:"",
    oldPassword:"",
    newPassword:"",
    rePassword:"",
    limitNum:"",
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(option) {
    this.data.brandId = option.brandId;
    console.log("刘璞");
    console.log(this.data.brandId);
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

  inputreLimitNum (e) {
    this.data.limitNum = e.detail.value;
  },

  deleteBtn:function () {
    var that = this;
    wx.showModal({
      title: '确认删除当前品牌吗?',
      success (res) {
        if (res.confirm) {
          util.post(app.globalData.productUrl + "partners/"+app.globalData.userInfo.id+"/brand/unbind", {"brandId":that.data.brandId}).then((res) => {
            console.log(res);
            if (res == null ) {
              console.error("god bless you...");
              return;
              }
              this.popPage();

          }).catch((errMsg) => {
            wx.showToast({
                title: errMsg,
                icon: "none",
                duration:2000
              })
          });





        } else if (res.cancel) {

        }
      }
    })
  } ,

  sendConfirm(e) {
    var str = "";
    if (this.data.oldPassword.length > 0 &&this.data.newPassword.length>0&&this.data.rePassword.length>0) {
      
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

      util.post(app.globalData.productUrl + "partners/"+app.globalData.userInfo.id+"/password/change", {"oldPassword":this.data.oldPassword,"newPassword":this.data.newPassword,"paertnerId":app.globalData.userInfo.id}).then((res) => {
        console.log(res);
        if (res == null ) {
          console.error("god bless you...");
          return;
          }
          this.popPage();

      }).catch((errMsg) => {
        wx.showToast({
            title: errMsg,
            icon: "none",
            duration:2000
          })
      });
    } 

    if (this.data.limitNum.length > 0) {
      util.put(app.globalData.productUrl + "partners/"+app.globalData.userInfo.id+"/brand", {"brandId":this.data.brandId,
      "terminalLimit": this.data.limitNum == 0? -1:this.data.limitNum ,
      "standalone": 0,
      "undertaker": 0}).then((res) => {
        console.log(res);
        if (res == null ) {
          console.error("god bless you...");
          return;
          }
          this.popPage();
      }).catch((errMsg) => {
        wx.showToast({
            title: errMsg,
            icon: "none",
            duration:2000
          })
      });
    }




  },

  popPage () {

    let pages = getCurrentPages();   //获取小程序页面栈
    let beforePage = pages[pages.length -2];  //获取上个页面的实例对象
    beforePage.setData({      //直接修改上个页面的数据（可通过这种方式直接传递参数）
      txt:'修改数据了'
    })
    beforePage.go_update();   //触发上个页面自定义的go_update方法
    wx.navigateBack({         //返回上一页  
      delta:1
    })
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
var util = require('../../../../utils/util.js');
const app = getApp();
