import { toast} from '../../utils/util.js';
import { feedback } from '../../utils/getdata.js';
var app = getApp();
Page({
  data: {
    num:0,//当前字数
    content: '',//反馈内容
    btnText:'提交',
    onceTap:false
  },
  onLoad: function (options) {
    wx.hideShareMenu();
  },
  back:function(){
    wx.navigateBack({
      delta:'1'
    })
  },
  liuyan: function (e) {
    let that = this;
    that.setData({
      num: e.detail.value.length,
      content: e.detail.value
    })
  },
  submit:function(){
    let that = this;
    //防止重复提交
    if (that.data.onceTap){
      return;
    }
    that.setData({
      onceTap: true
    })
    if (that.data.content.length >= 10) {
      feedback(that.data.content)
       .then(res => {
         toast('提交成功')         
       })
      that.back();
    } else {
      toast('不要少于10个字～')
      that.setData({
        onceTap: false
      })
    }
    
    
  }
})