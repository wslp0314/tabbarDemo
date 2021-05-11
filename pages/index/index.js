//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    tabbar: {},
    username:"",
    password:"",
    totalNum:0,
    usedNum:0,
    useNum:0,
    productName: "",
    productItem: null,
    canActive:true,
    productList: [],
    productAllList:[],
    useProductNum:0,
    userId: "",
    scanCode:'扫码',
    mCurrentPage:1,
    items: [],
    itemList: [],
    hidden: false,
    loading: false,
    // loadmorehidden:true,
    plain: false,
    currentProduct:0,
  },

  //登录获取username和password
  inputUserame: function(e) {
    this.data.username  = e.detail.value.replace(/[^\w_@.!]/g,'');
    this.setData({
      username : this.data.username,
    })
  },

  inputPassword: function(e) {
    this.data.password  = e.detail.value;
  },

  loginEvent: function (){
    //登录的操作
    // wx.checkSession({
    //   success () {
    //     if (wx.getStorageSync('token')) {
          
    //     }
    //   },
    //   fail () {
    //     // session_key 已经失效，需要重新执行登录流程
    //     wx.login() //重新登录
    //   }
    // })
    wx.showToast({
      title: '正在登录...',
      icon: 'loading'
    });
    util.post(app.globalData.productUrl + "miniapp/login", {"username":this.data.username,"password":this.data.password}).then((res) => {
      console.log(res);
      if (res == null ) {
        console.error("god bless you...");
        return;
        }
        app.globalData.userInfo = res.data;
        this.data.userId = res.data.id;
        console.log(this.data.userId);
        this.setData({
          userId: this.data.userId,
        });
        wx.setStorageSync('password', this.data.password);
        wx.setStorageSync('username', this.data.username);
        wx.hideToast();
        wx.showToast({
          title: "登录成功",
          icon: "none"
        });
        this.getUserProductInfoOrPlanInfo();

    }).catch((errMsg) => {
      wx.showToast({
          title: errMsg,
          icon: "none"
        })
    });
  },
  
  onLoad: function () {
    app.editTabbar();
    var password = wx.getStorageSync('password');
    var username = wx.getStorageSync('username');
    if (username != null) {
      this.setData({
        username:username,
        password:password
      });
    };
  },
  onShow: function () {
    console.log(app.globalData.userInfo);
    this.setData({
      userId:app.globalData.userInfo?"1":""
    });

    if (app.globalData.userInfo == null) {
      console.log("liupu ------------" + "clearlist");
      this.setData({
        items: [],
        hidden: true,
        productName:"",
        totalNum:0,
        useNum:0,
        usedNum:0
    });
    }

    if (app.globalData.addProduct) {
      this.getUserProductInfoOrPlanInfo();
      app.globalData.addProduct = false;
    }
    if (app.globalData.scanCode.length > 0) {
      var  scanCode = app.globalData.scanCode;
      console.log(scanCode);
      this.requstActive(scanCode);
      //激活方法
      app.globalData.scanCode ="";
    }

    if (app.globalData.productList != null) {
      var activedCount = 0;
      var array = app.globalData.productList;
      for (let i = 0; i < array.length; i++) {
        activedCount +=  array[i].activatedCount
      }
      if (this.data.itemList.length != activedCount) {
        this.getNumDetail();
        this.getActivedList(mCurrentPage,this.data.productItem.brandId ,this.data.productItem.solutionId);
        this.reloadProductList();
      }
    }
    
  },

  //激活方法
  requstActive:function (scanCode) {

    wx.showToast({
      title: '加载中',
      icon: 'loading'
    });
    // https://test.ivicar.cn/xinyao/miniapp/certs/activate
    util.post(app.globalData.productUrl + "miniapp/certs/activate",{"solutionId":this.data.productItem.solutionId,"brandId":this.data.productItem.brandId,"templateId":this.data.productItem.templateId,"clientId":scanCode}).then((res) => {
      if (res == null ) {
        console.error("god bless you...");
        return;
        }
        wx.hideToast();
        wx.showToast({
          title: "激活成功",
          icon: "none"
        });
        this.getNumDetail();
        this.getActivedList(mCurrentPage,this.data.productItem.brandId ,this.data.productItem.solutionId);
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


  onPullDownRefresh: function () {
    //调用刷新时将执行的方法
    this.getActivedList(1, this.data.productItem.brandId,this.data.productItem.solutionId );
},
  onReachBottom: function () {
    console.log('onLoad')
    var that = this
    that.setData({
      hidden: false,
    });
    mCurrentPage  = mCurrentPage +1;
    this.getActivedList(mCurrentPage, this.data.productItem.brandId,this.data.productItem.solutionId );
  },

  //切换品牌
  bindPickerChange: function(e){
    mDesc = [];
    mTimes = [];
    mCurrentPage = 1;
    this.setData({
      productName: this.data.productList[e.detail.value] //+ "▽"
    })
    this.data.productName = this.data.productList[e.detail.value]
    console.log(this.data.productList[e.detail.value])
    var temp = this.data.productAllList[e.detail.value];
    this.data.currentProduct = e.detail.value;
    this.data.productItem = temp;
    app.globalData.productItem = temp;

    this.data.canActive =temp.canActivate;
    app.globalData.canActive = temp.canActivate;
    this.getActivedList(mCurrentPage,temp.brandId ,temp.solutionId);
    this.getNumDetail();
    this.reloadProductList();
    // this.getUserProductInfoOrPlanInfo();
    console.log(temp);
  },

  getNumDetail () {
    wx.showToast({
      title: '加载中',
      icon: 'loading'
    });
    util.get(app.globalData.productUrl + "miniapp/certs/info",{"solutionId":this.data.productItem.solutionId,"brandId":this.data.productItem.brandId}).then((res) => {
      if (res == null ) {
        console.error("god bless you...");
        return;
        }
        var tempItem = res.data;
        this.setData({
          totalNum:tempItem.terminalLimit,
          usedNum:tempItem.activatedCount,
          useNum:tempItem.availableTerminalLimit,
        });
      wx.hideToast();
    }).catch((errMsg) => {
      if (Object.prototype.toString.call(errMsg) === '[object String]') {
        wx.showToast({
          title: errMsg,
          icon: "none"
        })
      }
    });
  },


//获取用户绑定品牌/方案列表
 getUserProductInfoOrPlanInfo:function (){

  wx.showToast({
    title: '加载列表...',
    icon: 'loading'
  });

  util.get(app.globalData.productUrl + "partners/"+app.globalData.userInfo.id+"/brand/relation").then((res) => {
    console.log(res);
    if (res == null ) {
      console.error("god bless you...");
      return;
      }
      var tempItem = res.data[0];
      this.data.productItem = tempItem;
      app.globalData.productItem = tempItem;
      this.data.canActive = tempItem.canActivate;
      app.globalData.canActivate = tempItem.canActivate;
      wx.hideToast();
      this.getActivedList(mCurrentPage, tempItem.brandId,tempItem.solutionId );
      this.setData({
        productName: tempItem.name //+ "▽",//▽
      });
      app.globalData.productList = res.data;
      this.data.productName = tempItem.name;
      this.data.productList = [];
      for (var i = 0; i < res.data.length; i++) {
        var tempItem1 = res.data[i];
        this.data.productList.push(tempItem1.name);
      }
      this.data.productAllList = res.data;
      this.setData({
          productList:this.data.productList
      });
      this.setData({
        totalNum:tempItem.terminalLimit,
        usedNum:tempItem.activatedCount,
        useNum:tempItem.availableTerminalLimit,
      });

      

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

  util.get(app.globalData.productUrl + "partners/"+app.globalData.userInfo.id+"/brand/relation").then((res) => {
    console.log(res);
    if (res == null ) {
      console.error("god bless you...");
      return;
      }
      var tempItem = res.data[this.data.currentProduct];
      this.data.productItem = tempItem;
      app.globalData.productItem = tempItem;
      app.globalData.productList = res.data;
      this.data.productName = tempItem.name;
      this.data.productList = [];
      for (var i = 0; i < res.data.length; i++) {
        var tempItem1 = res.data[i];
        this.data.productList.push(tempItem1.name);
      }
      this.data.productAllList = res.data;
  }).catch((errMsg) => {
    if (Object.prototype.toString.call(errMsg) === '[object String]') {
      wx.showToast({
        title: errMsg,
        icon: "none"
      })
    }
  });
},



  getActivedList:function  (targetPage , brandId,solutionId) {
    wx.showToast({
      title: '加载列表...',
      icon: 'loading'
    });
    //此处为使用封装的post请求
    util.get(app.globalData.productUrl + "miniapp/certs/list", {"pageNumber":targetPage,"pageSize":10,"brandId":brandId,"solutionId":solutionId,}).then((res) => {
      console.log(res);
      console.log("我是你爸爸");
      if (res == null) {
        console.error("god bless you...");
        return;
        }
      if (targetPage == 1) {
        mDesc=[];
        mTimes=[];
      }
      for (var i = 0; i < res.data.length; i++) {
        this.bindData(res.data[i]);
      }

      //将获得的各种数据写入itemList，用于setData
      // if (targetPage > 0) {
         this.data.itemList = [];
      // }

      for (var i = 0; i < mDesc.length; i++) {
        this.data.itemList.push({ desc: mDesc[i],  time: mTimes[i], });
      }
 
      this.setData({
        items: this.data.itemList,
        hidden: true,
        // loadmorehidden:false,
      });
      if (res.data.length ==0) {
        this.data.mCurrentPage = targetPage;
        wx.showToast({
          title: "没有更多数据",
          icon: "none"
        })
      }
      // mCurrentPage = targetPage;

      wx.hideToast();
    }).catch((errMsg) => {
      //错误提示信息
      wx.showToast({
          title: errMsg,
          icon: "none"
        })
    });
  },

/**
 * 绑定接口中返回的数据
 * @param itemData Gank.io返回的content;
  */
    bindData:function (itemData) {

      var desc = itemData.clientId;
      var times = itemData.activatedTime;
      mDesc.push(desc);
      mTimes.push(times);
    }
  })





/**
 * 定义几个数组用来存取item中的数据
 */
var mDesc = [];
var mTimes = [];
var mCurrentPage = 1;

// 引入utils包下的js文件
var util = require('../../utils/util.js');


