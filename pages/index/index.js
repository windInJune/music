//index.js
//获取应用实例
import { getLoginKey, getToken, getApi, isUserAutor, login } from '../../utils/common.js';
import { toast, formate, getProgress, findMid} from '../../utils/util.js';
import { dailyRecomment, creatDetaultSongSheet, musicPlayList, detail } from '../../utils/getdata.js';

const app = getApp();
Page({
  data: {
    id: 0,//tab切换
    dailyRecomment: [],
    getButton: true,//控制启动页
    userInfo: {},
    musicPlay: false,
    musicPlayingStatus: {},//音乐的播放状态
    musicData: {},//当前音乐的信息
    isLoding: false,
    musiclist: [],//音乐播放列表
    musiclistPage: [],//分页
    musicListHidden: true,
    playCoverHidden:true,
    playstatus: 1, //播放模式  // 1随机 2单曲重复  3顺序
    playstatusImg: '../../images/sjbf.png',//播放模式图片
    playstatusName: '随机播放',
    scrollHeight:0
  },
  onLoad: function () {
    let that = this;
    //判断用户是否授权过
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: parseInt(res.windowHeight) - 46
        })
      }
    })
    if (wx.getStorageSync('loginKey')) {
      dailyRecomment()
        .then(res => {
          that.setData({
            dailyRecomment: res.data,
            userInfo: JSON.parse(wx.getStorageSync('userInfo').rawData)
          })
        })
      that.getMusicList(1, 1)//获取播放记录第一页
    } else {
      that.setData({
        getButton: false
      })
    }
  },

  onShow() {
    console.log('back')
    let that = this;
    that.setData({
      musicPlay: app.globalData.musicPlay, 
      musicPlayingStatus: app.globalData.musicPlayingStatus,           
      musicData: app.globalData.musicData,
      playstatus: app.globalData.playstatus,
      playstatusName: app.globalData.playstatusName,
      playstatusImg: app.globalData.playstatusImg
    })
  },
  getUserInfo(e) {
    app.getUserInfo(e,this);
  },
  //同意授权
  agreelogin(userdata) {
    let that = this;
    app.agreelogin(userdata, function(){
      creatDetaultSongSheet()
        .then(res => {
          console.log(res)
        })
      dailyRecomment()
        .then(res => {
          that.setData({
            dailyRecomment: res.data,
            userInfo: JSON.parse(wx.getStorageSync('userInfo').rawData),
            getButton: true

          })
        })
      that.getMusicList(1, 1)//获取播放记录第一页 
    });
  },
  openSetting: function () {
    app.openSetting(this);
  },
  like() {
    app.like(this);
  },
  // 手动切换
  check: function (e) {
    let that = this;
    that.setData({
      id: e.currentTarget.dataset.id
    })
  },
  // 舞曲&我的 页面滑动切换
  swiperChange: function (e) {
    let that = this;
    that.setData({
      id: e.detail.current
    })
  },
  // 进入搜索页面
  search: function () {
    wx.navigateTo({
      url: '../search/search',
    })
  },
  // 进入我的歌单
  my_singList: function (e) {
    wx.navigateTo({
      url: '../my_singList/my_singList',
    })
  },
  // 我的收藏
  collect: function () {
    wx.navigateTo({
      url: '../collection/collection',
    })
  },
  // 最近播放
  play_history: function () {
    wx.navigateTo({
      url: '../play_history/play_history',
    })
  },
  //进入歌单
  singList: function (e) {
    wx.navigateTo({
      url: `../singList/singList?mid=${e.currentTarget.dataset.id}&type=${e.currentTarget.dataset.type}`,
    })
  },
  //意见反馈
  advice: function () {
    wx.navigateTo({
      url: '../advice/advice',
    })
  },
  // 分享配置
  onShareAppMessage: function (res) {
    if(res.from == "menu"){
      return {
        title: '专业又懂你的广场舞音乐平台！',
        path: '/pages/index/index',
        success: function (res) {
          toast('分享成功')
        },
        fail: function (res) {
          toast('分享失败')
        }
      }
    }
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
    else if (_data.dataset && _data.dataset.sharetype == 1) {
      //歌单分享
      return {
        title: `我发现这个歌单不错，快来听一听吧！`,
        imageUrl: `${res.target.dataset.img}`,
        path: `/pages/singList/singList?mid=${res.target.dataset.mid}&&type=1`,
        success: function (res) {
          toast('分享成功')
        },
        fail: function (res) {
          toast('分享失败')                    
        }
      }
    }
  },
  // 进入播放页面
  detail() {
    if (!app.globalData.musicData.mId) {
      toast('播放队列暂无歌曲～')
      return;
    }
    wx.navigateTo({
      url: `../player/player?mid=${app.globalData.musicData.mId}`,
    })
  },  
  play: function () {
    let that = this;
    let _musicPlay = !that.data.musicPlay;
    if (!that.data.musicData.mUrl) {
      toast('播放队列暂无歌曲~')
      return
    };
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
  },
  //底部通用
  closeAll() {
    this.setData({
      musicListHidden: true,
      playCoverHidden: true
    })
  },
  //显示歌
  showList() {
    this.setData({
      musicListHidden: false,
      playCoverHidden: false
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
  //播放记录点击播放
  playThisSong(e) {
    let that = this;
    detail(e.currentTarget.dataset.mid)
      .then(res => {
        app.globalData.musicData = res.data;
        that.setData({
          musicData: res.data,
          musicPlay: true,
          thisMid: e.currentTarget.dataset.mid
        })
        app.onPlay(res.data.mUrl, res.data.name);
      })
  },
  //删除歌曲
  deleteMusic(e) {
    let _data = e.currentTarget.dataset;
    let { inlist, listIndex } = findMid(_data.mid, this.data.musiclist) 
    let that = this;   
    wx.showModal({
      title: '温馨提示',
      content: '确定移除这首歌？',
      success: function (res) {
        if (res.confirm) {
          if (inlist) {
            let _newArr = that.data.musiclist;
            _newArr.splice(listIndex, 1);
            that.setData({
              musiclist: _newArr
            })
            app.globalData.musicPlayList = _newArr;
            toast('删除成功')
          }
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  },
  musicCollectCancel(e){
    app.footmusicCollectCancel(e,this)
  }
})

