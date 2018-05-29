const app = getApp();
import { toast} from '../../utils/util.js';
import { deleteSong, songSheetlist, detail } from '../../utils/getdata.js';
Page({
  data: {
    id: 0,//tab切换
    mid: null,
    isLoding: false,
    mylists: [],
    pages: [],
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
  onLoad: function (options) {
    wx.hideShareMenu();
    let that = this;
    that.setData({
      musicPlay: app.globalData.musicPlay,
      musicPlayingStatus: app.globalData.musicPlayingStatus,
      musicData: app.globalData.musicData,
      playstatus: app.globalData.playstatus,
      playstatusName: app.globalData.playstatusName,
      playstatusImg: app.globalData.playstatusImg
    })
    this.getsongSheetlist(1, 1);
    this.getMusicList(1, 1)//获取播放记录第一页

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
    that.getsongSheetlist(2, that.data.pages.next)
  },
  singList: function (e) {
    let _data = e.currentTarget.dataset;
    wx.navigateTo({
      url: `../singList/singList?mid=${_data.id}&type=${_data.type}&name=${_data.name}&time=${_data.time}`
    })
  },
  deletelist: function (e) {
    let _this = this;
    wx.showModal({
      title: '温馨提示',
      content: '确定删除歌单？',      
      success: function (res) {
        //删除歌单
        if (res.confirm) {
          deleteSong(e.currentTarget.dataset.ssid)
            .then(res => {
              console.log(res)
              if (res.code == "SUCCESS") {
                let _list = _this.data.mylists;
                _list.splice(e.currentTarget.dataset.index, 1);
                _this.setData({
                  mylists: _list
                })
                toast('删除成功')
              } else {
                toast('删除失败')
              }
            })
        }

      }
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
    else if (_data.dataset && _data.dataset.sharetype == 1) {
      //歌单分享
      return {
        title: `我发现这个歌单不错，快来听一听吧！`,
        imageUrl: `../../images/defaultimg.png`,
        path: `/pages/singList/singList?mid=${_data.dataset.mid}&name=${_data.dataset.name}&time=${_data.dataset.time}&type=2`,
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
      return {
        title: '专业🈶又懂你的广场舞音乐平台！',
        path: '/pages/index/index',
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
  getsongSheetlist(changtype, pageindex) {
    // changtype 1是首次加载 2是上拉加载
    let _this = this;
    songSheetlist(pageindex)
      .then(res => {
        console.log(res)
        if (changtype == 1) {
          _this.setData({
            mylists: res.data.lists,
            pages: res.data.pages
          })
        } else {
          let _nowLists = _this.data.lists.concat(res.data.lists);
          _this.setData({
            mylists: _nowLists,
            musiclistPage: res.data.pages,
            page: res.data.pages
          })
        }
        _this.setData({
          isLoding: false
        })
      }, err => {
        console.log('err')
      })
  },
  like() {
    app.like(this);
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