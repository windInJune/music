const app = getApp();
import { toast } from '../../utils/util.js';
import { searchlist,musicCollectList, detail, save } from '../../utils/getdata.js';
Page({
  data: {
    scrollHeight:0,
    scale:1,
    isLoding:false,
    lists:[],
    pages:{},
    musicPlay: false,
    musicPlayingStatus: {},//音乐的播放状态
    musicData: {},//当前音乐的信息
    searchValue:'',
    searchHidden:true,
    searchLists: '', 
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that=this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: parseInt(res.windowHeight) - 62
        })
      }
    })
    that.getlist(1,1); //首次加载
    that.setData({
      musicPlay: app.globalData.musicPlay,
      musicPlayingStatus: app.globalData.musicPlayingStatus,
      musicData: app.globalData.musicData,
      playstatus: app.globalData.playstatus,
      playstatusName: app.globalData.playstatusName,
      playstatusImg: app.globalData.playstatusImg
    })
    wx.hideShareMenu();
    // that.getMusicList(1, 1)//获取播放记录第一页
    
  },
  like() {
    app.like(this);
  },
  loadMore(e) {
    let that = this;
    //防止一直加
    if (that.data.isLoding || that.data.pages.current == that.data.pages.last) {
      return;
    }
    that.setData({
      isLoding: true
    })
    that.getlist(2, that.data.pages.next);
  },
  clearValue() {
    this.setData({
      searchValue: ''
    })
  },
  search:function(){
    let _value = this.data.searchValue;
    let _this =this;
    searchlist(_value)
     .then(res => {
       if (res.data.lists.length > 0){
         _this.setData({
           searchLists: res.data.lists,
           searchHidden:false
         })
       }else{
         toast('暂无搜到此歌曲')
       }
     })
  },
  changeValue(e){
    this.setData({
      searchValue:e.detail.value
    })
  },
  noSearch(){
    this.setData({
      searchHidden: true
    })
  },
  getlist: function (changtype,pageIndex){
    let that=this;
    musicCollectList(pageIndex)
      .then(res => {
        if (changtype == 1) {
          that.setData({
            lists: res.data.lists,
            musiclistPage: res.data.pages,
            musiclist: res.data.lists, //把当前的歌添加进播放列表                      
            pages: res.data.pages
          })
          app.globalData.musicPlayList = res.data.lists;          

        } else {
          let _nowLists = that.data.lists.concat(res.data.lists);
          that.setData({
            lists: _nowLists,
            musiclist: _nowLists,
            musiclistPage: res.data.pages,
            pages: res.data.pages
          })
          app.globalData.musicPlayList = _nowLists;          

        }
        that.setData({
          isLoding: false
        })
      })
  },
  saveMusic(e) {
    let that = this;
    //自定义的属性
    let _data = e.currentTarget.dataset;
    save(_data.mid, "musicCollectCancel")
      .then(res => {
        console.log(res)
        if(res.code="SUCCESS"){
          
          that.data.lists.splice(_data.index, 1)
          that.setData({
            lists: that.data.lists
          })
          app.globalData.musicPlayList = that.data.lists;          
          
        }
      })
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
    /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    let _data = res.target;
    // 9分享歌曲 1分享歌单 
    if (_data.dataset && _data.dataset.sharetype == 9) {
      //歌曲分享
      return {
        title: `这首舞曲不错，快来听一听吧！`,
        path: `/pages/player/player?mid=${_data.dataset.mid}`,
        success: function (res) {
          toast('分享成功')                                    
        },
        fail: function (res) {
          toast('分享失败')                                    
        }
      }

    }
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
  playThisSong(e) {
    app.footplayThisSong(e, this);

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