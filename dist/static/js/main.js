
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