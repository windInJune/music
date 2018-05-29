
const app = getApp();

import { isUserAutor, login } from '../../utils/common.js';
import { formatTime, toast } from '../../utils/util.js';
import { creatDetaultSongSheet,importIntoMusic, list, musicPlayList, detail, songSheetMusicList, save } from '../../utils/getdata.js';
Page({
  data: {
    getButton: true,//控制启动页
    userInfo: {},
    mid: null,//歌单id
    musicOrdertype: null,
    scrollHeight: 100,
    page: null, // 分页详情
    lists: [], //音乐列表
    musicType: null, //音乐类型 头部数据
    singtime: '',
    singName: '',
    singtype: null,
    showGoBack: false,//显示返回首页按钮
    positionx: 'right',//按钮的位置
    positiony: 300,//显示返回首页按钮
    windowHeight: 400,
    musicPlay: false,
    musicPlayingStatus: {},//音乐的播放状态
    musicData: {},//当前音乐的信息
    isLoding: false,
    musiclist: [],//音乐播放列表
    musiclistPage: [],//分页
    musicListHidden: true,
    playCoverHidden: true,
    playstatus: 1, //播放模式  // 1随机 2单曲重复  3顺序
    playstatusImg: '../../images/sjbf.png',//播放模式图片
    playstatusName: '随机播放',
    // 触摸开始时间
    touchStartTime: 0,
    // 触摸结束时间
    touchEndTime: 0,
    // 最后一次单击事件点击发生时间
    lastTapTime: 0,
    // 单击事件点击后要触发的函数
    lastTapTimeoutFunc: null
  },

  onLoad: function (options) {
    let that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowHeight: res.windowHeight,
          scrollHeight: parseInt(res.windowHeight) - 248
        })
      }
    })
    that.setData({
      musicData: app.globalData.musicData,
      mid: options.mid, //分两种  index 页面  跟my_singList
      musicPlay: app.globalData.musicPlay,
      musicData: app.globalData.musicData,
      singtype: options.type,
      musicPlayingStatus: app.globalData.musicPlayingStatus,
      showGoBack: app.globalData.showGoBack
    })
    if (options.type != 1) {
      let _musicType = {
        time: formatTime(options.time),
        cover: null,
        name: options.name
      }

      that.setData({
        musicType: _musicType
      })
    }
    if (wx.getStorageSync('loginKey')) {
      that.getlist(1, 1, options.mid)
    } else {
      that.setData({
        getButton: false
      })
    }
  },
  getUserInfo(e) {
    app.getUserInfo(e, this);
  },
  //同意授权
  agreelogin(userdata) {
    let that = this;
    app.agreelogin(userdata, function () {
      //调用每日推荐接口
      that.setData({
        getButton: true
      })
      creatDetaultSongSheet()
        .then(res => {
          console.log(res)
        })
      // that.getMusicList(1, 1)//获取播放记录第一页          
      that.getlist(1, 1, that.data.mid)
    });
  },
  openSetting: function () {
    app.openSetting(this);
  },
  //播放全部
  playAll() {
    let that = this;
    if (that.data.lists.length > 0) {
      //第一首开始播放 
      let that = this;
      app.goPlay('first');
      importIntoMusic(that.data.mid)
        .then(res => {
          console.log(res)
        })
    } else {
      toast('此歌单暂时没有歌曲～')
    }
  },
  //收藏音乐
  saveMusic(e) {
    let _this = this;
    let _data = e.currentTarget.dataset;
    let _actiontype = "";

    if (_data.iscollect) {
      _actiontype = "musicCollectCancel"
    } else {
      _actiontype = "musicCollect"
    }
    save(_data.mid, _actiontype)
      .then(res => {
        let _list = _this.data.lists;
        _list[_data.index].collect = !_list[_data.index].collect;
        _this.setData({
          lists: _list,
          musiclist: _list //把当前的歌添加进播放列表         
        })
        app.globalData.musicPlayList = _list;
        if (!_data.iscollect) {
          toast('收藏成功')
        } else {
          toast('取消收藏')
        }
      })
  },
  getlist(changtype, pageindex, mid) {

    let _this = this;
    let _data = {};
    _data.page = pageindex;    
    if (_this.data.singtype == 1) {
      if (mid != 'undefined') {
        _data.code = mid;
      }
      list(_data)
        .then(res => {
          if (changtype == 1) {
            let _musicType = res.data.musicType;
            _musicType.time = formatTime(res.data.musicType.time)
            _this.setData({
              lists: res.data.lists,
              musiclist: res.data.lists, 
              musiclistPage: res.data.pages,
              page: res.data.pages,
              musicType: _musicType
            })
            app.globalData.musicPlayList = res.data.lists;

          } else {
            let _nowLists = _this.data.lists.concat(res.data.lists);
            _this.setData({
              lists: _nowLists,
              musiclist: _nowLists,
              page: res.data.pages
            })
            app.globalData.musicPlayList = _nowLists;

          }
          _this.setData({
            isLoding: false
          })
        }, err => {
          console.log('err')
        })
    } else {
      songSheetMusicList(pageindex, mid)
        .then(res => {
          if (changtype == 1) {
            _this.setData({
              lists: res.data.lists,
              musiclist: res.data.lists, //把当前的歌添加进播放列表                          
              page: res.data.pages
            })
            app.globalData.musicPlayList = res.data.lists;

          } else {
            let _nowLists = _this.data.lists.concat(res.data.lists);
            _this.setData({
              lists: _nowLists,
              musiclist: _nowLists,
              page: res.data.pages
            })
            app.globalData.musicPlayList = _nowLists;

          }
          _this.setData({
            isLoding: false
          })
        }, err => {
          console.log('err')
        })
    }



  },
  loadMore(e) {

    let _this = this;
    //防止一直加
    if (_this.data.isLoding || _this.data.page.current == _this.data.page.last) {
      return;
    }
    _this.setData({
      isLoding: true
    })
    _this.getlist(2, _this.data.page.next, _this.data.mid)

  },
  // 分享配置
  onShareAppMessage: function (res) {
    let _data = res.target;
    // 9分享歌曲 1分享歌单 
    if (!!_data.dataset && _data.dataset.sharetype == 9) {
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

    } else {

      return {
        title: `我发现这个歌单不错，快来听一听吧！`,
        imageUrl: `${this.data.musicType.cover}`,
        path: `/pages/singList/singList?mid=${this.data.mid}&&type=${this.data.singtype}`,
        success: function (res) {
          toast('分享成功')
        },
        fail: function (res) {
          toast('分享失败')

        }
      }
    }
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
  playMusic(e) {
    this.getDetail(e.currentTarget.dataset.mid)
  },
  detail() {
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
  like() {
    app.like(this);
  },
  closeAll() {
    app.footcloseAll(this);

  },
  showList() {
    app.footshowList(this);

  },
  loadMusicPlayList() {
    // app.footloadMusicPlayList(this);

  },
  getMusicList(changtype, pageindex) {
    // app.footgetMusicList(changtype, pageindex, this);
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