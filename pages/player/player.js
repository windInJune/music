import { isUserAutor, login } from '../../utils/common.js';
import { creatDetaultSongSheet, musicPlayList, addSong, detail, addMusicToSongSheet, save, songSheetlist } from '../../utils/getdata.js';
import { toast, findMid } from '../../utils/util.js';;
//获取应用实例
const app = getApp()
Page({
  data: {
    getButton: true,//控制启动页
    userInfo: {},
    musiclistPage: {},
    musicData: {},//当前数据源
    musicPlayingStatus: {
      timerBegin: '0:00', //当前播放时间
      timerEnd: "0:00", //总时间
      progress: 0
    },
    thisMid: '',
    addSongValue: "",
    musicPlay: false,
    showGoBack: false,
    positionx: 'right',//按钮的位置
    positiony: 20,//显示返回首页按钮
    windowHeight: 400,
    musiclist: [],//音乐播放列表
    musicListHidden: true,
    playstatus: 1, //播放模式  // 1随机 2单曲重复  3顺序
    playstatusImg: '../../images/sjbf.png',//播放模式图片
    playstatusName: '随机播放',
    songSheetlist: [],//歌单列表
    songSheetlistPage: {},//歌单page
    isLoding: false, //是否正在加载
    playCoverHidden: true,
    addSongSheetHidden: true,
    appenMusicToHidden: true,
    // 触摸开始时间
    touchStartTime: 0,
    // 触摸结束时间
    touchEndTime: 0,
    // 最后一次单击事件点击发生时间
    lastTapTime: 0,
    // 单击事件点击后要触发的函数
    lastTapTimeoutFunc: null
  },
  onLoad: function (option) {
    //判断用户是否授权过
    let that = this;
    wx.hideShareMenu();
    if (wx.getStorageSync('loginKey')) {
      that.getMusicList(1, 1)//获取播放记录第一页
      that.getDetail(option.mid) //获取歌曲详情 
    } else {
      that.setData({
        getButton: false
      })
    }
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowHeight: res.windowHeight
        })
      }
    })
    //获取全局的音乐信息 和当前音乐mid
    that.setData({
      musicPlay: app.globalData.musicPlay,
      musicData: app.globalData.musicData,
      playstatus: app.globalData.playstatus,
      playstatusName: app.globalData.playstatusName,
      playstatusImg: app.globalData.playstatusImg,
      showGoBack: app.globalData.showGoBack,
      thisMid: option.mid
    })

  },
  onShow: function (e) {
    console.log(e)
  },
  onShareAppMessage: function (res) {
    let _this = this;
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

    } else {
      //歌曲分享
      return {
        title: `这首舞曲不错，快来听一听吧！`,
        path: `/pages/player/player?mid=${_this.data.musicData.mId}`,
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
      that.getDetail(that.data.thisMid) //获取歌曲详情
      that.getMusicList(1, 1)//获取播放记录第一页   
    });
  },
  openSetting: function () {
    app.openSetting(this);
  },
  //显示新建歌单
  addSongSheet() {
    this.setData({
      addSongSheetHidden: false,
      appenMusicToHidden: true,
      playCoverHidden: false
    })
  },
  addSongBlur(e) {
    this.setData({
      'addSongValue': e.detail.value
    })
  },
  //显示歌单列表
  showSongSheet() {
    this.getSongSheetlist(1, 1) //获取歌单第一页   
    this.setData({
      appenMusicToHidden: false,
      playCoverHidden: false
    })
  },
  cannalAddSongSheet() {
    this.setData({
      addSongSheetHidden: true,
      playCoverHidden: true
    })
  },
  sureAddSongSheet() {
    let _this = this;
    addSong(this.data.addSongValue)
      .then(res => {
        _this.setData({
          addSongSheetHidden: true,
          playCoverHidden: true
        })
        if (res.code == "SUCCESS") {
          toast('创建成功', 'success')
          console.log(res.data)
          addMusicToSongSheet(_this.data.musicData.mId, res.data)
            .then(res => {
              _this.setData({
                appenMusicToHidden: true,
                playCoverHidden: true
              })
              if (res.code == "SUCCESS") {
                toast('添加成功', 'success')
              } else {
                toast(res.msg)
              }
            })
        } else {
          toast(res.msg)
        }

      })
  },
  //显示歌
  showList() {
    this.setData({
      musicListHidden: false,
      playCoverHidden: false
    })
  },
  getMusicList(changtype, pageindex) {
    //changtype 1首次加载  2上拉加载
    let _this = this;
    musicPlayList(pageindex)
      .then(res => {
        if (changtype == 1) {
          _this.setData({
            musiclist: res.data.lists,
            musiclistPage: res.data.pages
          })
          app.globalData.musicPlayList = res.data.lists;
        } else {
          let _nowLists = _this.data.musiclist.concat(res.data.lists);
          _this.setData({
            musiclist: _nowLists,
            musiclistPage: res.data.pages
          })
          app.globalData.musicPlayList = _nowLists;

        }
        _this.setData({
          isLoding: false
        })
      }, err => {

      })
  },
  closeAll() {
    this.setData({
      appenMusicToHidden: true,
      addSongSheetHidden: true,
      musicListHidden: true,
      playCoverHidden: true
    })
  },
  //加载歌单
  loadMusicPlayList() {
    let _this = this;
    //防止一直加
    if (_this.data.isLoding || _this.data.musiclistPage.current == _this.data.musiclistPage.last) {
      return;
    }
    _this.setData({
      isLoding: true
    })
    _this.getMusicList(2, _this.data.musiclistPage.next)
  },
  //播放记录加载更多
  songSheetLoadMore(e) {
    let _this = this;
    //防止一直加
    if (_this.data.isLoding || _this.data.songSheetlistPage.current == _this.data.songSheetlistPage.last) {
      return;
    }
    _this.setData({
      isLoding: true
    })
    _this.getSongSheetlist(2, _this.data.songSheetlistPage.next)

  },
  //添加歌曲到歌单
  addMusicToSongSheet(e) {
    let _this = this;
    addMusicToSongSheet(_this.data.musicData.mId, e.currentTarget.dataset.ssid)
      .then(res => {
        _this.setData({
          appenMusicToHidden: true,
          playCoverHidden: true
        })
        if (res.code == "SUCCESS") {
          toast('添加成功', 'success')
        } else {
          toast(res.msg)
        }
      })
  },
  getSongSheetlist(changtype, pageindex) {
    // changtype 1是首次加载 2是上拉加载
    let _this = this;
    songSheetlist(pageindex)
      .then(res => {
        if (changtype == 1) {
          _this.setData({
            songSheetlist: res.data.lists,
            songSheetlistPage: res.data.pages
          })
        } else {
          let _nowLists = _this.data.songSheetlist.concat(res.data.songSheetlist);
          _this.setData({
            songSheetlist: _nowLists,
            songSheetlistPage: res.data.pages
          })
        }
        _this.setData({
          isLoding: false
        })
      }, err => {

      })
  },//歌单列表
  getDetail(mid) {
    let that = this;
    detail(mid)
      .then(res => {

        wx.setNavigationBarTitle({
          title: res.data.name
        })
        app.globalData.musicData = res.data;
        that.setData({
          musicData: res.data
        })

      })
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
    save(_this.data.musicData.mId, _actiontype)
      .then(res => {
        let _musicData = _this.data.musicData;
        _musicData.collect = !_musicData.collect;
        _this.setData({
          musicData: _musicData
        })
        app.globalData.musicData = _musicData;
        if (!_data.iscollect) {
          toast('收藏成功')
        } else {
          toast('取消收藏')
        }
      })
  },
  //删除歌曲
  deleteMusic(e) {
    let _data = e.currentTarget.dataset;
    let { inlist, listIndex } = findMid(_data.mid, this.data.musiclist);
    let that = this;
    wx.showModal({
      title: '温馨提示',
      content: '确定移除这首歌？',
      success: function (res) {
        //删除歌单
        if (res.confirm) {
          if (inlist) {
            let _newArr = that.data.musiclist;
            _newArr.splice(listIndex, 1);
            that.setData({
              musiclist: _newArr
            })
            toast('删除成功')

          }
        }

      }
    })

  },
  //播放
  play() {
    let that = this;
    let _musicPlay = !that.data.musicPlay;
    if (that.data.musicPlay) {
      app.pause();
    } else {
      if (app.isMusicSrc()) {
        app.play();
      } else {
        app.onPlay(that.data.musicData.mUrl, that.data.musicData.name);
      }
    }
    that.setData({
      musicPlay: _musicPlay
    })
  },//切换模式
  like() {
    app.like(this);
  },
  //播放记录点击播放
  playThisSong(e) {
    let that = this;
    detail(e.currentTarget.dataset.mid)
      .then(res => {
        wx.setNavigationBarTitle({
          title: res.data.name
        })
        app.globalData.musicData = res.data;
        that.setData({
          musicData: res.data,
          musicPlay: true,
          thisMid: e.currentTarget.dataset.mid
        })
        app.onPlay(res.data.mUrl, res.data.name);
      })
  },
  //上一首
  prev() {
    app.goPlay('prev')
  },
  //下一首
  next() {
    app.goPlay('next')
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
