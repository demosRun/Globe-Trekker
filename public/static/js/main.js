
function changeDecorate($el, deviseW, deviseH) {
  if (!$el) return;
  // 设计高度
  // 设计宽度
  var sw = document.body.offsetWidth / deviseW;
  var sh = document.body.offsetHeight / deviseH;
  ms = sw > sh ? sh : sw; // 获取页面安全区
  console.log(sw, sh)
  var safety = $el.querySelectorAll('.safety')[0]
  if (!safety) {
    console.error('没有找到安全区元素!')
    return
  }
  // 设置安全区属性
  safety.setAttribute('style', "overflow: hidden;position: absolute;transform-origin: center;transform:scale(" + ms + ");width: " + deviseW + "px;height:" + deviseH + "px;")

  if (sw > sh) {
    safety.style.top = -deviseH / 2 * (1 - sh) + "px"
    safety.style.left = -deviseW / 2 * (1 - sw) + "px"
  } else {
    safety.style.top = -deviseH / 2 * (1 - sh) + "px"
    safety.style.left = -deviseW / 2 * (1 - sw) + "px"
  }
}

// 微信加载完毕自动播放音乐
document.addEventListener("WeixinJSBridgeReady", function () {
  var music = new Audio("./static/resource/bg.mp3")
  music.loop = true
  music.play()
}, false)

// 判断是否微信登陆
function isWeiXin() {
  var ua = window.navigator.userAgent.toLowerCase();
  if (/micromessenger/.test(ua)) {
    return true;
  }
  return false;
}
 
var isOnline = /people(\.com)?\.cn/.test(location.href)

  // 仅在微信上使用微信授权， 其他的平台例如 微博， 不要使用授权
  if (isWeiXin() && isOnline) {

      // 仅仅线上获取昵称
      getUserinfo()
  }

/** 获取用户信息 */

function getUserinfo() {
  // 测试地址,  redirect_uri=http://bbs1.people.com.cn/wb/wxBaseInfo421594.action 需要修改为新申请的授权地址
  var url =
    'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx020d85a0aef80286&redirect_uri=http://bbs1.people.com.cn/wb/wxBaseInfo429449.action&response_type=code&scope=snsapi_userinfo#wechat_redirect';
  var _location = window.location.href;

  function getParams(str) {
    var reg = /([^&?#]+)=([^&?#]+)/g;
    var obj = {};
    str.replace(reg, function () {
      obj[arguments[1]] = arguments[2];
    })
    return obj;
  }

  var params = getParams(_location);

  if (params.name) {
    // 获取微信昵称和头像
    window.wxName = wxName = decodeURIComponent(params.name);
    window.wxFace = wxFace = decodeURIComponent(params.face);

    if (window.wxFace) {
      $('.user')[0].src = window.wxFace
    }

  } else {
    window.location.href = url;
  }
}