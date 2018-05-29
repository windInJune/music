const app = getApp();
import { formate, getProgress } from '../../utils/util.js';

Component({

  behaviors: [],

  properties: {
    myProperty: { // 属性名
      type: String, // 
      value: '', // 属性初始值（可选），如果未指定则会根据类型选择一个
      observer: function (newVal, oldVal) { } 
    },
  },
  data: {
    musicPlayingStatus: {},//音乐的播放状态
    musicData: {},//当前音乐的信息
    historyList: []
  }, // 私有数据，可用于模版渲染

  // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
  attached: function () { },
  created(){
    console.log('......')
    // if (app.globalData.musicPlayingStatus.musicIsPlay) {
    //   app.onPlay(app.globalData.musicData.mUrl, app.globalData.musicData.name)
    // }
  },
  ready: function () {
    console.log('组件初始化')
    this.setData({
      musicData: app.globalData.musicData,
      musicPlayingStatus: app.globalData.musicPlayingStatus,
      historyList: app.globalData.historyList
    })

  },
  moved: function () { },
  detached: function () { },

  methods: {
    detail(){
      // 进入播放页面
        wx.navigateTo({
          url: `../player/player?mid=${app.globalData.musicData.mId}`,
        })  
    },
    play: function () {
      let that = this;
      console.log(that.data.musicPlayingStatus)
      let _musicPlayingStatus = that.data.musicPlayingStatus;
      _musicPlayingStatus.musicIsPlay = !that.data.musicPlayingStatus.musicIsPlay;
      if (that.data.musicPlayingStatus.musicIsPlay) {
        app.pause();
        app.closePlay();
      } else {
        app.play();
        that.timerPros();
      }
      that.setData({
        musicPlayingStatus: _musicPlayingStatus
      })
    },
    timerPros() {
      let _this = this;
      clearInterval(app.globalData.globalTimer)
      app.globalData.globalTimer = setInterval(function () {
        let { _duration, _currentTime, _paused } = app.goPlay();
        let _musicPlayingStatus = _this.data.musicPlayingStatus;
        _musicPlayingStatus.musicIsPlay = !_paused;
        _musicPlayingStatus.timerBegin = formate(_currentTime);
        _musicPlayingStatus.timerEnd = formate(_duration);
        _musicPlayingStatus.progress = getProgress(_currentTime, _duration);
        _this.setData({
          musicPlayingStatus: _musicPlayingStatus
        })
      }, 1000)
    }
  }

})