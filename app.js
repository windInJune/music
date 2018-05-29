import { getLoginKey, getToken, getApi, isUserAutor, login } from './utils/common.js';
import { toast, formate, getProgress, findMid } from './utils/util.js';
import { delMusicFromMusicPlay,save,dailyRecomment, musicPlayList, detail } from './utils/getdata.js';
var backgroundAudioManager;
App({
  onLaunch: function (options) {
    let that = this;
    if (options.path == 'pages/player/player' || options.path == 'pages/singList/singList'){
      that.globalData.showGoBack  = true;
    }
    backgroundAudioManager = wx.getBackgroundAudioManager();
    backgroundAudioManager.onEnded(function () {
      that.goPlay('endplay')
    })
    backgroundAudioManager.onPrev(function () {
      that.goPlay('prev')
    })
    backgroundAudioManager.onNext(function () {
      that.goPlay('next')
    })
    backgroundAudioManager.onCanplay(function () {

    })

    backgroundAudioManager.onError(function () {
      toast('音乐播放错误');
      let _musicPlayingStatus = {
        timerBegin: '0:00',
        timerEnd: '0:00',
        progress: 0
      }
      that.globalData.musicPlay = false;
      that.globalData.musicPlayingStatus = _musicPlayingStatus;
      let wxCurrPage = getCurrentPages();//获取当前页面的页面栈
      let wxPrevPage1 = wxCurrPage[wxCurrPage.length - 1];//获取上级页面的page对象
      let wxPrevPage2 = wxCurrPage[wxCurrPage.length - 2];//获取上级页面的page对象
      let wxPrevPage3 = wxCurrPage[wxCurrPage.length - 3];//获取上级页面的page对象
      if (wxPrevPage1) {
        //修改当前页面的数据
        wxPrevPage1.setData({
          musicPlay: false,
          musicPlayingStatus: _musicPlayingStatus
        })
      }
      if (wxPrevPage2) {
        //修改当前页面的数据
        wxPrevPage2.setData({
          musicPlay: false,
          musicPlayingStatus: _musicPlayingStatus
        })
      }
      if (wxPrevPage3) {
        //修改当前页面的数据
        wxPrevPage3.setData({
          musicPlay: false,
          musicPlayingStatus: _musicPlayingStatus
        })
      }
    })
    backgroundAudioManager.onWaiting(function () {
      toast('正在加载音乐，请耐心等待~')
    })
    backgroundAudioManager.onTimeUpdate(function () {
      let _duration = backgroundAudioManager.duration,
        _currentTime = backgroundAudioManager.currentTime;
      let _musicPlayingStatus = {
        timerBegin: formate(_currentTime),
        timerEnd: formate(_duration),
        progress: getProgress(_currentTime, _duration)
      }
      that.globalData.musicPlayingStatus = _musicPlayingStatus;
      let wxCurrPage = getCurrentPages();//获取当前页面的页面栈
      let wxPrevPage1 = wxCurrPage[wxCurrPage.length - 1];//获取上级页面的page对象
      let wxPrevPage2 = wxCurrPage[wxCurrPage.length - 2];//获取上级页面的page对象
      let wxPrevPage3 = wxCurrPage[wxCurrPage.length - 3];//获取上级页面的page对象
      if (wxPrevPage1) {
        //修改当前页面的数据
        wxPrevPage1.setData({
          musicPlayingStatus: _musicPlayingStatus
        })
      }
      if (wxPrevPage2) {
        //修改当前页面的数据
        wxPrevPage2.setData({
          musicPlayingStatus: _musicPlayingStatus
        })
      }
      if (wxPrevPage3) {
        //修改当前页面的数据
        wxPrevPage3.setData({
          musicPlayingStatus: _musicPlayingStatus
        })
      }
    })
    backgroundAudioManager.onPlay(function () {
      that.globalData.musicPlay = true;
      let wxCurrPage = getCurrentPages();//获取当前页面的页面栈
      let wxPrevPage1 = wxCurrPage[wxCurrPage.length - 1];//获取上级页面的page对象
      let wxPrevPage2 = wxCurrPage[wxCurrPage.length - 2];//获取上级页面的page对象
      let wxPrevPage3 = wxCurrPage[wxCurrPage.length - 3];//获取上级页面的page对象
      if (wxPrevPage1) {
        //修改当前页面的数据
        wxPrevPage1.setData({
          musicPlay: true
        })
      }
      if (wxPrevPage2) {
        //修改当前页面的数据
        wxPrevPage2.setData({
          musicPlay: true
        })
      }
      if (wxPrevPage3) {
        //修改当前页面的数据
        wxPrevPage3.setData({
          musicPlay: true
        })
      }
    })
    backgroundAudioManager.onPause(function () {
      that.globalData.musicPlay = false;
      let wxCurrPage = getCurrentPages();//获取当前页面的页面栈
      let wxPrevPage1 = wxCurrPage[wxCurrPage.length - 1];//获取上级页面的page对象
      let wxPrevPage2 = wxCurrPage[wxCurrPage.length - 2];//获取上级页面的page对象
      let wxPrevPage3 = wxCurrPage[wxCurrPage.length - 3];//获取上级页面的page对象
      if (wxPrevPage1) {
        //修改当前页面的数据
        wxPrevPage1.setData({
          musicPlay: false
        })
      }
      if (wxPrevPage2) {
        //修改当前页面的数据
        wxPrevPage2.setData({
          musicPlay: false
        })
      }
      if (wxPrevPage3) {
        //修改当前页面的数据
        wxPrevPage3.setData({
          musicPlay: false
        })
      }
    })
    backgroundAudioManager.onStop(function () {
      let _musicPlayingStatus = {
        timerBegin: '0:00',
        timerEnd: '0:00',
        progress: 0
      }
      that.globalData.musicPlay = false;
      that.globalData.musicPlayingStatus = _musicPlayingStatus;
      let wxCurrPage = getCurrentPages();//获取当前页面的页面栈
      let wxPrevPage1 = wxCurrPage[wxCurrPage.length - 1];//获取上级页面的page对象
      let wxPrevPage2 = wxCurrPage[wxCurrPage.length - 2];//获取上级页面的page对象
      let wxPrevPage3 = wxCurrPage[wxCurrPage.length - 3];//获取上级页面的page对象
      if (wxPrevPage1) {
        //修改当前页面的数据
        wxPrevPage1.setData({
          musicPlay: false,
          musicPlayingStatus: _musicPlayingStatus
        })
      }
      if (wxPrevPage2) {
        //修改当前页面的数据
        wxPrevPage2.setData({
          musicPlay: false,
          musicPlayingStatus: _musicPlayingStatus
        })
      }
      if (wxPrevPage3) {
        //修改当前页面的数据
        wxPrevPage3.setData({
          musicPlay: false,
          musicPlayingStatus: _musicPlayingStatus
        })
      }
    })
  },
  onShow: function () {
    backgroundAudioManager = wx.getBackgroundAudioManager();
    this.globalData.musicData = wx.getStorageSync('musicData') || {};
    this.globalData.musicPlayingStatus = wx.getStorageSync('musicPlayingStatus') || {};
    this.globalData.playstatus = wx.getStorageSync('playstatus') || 1;
    this.globalData.playstatusName = wx.getStorageSync('playstatusName') || '随机播放';
    this.globalData.playstatusImg = wx.getStorageSync('playstatusImg') || "../../images/sjbf.png";
  },
  onHide: function () {
    wx.setStorageSync('musicData', this.globalData.musicData);
    wx.setStorageSync('musicPlayingStatus', this.globalData.musicPlayingStatus);
  },
  getUserInfo(e,pageThis) {
    //判断用户是否同意授权)
    let that = this;
    if (e.detail.errMsg == "getUserInfo:ok") {
      //同意
      wx.setStorageSync('userInfo', e.detail);
      that.globalData.userInfo = e.detail;
      pageThis.agreelogin(e.detail);
    } else {
      pageThis.openSetting();
    }
  },
  //同意授权
  agreelogin(userdata,c) {
    let that = this;
    login(userdata)
      .then(res => {
        if (res.data.code == "SUCCESS") {
          that.globalData.loginKey = res.data.data.loginKey;
          wx.setStorageSync('loginKey', res.data.data.loginKey);
          //调用每日推荐接口
          c && c();
        } else {
          console.log('获取loginkey失败')
        }
      }, err => {
        console.log('登录失败')
      })
  },
  openSetting: function (pageThis) {
    wx.showModal({
      title: '授权失败',
      showCancel: false,
      content: '没有授权的情况下，无法发为您提供服务，请打开小程序授权',
      success: function (res) {
        if (res.confirm) {
          wx.openSetting({
            complete: function (data) {
              if (data.authSetting["scope.userInfo"]) {
                isUserAutor()
                  .then(res => {
                    wx.setStorageSync('userInfo', res);
                    pageThis.agreelogin(res)
                  })
              } else {
                pageThis.openSetting();
              }
            }
          })
        }
      }
    })
  },
  //开启监听背景音乐播放
  goPlay(_type) {
    let _this = this;
    let _name, _src, _mid, _musicData;
    let list = this.globalData.musicPlayList;
    let playStus = this.globalData.playstatus;
    let wxCurrPage = getCurrentPages();//获取当前页面的页面栈
    let wxPrevPage1 = wxCurrPage[wxCurrPage.length - 1];//获取上级页面的page对象
    //匹配当前列表的mid

    let { inlist, listIndex } = findMid(_this.globalData.musicData.mId, list);
    if (!inlist) {
      if (list.length > 0) {
        toast('播放列表第一首歌曲')
      } else {
        toast('没有找到下一首歌曲')
        return;
      }
    }

    if (_type == "prev") {
      if (listIndex != 0) {
        _mid = list[listIndex - 1].mId;
        _musicData = list[listIndex - 1];
        _name = list[listIndex - 1].name;
        _src = list[listIndex - 1].mUrl;
      } else {
        _mid = list[0].mId;
        _musicData = list[0];
        _name = list[0].name;
        _src = list[0].mUrl;
      }
    } else if (_type == "next") {
      if (listIndex < list.length - 1) {
        _mid = list[listIndex + 1].mId;
        _musicData = list[listIndex + 1];
        _name = list[listIndex + 1].name;
        _src = list[listIndex + 1].mUrl;
      } else {
        _mid = list[0].mId;
        _musicData = list[0];
        _name = list[0].name;
        _src = list[0].mUrl;
      }
    } else if (_type == "first") {
        
        _mid = list[0].mId;
        _musicData = list[0];
        _name = list[0].name;
        _src = list[0].mUrl;

        if (wxPrevPage1) {
          wxPrevPage1.setData({
            mid: _mid
          })
        }
      
    }else {
      if (playStus == 1) {
        let _index = Math.floor((Math.random() * list.length));
        _name = list[_index].name;
        _mid = list[_index].mId;
        _musicData = list[_index];
        _src = list[_index].mUrl;
      }
      else if (playStus == 2) {
        _name = list[listIndex].name;
        _src = list[listIndex].mUrl;
        _mid = list[listIndex].mId;
        _musicData = list[listIndex];
      } else {
        if (listIndex < list.length - 1) {
          _mid = list[listIndex + 1].mId;
          _musicData = list[listIndex + 1];
          _name = list[listIndex + 1].name;
          _src = list[listIndex + 1].mUrl;
        } else {
          _mid = list[0].mId;
          _musicData = list[0];
          _name = list[0].name;
          _src = list[0].mUrl;
        }
      }
    }
    if (wxPrevPage1){
      wxPrevPage1.setData({
        musicData: _musicData
      })
    }
    if (wxPrevPage1 && wxPrevPage1.route == "pages/player/player") {
      wx.setNavigationBarTitle({
        title: _name
      })

    }
    //把这首歌的信息记录下来
    _this.globalData.musicData = _musicData;
    backgroundAudioManager.title = _name || '舞爱音乐'; //播放音乐名
    backgroundAudioManager.src = _src;// 设置了 src 之后会自动播放
  },
  //初始化播放
  onPlay(_src, _name) {
    backgroundAudioManager.title = _name || '舞爱音乐'; //播放音乐名
    backgroundAudioManager.src = _src;// 设置了 src 之后会自动播放
  },
  //检测当前是否有音乐地址
  isMusicSrc() { 
    if (typeof backgroundAudioManager.src == 'undefined') {
      return false
    }
    return true;
  },
  //暂停播放
  pause() {
    backgroundAudioManager.pause()
  },
  //继续播放
  play() {
    backgroundAudioManager.play()
  },
 
  //底部组件通用
  footplay: function (pageThis) {
    let that = this;
    let _musicPlay = pageThis.data.musicPlay;
    if (!pageThis.data.musicData.mUrl) {
      toast('播放队列暂无歌曲')
      return
    };
    if (pageThis.data.musicPlay) {
      that.pause();
    } else {
      if (that.isMusicSrc()) {
        that.play();
      } else {
        that.onPlay(pageThis.data.musicData.mUrl, pageThis.data.musicData.name);
      }
    }
  },
  //底部通用
  footcloseAll(pageThis) {
    pageThis.setData({
      musicListHidden: true,
      playCoverHidden: true
    })
  },
  //显示歌
  footshowList(pageThis) {
    pageThis.setData({
      musicListHidden: false,
      playCoverHidden: false
    })
  },
  //加载歌单
  footloadMusicPlayList(pageThis) {
    let _this = this;
    //防止一直加
    if (pageThis.data.isLoding || pageThis.data.musiclistPage.current == pageThis.data.musiclistPage.last) {
      return;
    }
    pageThis.setData({
      isLoding: true
    })
    _this.footgetMusicList(2, pageThis.data.musiclistPage.next, pageThis)
  },

  footgetMusicList(changtype, pageindex, pageThis) {
    //changtype 1首次加载  2上拉加载
    let that = this;
    musicPlayList(pageindex)
      .then(res => {
        if (changtype == 1) {
          pageThis.setData({
            musiclist: res.data.lists,
            musiclistPage: res.data.pages
          })
          that.globalData.musicPlayList = res.data.lists;
          
        } else {
          let _nowLists = pageThis.data.musiclist.concat(res.data.lists);
          pageThis.setData({
            musiclist: _nowLists,
            musiclistPage: res.data.pages
          })
          that.globalData.musicPlayList = _nowLists;
          
        }
        pageThis.setData({
          isLoding: false
        })
      }, err => {

      })
  },
  //播放记录点击播放
  footplayThisSong(e, pageThis) {
    let that = this;
    detail(e.currentTarget.dataset.mid)
      .then(res => {
        that.globalData.musicData = res.data;
        pageThis.setData({
          musicData: res.data,
          thisMid: e.currentTarget.dataset.mid
        })
        that.onPlay(res.data.mUrl, res.data.name);
      })
  },
  //删除歌曲
  footdeleteMusic(e, pageThis) {
    let _data = e.currentTarget.dataset;
    let that = this;
    let { inlist, listIndex } = findMid(_data.mid, pageThis.data.musiclist)
    wx.showModal({
      title: '温馨提示',
      content: '确定移除这首歌？',
      success: function (res) {
        if (res.confirm) {
          if (inlist) {
            let _newArr = pageThis.data.musiclist;
            _newArr.splice(listIndex, 1);
            pageThis.setData({
              musiclist: _newArr
            })
            that.globalData.musicPlayList = _newArr;
            toast('删除成功')
          }
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  //取消收藏
  footmusicCollectCancel(e, pageThis) {
    let _data = e.currentTarget.dataset;
      //自定义的属性
      let _actiontype = "";

      if (_data.iscollect) {
        _actiontype = "musicCollectCancel"
      } else {
        _actiontype = "musicCollect"
      }
      save(_data.mid, _actiontype)
        .then(res => {
          let _thisList = pageThis.data.musiclist;
          _thisList[_data.index].collect = !_thisList[_data.index].collect;
          pageThis.setData({
            musiclist: _thisList
          })
          if (!_data.iscollect) {
            toast('收藏成功')
          } else {
            toast('取消收藏')
          }
        })
    
  },
  like(pageThis) {
    let that = this;
    let like = pageThis.data.playstatus;
    if (like == 1) {
      pageThis.setData({
        playstatus: 2,
        playstatusImg: '../../images/dqxh.png',
        playstatusName: '单曲循环'
      })
      toast('单曲循环')
      that.globalData.playstatus = 2;
      that.globalData.playstatusName = '单曲循环';
      that.globalData.playstatusImg = '../../images/dqxh.png';
      wx.setStorageSync('playstatus', 2);
      wx.setStorageSync('playstatusName', '单曲循环');
      wx.setStorageSync('playstatusImg', '../../images/dqxh.png');
    } else if (like == 2) {
      pageThis.setData({
        playstatus: 3,
        playstatusImg: '../../images/sxbf.png',
        playstatusName: '顺序播放'
      })
      toast('顺序播放')

      that.globalData.playstatus = 3;
      that.globalData.playstatusName = '顺序播放';
      that.globalData.playstatusImg = '../../images/sxbf.png';
      wx.setStorageSync('playstatus', 3);
      wx.setStorageSync('playstatusName', '顺序播放');
      wx.setStorageSync('playstatusImg', '../../images/sxbf.png');
    } else {
      toast('随机播放')

      pageThis.setData({
        playstatus: 1,
        playstatusImg: '../../images/sjbf.png',
        playstatusName: '随机播放'
      })
      that.globalData.playstatus = 1;
      that.globalData.playstatusImg = '../../images/sjbf.png';
      that.globalData.playstatusName = '随机播放';
      wx.setStorageSync('playstatus', 1);
      wx.setStorageSync('playstatusName', '随机播放');
      wx.setStorageSync('playstatusImg', '../../images/sjbf.png');
    }
  },
  globalData: {
    userInfo: null,
    loginKey: null,
    musicPlayingStatus: {    
      timerBegin: '0:00', //当前播放时间
      timerEnd: "0:00", //总时间
      progress: 0  //对应进度
    },//音乐的播放状态
    musicData: {
      collect: 0,
      cover: null,
      duration: "",
      hot: "",
      mId: "",
      mUrl: "",
      name: ""
    },//当前音乐的信息
    musicPlayList: [],//播放记录    
    musicPlay: false,
    showGoBack:false,
    playstatus: 1,//用户选择的播放；模式
    playstatusName: "随机播放",
    playstatusImg: "../../images/sjbf.png"
  }
})