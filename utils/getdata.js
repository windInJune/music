import { getApi} from './common.js'
//每日推荐
const dailyRecomment = () => {
  return getApi('vapi/music/dailyRecomment')
}
//音乐展示 音乐数据集
const list = (data) => {
  let _newData = Object.assign({}, data,{
    limit:100
  })
  return getApi('vapi/music/list', _newData)
}
//用户日志 歌单音乐数据集
const songSheetMusicList = (pageindex,mid) => {
  return getApi('vapi/log/songSheetMusicList',{
    'page':pageindex,
    'ssId':mid
  })
}
//音乐收藏
const save = (id,action,ssid) => {
  let _data = {};
  _data.id = id;
  _data.action = action;
  if(ssid){
    _data.ssId = ssid;
  }
  return getApi('vapi/log/save', _data)
}
//音乐播放记录集
const musicPlayList = (pageindex) => {
  return getApi('vapi/log/musicPlayList', {
    'page': pageindex
  })
}

//添加歌曲到歌单
const addMusicToSongSheet = (id,ssId) => {
  console.log(ssId)
  return getApi('vapi/log/save', {
    'id':id,
    'action':'addMusicToSongSheet',
    'ssId': ssId
  })
}
//添加歌单
const addSong = (name) => {
  return getApi('vapi/log/save', {
    'action':'addSongSheet',
    'name': name
  })
}
//删除歌单
const deleteSong = (ssid) => {
  return getApi('vapi/log/save', {
    'action':'delSongSheet',
    'ssId': ssid
  })
}
//歌单全部播放
const importIntoMusic = (ssId) => {
  return getApi('vapi/log/save', {
    'action':'importIntoMusicPlayFromSongSheetMusic',
    'ssId': ssId
  })
}
//创建默认歌单
const creatDetaultSongSheet = () => {
  return getApi('vapi/log/save', {
    'action':'creatDetaultSongSheet'
  })
}
//音乐播放
const detail = (id) => {
  return getApi('vapi/music/detail', {
    'id': id
  })
}
//歌单数据集
const songSheetlist = (pageindex) => {
  return getApi('vapi/log/songSheetlist', {
    'page': pageindex
  })
}

//音乐收藏
const musicCollectList = (pageindex) => {
  return getApi('vapi/log/musicCollectList', {
    'page': pageindex
  })
}
//查找name
const searchlist = (name) => {
  return getApi('vapi/music/list', {
    'name':name,
    'limit': 100
  })
}
//从播放记录删除音乐
const delMusicFromMusicPlay = (id) => {
  return getApi('vapi/log/save', {
    'id': id,
    'action': 'delMusicFromMusicPlay'
  })
}
//意见反馈
const feedback = (content) => {
  return getApi('vapi/log/save', {
    'content':content,
    'action': 'feedback'
  })
}
export { delMusicFromMusicPlay, creatDetaultSongSheet, feedback, deleteSong, searchlist,importIntoMusic,addMusicToSongSheet, addSong, songSheetlist, list, dailyRecomment, songSheetMusicList, musicPlayList, save, detail,musicCollectList};

