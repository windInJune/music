const app = getApp();
import { toast } from '../../utils/util.js';
import { list,musicPlayList, detail } from '../../utils/getdata.js';
var nextPage = 0;
Page({
  data: {
    searchSta:true,
    searchText:'',
    scale:1,
    scrollHeight:400,
    lists: [],
    history:[],
    pages:{},
    isLoding:false,
    musicPlay: false,
    musicPlayingStatus: {},//音乐的播放状态
    musicData: {},//当前音乐的信息
    musiclist: [],//音乐播放列表
    musiclistPage: [],//分页
    musicListHidden: true,
    playCoverHidden: true,
    playstatus: 1, //播放模式  // 1随机 2单曲重复  3顺序
    playstatusImg: '../../images/sjbf.png',//播放模式图片
    playstatusName: '随机播放',
    showGoBack: true,//显示返回首页按钮
    positionx: 'right',//按钮的位置
    positiony: 300,//显示返回首页按钮
  },
  onLoad: function () {
    let that = this;
    wx.hideShareMenu();
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: parseInt(res.windowHeight) - 62
        })
      }
    })
    that.getMusicList(1, 1)//获取播放记录第一页
    that.setData({
      musicPlay: app.globalData.musicPlay,
      musicPlayingStatus: app.globalData.musicPlayingStatus,
      musicData: app.globalData.musicData,
      playstatus: app.globalData.playstatus,
      playstatusName: app.globalData.playstatusName,
      playstatusImg: app.globalData.playstatusImg
    })
    wx.getStorage({
      key: 'histroy',
      success: function (res) {
        that.setData({
          history: res.data
        })
      },
    })
  },
  searchInput:function(e){
    let that = this;
    if (e.detail.value.length>0){
      that.setData({
        searchText: e.detail.value
      })
    }
  },
  searchcanal(){
    this.setData({
      searchSta: true
    })
  },
  clearValue() {
    this.setData({
      searchText: ''
    })
  },
  search:function(){
    let that = this;
      let arr = that.data.history;
      arr.unshift(that.data.searchText);
      that.setData({
        history:arr
      })
      that.getList(1);
      wx.setStorage({
        key: 'histroy',
        data: arr,
      })

  },
  getList: function (pageindex) {
    let that = this;
    list({ page: pageindex,code:'', name: that.data.searchText})
      .then(res=>{
        if (!res.data){
          that.setData({
            lists: [],
            pages: {}
          })
          wx.showToast({
            title: '没有搜索结果',
            icon: 'none',
            duration: 2000
          })
          return;
        }
        let searchlists=res.data.lists;
        if (searchlists.length == 0) {
          that.setData({
            lists: [],
            pages: {}
          })
          wx.showToast({
            title: '没有搜索结果',
            icon:'none',
            duration:2000
          })
        }else{
          if (pageindex == 1) {
            that.setData({
              lists: res.data.lists,
              searchSta:false,              
              pages: res.data.pages
            })
          } else {
            that.setData({
              lists: that.data.lists.concat(res.data.lists),
              searchSta: false,                            
              pages: res.data.pages
            })
          }
        }
      })

  },
  hSearch:function(e){
    let that = this;
    that.setData({
      searchText: e.currentTarget.dataset.text
    })
    that.getList(1);
  },
  playMusic(e) {
    this.getDetail(e.currentTarget.dataset.mid)
  },
  getDetail(mid) {
    let that = this;
    detail(mid)
      .then(res => {
        app.globalData.musicData = res.data;
        that.setData({
          musicData: res.data
        })
        //播放
        app.onPlay(res.data.mUrl, res.data.name);
      })
  },
  onShareAppMessage: function (res) {
    let _data = res.target;
    // 9分享歌曲 1分享歌单 
    if (_data.dataset && _data.dataset.sharetype == 9) {
      //歌曲分享
      return {
        title: `这首舞曲不错，快来听一听吧！`,
        path: `/pages/player/player?mid=${_data.dataset.mid}`,
        success: function (res) {
          // 转发成功
          toast('分享成功')

        },
        fail: function (res) {
          // 转发失败
          toast('分享失败')

        }
      }

    }
  },
  like() {
    app.like(this);
  },
  del:function(e){
    let that = this;
    let text = e.currentTarget.dataset.text;
    let arr = that.data.history;
    let result = [];
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] != text) {
        result.push(arr[i]);
      } 
    } 
    that.setData({
      history: result
    })
    wx.setStorage({
      key: 'histroy',
      data: that.data.history,
    })
  },
  delHistory:function(){
    let that = this;
    that.setData({
      history: []
    })
    wx.setStorage({
      key: 'histroy',
      data: that.data.history,
    })
  },
  detail: function (e) {
    wx.navigateTo({
      url: '../detail/detail?id=' + e.currentTarget.dataset.id + '&tag=' + e.currentTarget.dataset.tag,
    })
  },
  // // 下拉刷新
  // onPullDownRefresh: function () {
  //   let that = this;
  //   nextPage = null;
  //   that.setData({
  //     list: []
  //   })
  //   this.getList(1);
  //   wx.stopPullDownRefresh();
  // },
  // 加载更多
  loadMore(e) {
    console.log(e)
    let that = this;
    //防止一直加
    if (that.data.isLoding || that.data.pages.current == that.data.pages.last) {
      return;
    }
    that.setData({
      isLoding: true
    })
    that.getList(that.data.pages.next)
  },
  detail() {
    console.log('...')
    if (!app.globalData.musicData.mId) {
      toast('播放队列暂无歌曲～')
      return;
    }
    wx.navigateTo({
      url: `../player/player?mid=${app.globalData.musicData.mId}`,
    })
  },
  play() {
    app.footplay(this);
  },
  playThisSong(e) {
    app.footplayThisSong(this);

  },
  closeAll() {
    app.footcloseAll(this);
  },
  showList() {
    app.footshowList(this);
  },
  loadMusicPlayList() {
    app.footloadMusicPlayList(this);
  },
  getMusicList(changtype, pageindex) {
    app.footgetMusicList(changtype, pageindex, this);

  },
  deleteMusic(e) {
    app.footdeleteMusic(e, this);

  },
  musicCollectCancel(e) {
    app.footmusicCollectCancel(e, this)
  },
  touchStart: function (e) {
    this.touchStartTime = e.timeStamp
  },
  touchmove: function (e) {
    let _y = e.touches[0].clientY;
    if (_y > this.data.windowHeight - 50 || _y < 0) {
      return
    }
    this.setData({
      positiony: _y
    })
  },
  touchEnd: function (e) {
    this.touchEndTime = e.timeStamp
  },
  goHome: function () {
    app.globalData.showGoBack = false;
    wx.navigateTo({
      url: `../index/index`,
    })
  }
})
