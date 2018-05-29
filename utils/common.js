let { toast } = require("./util.js");
const BASEURL = "https://v-test.vdailian.com/"; //开发
// const BASEURL = "https://v-api.vdailian.com/"; //线上
//登录
const getLoginKey = (code, token, userInfo) => {
  let promise = new Promise(function (resolve, reject) {
    wx.request({
      method: 'POST',
      responseType: 'text',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Token-Key': token.TokenKey,
        'Token-Value': token.TokenValue
      },
      url: BASEURL + 'vapi/passport/wxlogin',
      data: {
        code: code,
        encryptedData: userInfo.encryptedData,
        iv: userInfo.iv,
        source: 'wayy'
      },
      success: function (res) {
        resolve(res);
      },
      fail: function (error) {
        reject(error);
      }
    })
  })
  return promise;
}
//获取toKen
const getToken = () => {
  let promise = new Promise(function (resolve, reject) {
    wx.request({
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      url: BASEURL + 'vapi/token/get',
      success: function (res) {
        if (res.statusCode == 200) {
          wx.setStorageSync('token', res.data.data);
          resolve(res.data);
        } else {
          reject(error);
        }
      }
    })
  })
  return promise;
}
//api封装
const getOldApi = (urls, options = {}, METHOD = "POST") => {
  let promise = new Promise(function (resolve, reject) {
    let loginkey = wx.getStorageSync('loginKey')
    let _data = Object.assign({}, options, {
      'loginKey': loginkey
    })
    getToken().then(res => {
      wx.request({
        method: METHOD,
        responseType: 'text',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Token-Key': res.data.TokenKey,
          'Token-Value': res.data.TokenValue
        },
        url: BASEURL + urls,
        data: _data,
        success: function (res) {
          resolve(res.data);
        },
        fail: function (err) {
          reject(err)
        },
        complete: function () {
        }
      })
    }, err => {
      toast('获取token失败')
      reject(err);
    })
  })

  return promise;
}
//新api封装
const getApi = (urls, options = {}, METHOD = "POST") => {
  let promise = new Promise(function (resolve, reject) {
    let loginkey = wx.getStorageSync('loginKey');
    let tokenKey = wx.getStorageSync('token').TokenKey || null;
    let tokenValue = wx.getStorageSync('token').TokenValue || null;
    let _data = Object.assign({}, options, {
      'loginKey': loginkey
    })
    if (!tokenKey || !tokenValue) {
      getTokenApi(urls, _data, resolve, reject)
    } else {
      wx.request({
        method: METHOD,
        responseType: 'text',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Token-Key': tokenKey,
          'Token-Value': tokenValue
        },
        url: BASEURL + urls,
        data: _data,
        success: function (res) {
          if (res.data.code == "TOKEN_KEY_NULL") {
            getTokenApi(urls, _data, resolve, reject)
          } else {
            resolve(res.data);
          }
        },
        fail: function (err) {
          reject(err)
        },
        complete: function () {
        }
      })
    }
  })

  return promise;
}
//token过期的情况
const getTokenApi = (urls, _data, resolve, reject) => {
  getToken().then(res => {
    wx.request({
      method: METHOD,
      responseType: 'text',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Token-Key': res.data.TokenKey,
        'Token-Value': res.data.TokenValue
      },
      url: BASEURL + urls,
      data: _data,
      success: function (res) {
        resolve(res.data);
      },
      fail: function (err) {
        reject(err)
      },
      complete: function () {
      }
    })
  }, err => {
    toast('获取token失败')
    reject(err);
  })
}
//判断用户是否授权
const isUserAutor = () => {
  let promise = new Promise(function (resolve, reject) {
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: function (res) {
              resolve(res)
            }
          })
        } else {
          reject()
        }
      }
    })
  })
  return promise;
}
//
const login = (getUserInfo) => {
  ;
  let promise = new Promise(function (resolve, reject) {
    wx.login({
      success: getCode => {
        //获取toKen
        getToken()
          .then(getToken => {
            getLoginKey(getCode.code, getToken.data, getUserInfo)
              .then(res => {
                //获取loginkey成功
                resolve(res)
              }, err => {
                //获取loginkey失败
                reject();
              })

          }, err => {
            toast('获取token失败')
          })
      }
    })
  })
  return promise;
}
export { getApi, getToken, getLoginKey, isUserAutor, login };