
const formatTime = timeStamp  => {
  var date = new Date();
  date.setTime(timeStamp * 1000);
  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  m = m < 10 ? ('0' + m) : m;
  var d = date.getDate();
  d = d < 10 ? ('0' + d) : d;
  var h = date.getHours();
  h = h < 10 ? ('0' + h) : h;
  var minute = date.getMinutes();
  var second = date.getSeconds();
  minute = minute < 10 ? ('0' + minute) : minute;
  second = second < 10 ? ('0' + second) : second;
  return y + '-' + m + '-' + d + ' ' + h + ':' + minute;
} 

const toast = (msg,icon = 'none',time = 2000) => {
  wx.showToast({
    title: msg,
      icon: icon,
        duration: time
      })
}

const getProgress = (now,all) => {
    return parseInt((parseFloat(now) / parseFloat(all)) * 100 )
}

//格式化时间，将秒数转为0:00格式
const formate = n => {
  let minute = Math.floor(n / 60);
  let seconds = Math.ceil(n % 60);
  seconds = seconds.toString();
  seconds = seconds[1] ? seconds : '0' + seconds;
  return minute + ':' + seconds;
}

const findMid = (mid,list) => {
    for(let i = 0;i<list.length;i++){
      if (mid == list[i].mId){
        return {inlist:true,listIndex:i}
      } 
    }
    return { inlist: false, listIndex: null }
}
export { findMid, formatTime, toast, formate, getProgress}