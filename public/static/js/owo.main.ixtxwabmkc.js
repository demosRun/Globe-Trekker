// Wed Sep 04 2019 23:08:02 GMT+0800 (GMT+08:00)

"use strict";

// 存储页面基本信息
var owo = {
  // 页面默认入口 如果没有设置 则取第一个页面为默认页面
  entry: "one",
  // 全局方法变量
  tool: {},
  // 框架状态变量
  state: {}
};
/*
  存储每个页面的函数
  键名：页面名称
  键值：方法列表
*/

owo.script = {
  "one": {
    "created": function created() {
      var startIcon = this.query('.start')[0]; // 加载动画

      var queue = new createjs.LoadQueue();
      queue.loadManifest([{
        src: "./static/resource/icon-1.png"
      }, {
        src: "./static/resource/icon-2.png"
      }, {
        src: "./static/resource/icon-3.png"
      }, {
        src: "./static/resource/icon-4.png"
      }, {
        src: "./static/resource/loading-bar.png"
      }, {
        src: "./static/resource/page.png"
      }, {
        src: "./static/resource/people.png"
      }, {
        src: "./static/resource/scroll.png"
      }, {
        src: "./static/resource/two-bg.jpg"
      }, {
        src: "./static/resource/two-button.png"
      }, {
        src: "./static/resource/two-logo.png"
      }, {
        src: "./static/resource/two-text.png"
      }, {
        src: "./static/resource/two-tip-close.png"
      }, {
        src: "./static/resource/two-tip-title.png"
      }, {
        src: "./static/resource/two-title.png"
      }, {
        src: "./static/resource/click.mp3"
      }, {
        src: "./static/resource/check.png"
      }, {
        src: "./static/resource/cloud.png"
      }, {
        src: "./static/resource/five-button.png"
      }, {
        src: "./static/resource/five-scroll-1.png"
      }, {
        src: "./static/resource/bg.mp3"
      }]);
      queue.on("progress", function (event) {
        var left = queue.progress * 100 - 12;
        if (!left || left < 0) left = 0;
        startIcon.style.left = left + "%";
      });
      queue.on("complete", function () {
        setTimeout(function () {
          owo.go('two', 'fade', 'moveFromRight', 'fade', 'moveFromLeft', true);
        }, 200);
      }); // 不断地更换加载文字
    }
  },
  "two": {
    "created": function created() {
      var _this = this;

      changeDecorate(this.$el, 750, 1508);
      owo.tool.animate('fadeIn', this.query('.logo')[0], 200);
      owo.tool.animate('fadeIn', this.query('.text')[0], 200);
      owo.tool.animate('fadeInRight', this.query('.people')[0], 500);
      owo.tool.animate('fadeIn', this.query('.title')[0], 500);
      owo.tool.animate('fadeIn', this.query('.button')[0], 500);
      setTimeout(function () {
        _this.query('.text')[0].style.animation = 'float 2s infinite alternate';
        _this.query('.scroll-box')[0].style.opacity = '1';
        _this.query('.scroll-box')[0].style.width = '767px';
      }, 1200); // 按钮脉冲效果

      owo.tool.animate('pulse', this.query('.button')[0], 1600);
    },
    "toThree": function toThree() {
      new Audio("./static/resource/click.mp3").play();
      owo.go('three', 'fade', 'moveFromRight', 'fade', 'moveFromLeft', true);
    }
  },
  "three": {
    "created": function created() {},
    "template": {
      "card": {
        "data": {
          "yuda": null,
          "number": 1,
          "allNumber": 0
        },
        "created": function created() {
          var _this2 = this;

          owo.state.code = 0;
          owo.state.checkList = [];
          this.data.yuda = new Stack(document.getElementById('stack_yuda'), {
            infinite: false,
            interval: 0,
            onEndStack: function onEndStack() {
              console.log('最后了');
            }
          }); // 获取总数

          setTimeout(function () {
            _this2.data.allNumber = _this2.query('.stack__item').length;
            _this2.query('.page')[0].innerText = _this2.data.number + ' / ' + _this2.data.allNumber;
          }, 0);
          setTimeout(function () {
            _this2.query('.next-button')[_this2.query('.next-button').length - 1].innerText = '查看我的等级';
          }, 1000); // 左滑下一个
          // 左右滑动

          owo.tool.touch({
            el: this.$el,
            end: function end(e) {
              console.log(e.swipe); // 向左滑动

              if (e.swipe[0] > 100) {
                _this2.accept();
              }
            }
          });
        },
        "inspect": function inspect(ind) {
          var list = [];
          var domList = this.query('.stack__item')[ind].getElementsByClassName('answer');
          var isCheck = false; // console.log(domList)

          for (var _ind = 0; _ind < domList.length; _ind++) {
            var element = domList[_ind];

            if (element.classList.contains('ischeck')) {
              isCheck = true;
              list.push(true);
            } else {
              list.push(false);
            }
          }

          if (isCheck) return list;else return null;
        },
        "setCheckList": function setCheckList(check) {
          var tempCheck = '';
          if (check[0]) tempCheck += 'a';
          if (check[1]) tempCheck += 'b';
          if (check[2]) tempCheck += 'c';
          if (check[3]) tempCheck += 'd';
          if (check[4]) tempCheck += 'e';
          owo.state.checkList.push(tempCheck);
        },
        "accept": function accept() {
          new Audio("./static/resource/click.mp3").play(); // 计算分数

          switch (this.data.number) {
            case 1:
              {
                var check = this.inspect(0);

                if (check === null) {
                  owo.tool.toast('本题还没有进行作答哦!');
                  return;
                }

                this.setCheckList(check);

                if (!check[0] && check[1] && check[2] && check[3]) {
                  owo.state.code++;
                }

                break;
              }

            case 2:
              {
                var _check = this.inspect(1);

                if (_check === null) {
                  owo.tool.toast('本题还没有进行作答哦!');
                  return;
                }

                this.setCheckList(_check);

                if (!_check[0] && (_check[1] || _check[2] || _check[3])) {
                  owo.state.code++;
                }

                break;
              }

            case 3:
              {
                var _check2 = this.inspect(2);

                if (_check2 === null) {
                  owo.tool.toast('本题还没有进行作答哦!');
                  return;
                }

                this.setCheckList(_check2);

                if (!_check2[0] && !_check2[1] && _check2[2] && !_check2[3]) {
                  owo.state.code++;
                }

                break;
              }

            case 4:
              {
                var _check3 = this.inspect(3);

                if (_check3 === null) {
                  owo.tool.toast('本题还没有进行作答哦!');
                  return;
                }

                this.setCheckList(_check3);

                if (_check3[0] && _check3[1] && _check3[2] && _check3[3]) {
                  owo.state.code++;
                }

                break;
              }

            case 5:
              {
                var _check4 = this.inspect(4);

                if (_check4 === null) {
                  owo.tool.toast('本题还没有进行作答哦!');
                  return;
                }

                this.setCheckList(_check4);

                if (_check4[0] && _check4[1] && _check4[2] && _check4[3] && _check4[4]) {
                  owo.state.code++;
                }

                break;
              }

            case 6:
              {
                var _check5 = this.inspect(5);

                if (_check5 === null) {
                  owo.tool.toast('本题还没有进行作答哦!');
                  return;
                }

                this.setCheckList(_check5);

                if (_check5[0] && _check5[1] && _check5[2] && _check5[3]) {
                  owo.state.code++;
                }

                break;
              }

            case 7:
              {
                var _check6 = this.inspect(6);

                if (_check6 === null) {
                  owo.tool.toast('本题还没有进行作答哦!');
                  return;
                }

                this.setCheckList(_check6);

                if (_check6[0] && _check6[1] && _check6[2] && _check6[3]) {
                  owo.state.code++;
                }

                break;
              }

            case 8:
              {
                var _check7 = this.inspect(7);

                if (_check7 === null) {
                  owo.tool.toast('本题还没有进行作答哦!');
                  return;
                }

                this.setCheckList(_check7);

                if (_check7[1] && _check7[2] && _check7[3]) {
                  owo.state.code++;
                }

                break;
              }
          }

          this.data.number++;

          if (this.data.number > this.data.allNumber) {
            owo.go('four', 'fade', 'moveFromRight', 'fade', 'moveFromLeft', true);
            return;
          }

          this.query('.page')[0].innerText = this.data.number + ' / ' + this.data.allNumber;
          this.data.yuda.accept();
        },
        "reject": function reject() {
          this.data.yuda.reject();
        },
        "checkItem": function checkItem(e) {
          new Audio("./static/resource/click.mp3").play();
          var parentElement = this.$event.target.parentElement;
          var answer = parentElement.querySelectorAll('.answer'); // console.log(this.$event.target.classList.contains('ischeck'))

          if (this.$event.target.classList.contains('ischeck')) {
            this.$event.target.classList.remove('ischeck');
          } else {
            this.$event.target.classList.add('ischeck');
          }
        },
        "prop": {}
      }
    }
  },
  "four": {
    "show": function show() {
      owo.state.overstep = 0;
      var str = '';

      for (var ind = 0; ind < owo.state.checkList.length; ind++) {
        str += "t".concat(ind + 1, "=").concat(owo.state.checkList[ind], "&");
      }

      $.ajax({
        url: 'http://littlepoll.people.com.cn/ati/diaocha.php/D/collect',
        method: 'POST',
        data: str,
        success: function success(res) {
          var data = JSON.parse(res);

          if (data['chaoyue'] && data['allpeople']) {
            var sc = Math.ceil(parseInt(data['chaoyue']) / parseInt(data['allpeople']) * 100);
            owo.state.overstep = sc;
          } else {
            owo.state.overstep = 0;
          }

          owo.go('five', 'fade', 'moveFromRight', 'fade', 'moveFromLeft', true);
        }
      }); // 不断地更换加载文字

      owo.tool.animate('bounceIn', this.query('.icon-1')[0], 200);
      owo.tool.animate('bounceIn', this.query('.icon-2')[0], 600);
      owo.tool.animate('bounceIn', this.query('.icon-3')[0], 1000);
      owo.tool.animate('bounceIn', this.query('.icon-4')[0], 1400);
    }
  },
  "five": {
    "data": {
      "showShare": false
    },
    "created": function created() {
      var _this3 = this;

      if (owo.state.overstep == undefined) {
        location.replace('');
        return;
      } // 根据不同的分数更换不同的样式


      this.query('.overstep')[0].innerText = "\u8D85\u8D8A".concat(owo.state.overstep, "%\u73A9\u5BB6");
      owo.tool.animate('bounceInRight', this.query('.overstep')[0], 1800);

      if (owo.state.code >= 8) {
        this.$el.classList.add('lave3');
        this.query('.bold-text')[0].innerText = '100分';
      } else if (owo.state.code > 5) {
        this.$el.classList.add('lave2');
        this.query('.bold-text')[0].innerText = '60分';
      } else {
        this.$el.classList.add('lave1');
      }

      changeDecorate(this.$el, 750, 1308);
      setTimeout(function () {
        _this3.query('.scroll-box')[0].style.height = '1000px';
      }, 800);
      owo.tool.animate('fadeIn', this.query('.user')[0], 1800);
      owo.tool.animate('fadeIn', this.query('.info-text')[0], 1800);
      owo.tool.animate('fadeInUp', this.query('.bottom-bar')[0], 1800); // 出现云

      owo.tool.animate('bounceIn', this.query('.cloud2')[0], 2000);
      setTimeout(function () {
        _this3.query('.cloud2')[0].style.animation = 'floatx 1s infinite alternate';
        _this3.query('.info-text')[0].style.animation = 'stars 1s linear infinite';
      }, 1000);
      owo.tool.animate('bounceIn', this.query('.stars-1')[0], 2000);
      owo.tool.animate('bounceIn', this.query('.stars-2')[0], 2100);
      owo.tool.animate('bounceIn', this.query('.stars-3')[0], 2200);
      owo.tool.animate('bounceIn', this.query('.stars-4')[0], 2300);
      owo.tool.animate('bounceIn', this.query('.stars-5')[0], 2400); // 文字出现

      owo.tool.animate('bounceIn', this.query('.code-text span')[0], 2600);
      owo.tool.animate('bounceIn', this.query('.code-text span')[1], 2700);
      owo.tool.animate('bounceIn', this.query('.code-text span')[2], 2800);
      owo.tool.animate('bounceIn', this.query('.code-text span')[3], 2900);
      owo.tool.animate('bounceIn', this.query('.code-text span')[4], 3000);
      owo.tool.animate('bounceIn', this.query('.code-text span')[5], 3100);
      owo.tool.animate('bounceIn', this.query('.code-text span')[6], 3200);
      owo.tool.animate('fadeIn', this.query('.code-text span')[7], 3800);
      setTimeout(function () {
        // 左右滑动
        owo.tool.touch({
          el: _this3.$el,
          end: function end(e) {
            // console.log(e.swipe)
            // 上下滑动
            if (e.swipe[1] < -100) {
              _this3.query('.info-box')[0].style.opacity = 1;
            }

            if (e.swipe[1] > 100) {
              _this3.query('.info-box')[0].style.opacity = 0;
            }
          }
        });
      }, 0);
    },
    "switchShare": function switchShare() {
      if (this.data.showShare) {
        this.query('.share-box')[0].style.display = 'none';
      } else {
        this.query('.share-box')[0].style.display = 'block';
      }

      this.data.showShare = !this.data.showShare;
    },
    "showAnswer": function showAnswer() {
      owo.go('six', 'fade', 'moveFromRight', 'fade', 'moveFromLeft', true);
    }
  },
  "six": {
    "created": function created() {},
    "template": {
      "card2": {
        "data": {
          "yuda": null,
          "number": 1,
          "allNumber": 0
        },
        "created": function created() {
          var _this4 = this;

          // 左右滑动
          owo.tool.touch({
            el: this.$el,
            end: function end(e) {
              // console.log(e.swipe)
              // 向左滑动
              if (e.swipe[0] < -100) {
                if (_this4.data.yuda) _this4.reject();
              } else if (e.swipe[0] > 100) {
                console.log('后退!');
                if (_this4.data.yuda) _this4.back();
              } else if (e.swipe[1] < -100) {
                _this4.query('.stack__item--current')[0].getElementsByClassName('explain')[0].style.display = 'block';
              } else if (e.swipe[1] > 100) {
                _this4.query('.stack__item--current')[0].getElementsByClassName('explain')[0].style.display = 'none';
              }
            }
          });
          owo.state.checkList = [];
          this.data.yuda = new Stack(document.getElementById('stack_yuda2'), {
            infinite: false,
            interval: 0,
            onEndStack: function onEndStack() {
              console.log('最后了');
              owo.go('five', 'fade', 'moveFromRight', 'fade', 'moveFromLeft', true);
            }
          }); // setTimeout(() => {
          //   this.query('.next-button')[this.query('.next-button').length - 1].innerText = '返回我的等级'
          // }, 1000);
        },
        "show": function show() {
          var _this5 = this;

          this.data.number = 1; // 获取总数

          setTimeout(function () {
            _this5.data.allNumber = _this5.query('.stack__item').length;
            _this5.query('.page')[0].innerText = _this5.data.number + ' / ' + _this5.data.allNumber;
          }, 0);
          var domList = this.query('.explain');
          domList.forEach(function (element) {
            element.style.display = 'none';
          });
          this.data.yuda.restart();
        },
        "accept": function accept() {
          new Audio("./static/resource/click.mp3").play();
          this.data.number++;

          if (this.data.number > this.data.allNumber) {
            owo.go('five', 'fade', 'moveFromRight', 'fade', 'moveFromLeft', true);
            return;
          }

          this.query('.page')[0].innerText = this.data.number + ' / ' + this.data.allNumber;
          this.data.yuda.accept();
        },
        "back": function back() {
          if (this.data.number <= 1) {
            this.data.number = 1;
            owo.tool.toast('已经是第一题了!');
            return;
          }

          this.data.number--;
          this.query('.page')[0].innerText = this.data.number + ' / ' + this.data.allNumber;
          this.data.yuda.pick();
        },
        "reject": function reject() {
          // console.log('sdsd')
          this.data.number++;

          if (this.data.number > this.data.allNumber) {
            owo.go('five', 'fade', 'moveFromRight', 'fade', 'moveFromLeft', true);
            return;
          } // console.log(this.query('.page')[0].innerText)


          this.query('.page')[0].innerText = this.data.number + ' / ' + this.data.allNumber;
          this.data.yuda.accept();
        },
        "explain": function explain() {
          console.log(this);
        },
        "close": function close() {
          this.data.number++;

          if (this.data.number > this.data.allNumber) {
            owo.go('five', 'fade', 'moveFromRight', 'fade', 'moveFromLeft', true);
            return;
          }

          this.query('.page')[0].innerText = this.data.number + ' / ' + this.data.allNumber;
          this.data.yuda.reject();
        },
        "toNext": function toNext() {
          if (this.data.yuda) this.reject();
        },
        "toBack": function toBack() {
          if (this.data.yuda) this.back();
        },
        "showE": function showE() {
          this.query('.stack__item--current')[0].getElementsByClassName('explain')[0].style.display = 'block';
        },
        "prop": {}
      }
    }
  }
};

/* 方法合集 */
var _owo = {
  /* 对象合并方法 */
  assign: function(a, b) {
    var newObj = {}
    for (var key in a){
      newObj[key] = a[key]
    }
    for (var key in b){
      newObj[key] = b[key]
    }
    return newObj
  },
  /* 运行页面初始化方法 */
  runCreated: function (pageFunction) {
    // console.log(pageFunction)
    // 确保created事件只被执行一次
    if (!pageFunction["_isCreated"]) {
      pageFunction["_isCreated"] = true
      if (pageFunction.created) {
        pageFunction.created.apply(_owo.assign(pageFunction, {
          data: pageFunction.data,
          activePage: window.owo.activePage
        }))
      }
    }
    // console.log(pageFunction)
    if (!pageFunction.show) return
    pageFunction.show.apply(_owo.assign(pageFunction, {
      data: pageFunction.data,
      activePage: window.owo.activePage
    }))
  }
}

// 判断是否为手机
_owo.isMobi = navigator.userAgent.toLowerCase().match(/(ipod|ipad|iphone|android|coolpad|mmp|smartphone|midp|wap|xoom|symbian|j2me|blackberry|wince)/i) != null


_owo._run = function (eventFor, templateName, event) {
  // 复制eventFor防止污染
  var eventForCopy = eventFor
  // 判断页面是否有自己的方法
  var newPageFunction = window.owo.script[window.owo.activePage]
  // console.log(this.attributes)
  if (templateName && templateName !== owo.activePage) {
    // 如果模板注册到newPageFunction中，那么证明模板没有script那么直接使用eval执行
    if (newPageFunction.template) newPageFunction = newPageFunction.template[templateName]
  }
  // 待优化可以单独提出来
  // 取出参数
  var parameterArr = []
  var parameterList = eventForCopy.match(/[^\(\)]+(?=\))/g)
  
  if (parameterList && parameterList.length > 0) {
    // 参数列表
    parameterArr = parameterList[0].split(',')
    // 进一步处理参数
    
    for (var i = 0; i < parameterArr.length; i++) {
      var parameterValue = parameterArr[i].replace(/(^\s*)|(\s*$)/g, "")
      // console.log(parameterValue)
      // 判断参数是否为一个字符串
      
      if (parameterValue.charAt(0) === '"' && parameterValue.charAt(parameterValue.length - 1) === '"') {
        parameterArr[i] = parameterValue.substring(1, parameterValue.length - 1)
      }
      if (parameterValue.charAt(0) === "'" && parameterValue.charAt(parameterValue.length - 1) === "'") {
        parameterArr[i] = parameterValue.substring(1, parameterValue.length - 1)
      }
      // console.log(parameterArr[i])
    }
  }
  eventForCopy = eventFor.replace(/\(.*\)/, '')
  // console.log(newPageFunction, eventForCopy)
  // 如果有方法,则运行它
  if (newPageFunction && newPageFunction[eventForCopy]) {
    // 绑定window.owo对象
    newPageFunction.$event = event
    newPageFunction[eventForCopy].apply(newPageFunction, parameterArr)
  } else {
    // 如果没有此方法则交给浏览器引擎尝试运行
    eval(eventFor)
  }
}

_owo.bindEvent = function (eventName, eventFor, tempDom, templateName) {
  // 处理事件 使用bind防止闭包
  tempDom['on' + eventName] = function(event) {
    _owo._run(eventFor, templateName, event)
  }.bind({eventFor: eventFor})
}

/* owo事件处理 */
// 参数1: 当前正在处理的dom节点
// 参数2: 当前正在处理的模块名称
// 参数3: 当前正在处理的模块根dom
_owo.handleEvent = function (tempDom, templateName) {
  var activePage = window.owo.script[owo.activePage]
  
  if (tempDom.attributes) {
    for (let ind = 0; ind < tempDom.attributes.length; ind++) {
      var attribute = tempDom.attributes[ind]
      // 判断是否为owo的事件
      // ie不支持startsWith
      if (attribute.name[0] == ':') {
        var eventName = attribute.name.slice(1)
        var eventFor = attribute.textContent
        switch (eventName) {
          case 'show' : {
            // 初步先简单处理吧
            var temp = eventFor.replace(/ /g, '')
            // 取出条件
            var condition = temp.split("==")
            if (activePage.data[condition[0]] != condition[1]) {
              tempDom.style.display = 'none'
            }
            break
          }
          case 'tap': {
            // 待优化 可合并
            // 根据手机和PC做不同处理
            if (_owo.isMobi) {
              _owo._event_tap(tempDom, function (event) {
                _owo._run(eventFor, templateName, event)
              })
            } else _owo.bindEvent('click', eventFor, tempDom, templateName)
            break
          }
          default: {
            _owo.bindEvent(eventName, eventFor, tempDom, templateName)
          }
        }
      }
    }
  }
  
  // 判断是否有子节点需要处理
  if (tempDom.children) {
    // 递归处理所有子Dom结点
    for (var i = 0; i < tempDom.children.length; i++) {
      // 获取子节点实例
      var childrenDom = tempDom.children[i]

      // 每个子节点均要判断是否为模块
      if (childrenDom.attributes['template'] && childrenDom.attributes['template'].textContent) {
        // 如果即将遍历进入模块 设置即将进入的模块为当前模块
        // 获取模块的模块名
        _owo.handleEvent(childrenDom, childrenDom.attributes['template'].textContent)
      } else {
        _owo.handleEvent(childrenDom, templateName)
      }
    }
  } else {
    console.info('元素不存在子节点!')
    console.info(tempDom)
  }
}
_owo.getarg = function (url) { // 获取URL #后面内容
  if (!url) return null
  const arg = url.split("#");
  return arg[1] ? arg[1].split('?')[0] : null
}

// 页面资源加载完毕事件
_owo.showPage = function() {
  // 取出URL地址判断当前所在页面
  var pageArg = _owo.getarg(window.location.hash)
  // 从配置项中取出程序入口
  var page = pageArg ? pageArg : owo.entry
  if (page) {
    var entryDom = document.querySelector('.ox[template="' + page + '"]')
    if (entryDom) {
      // 显示主页面
      entryDom.style.display = 'block'
      window.owo.activePage = page
      _owo.handlePage(window.owo.script[page], entryDom)
      _owo.handleEvent(entryDom, null)
    } else {
      console.error('入口文件设置错误,错误值为: ', page)
    }
  } else {
    console.error('未设置程序入口!')
  }
  // 设置当前页面为活跃页面
  owo.state.newUrlParam = _owo.getarg(document.URL)
}

/*
  页面跳转方法
  参数1: 需要跳转到页面名字
  参数2: 离开页面动画
  参数3: 进入页面动画
*/
owo.go = function (pageName, inAnimation, outAnimation, backInAnimation, backOutAnimation, noBack, param) {
  // console.log(owo.script[pageName])
  owo.script[pageName]._animation = {
    "in": inAnimation,
    "out": outAnimation,
    "forward": true
  }
  var paramString = ''
  if (param && typeof param == 'object') {
    paramString += '?'
    // 生成URL参数
    for (let paramKey in param) {
      paramString += paramKey + '=' + param[paramKey] + '&'
    }
    // 去掉尾端的&
    paramString = paramString.slice(0, -1)
  }
  // 如果有返回动画那么设置返回动画
  if (backInAnimation && backOutAnimation) {
    owo.script[owo.activePage]._animation = {
      "in": backInAnimation,
      "out": backOutAnimation,
      "forward": false
    }
  }
  if (noBack) {
    location.replace(paramString + "#" + pageName)
  } else {
    window.location.href = paramString + "#" + pageName
  }
}

// url发生改变事件
_owo.hashchange = function (e) {
  // 这样处理而不是直接用event中的URL，是因为需要兼容IE
  owo.state.oldUrlParam = owo.state.newUrlParam;
  owo.state.newUrlParam = _owo.getarg(document.URL); 
  // console.log(owo.state.oldUrlParam, owo.state.newUrlParam)
  // 如果旧页面不存在则为默认页面
  if (!owo.state.oldUrlParam) owo.state.oldUrlParam = owo.entry;
  var newUrlParam = owo.state.newUrlParam;

  // 如果没有跳转到任何页面则跳转到主页
  if (newUrlParam === undefined) {
    newUrlParam = owo.entry;
  }

  // 如果没有发生页面跳转则不需要进行操作
  // 进行页面切换
  switchPage(owo.state.oldUrlParam, newUrlParam);
}

// ios的QQ有BUG 无法触发onhashchange事件
if(/iPhone\sOS.*QQ[^B]/.test(navigator.userAgent)) {
  window.onpopstate = _owo.hashchange;
} else {
  window.onhashchange = _owo.hashchange;
}
// 隐藏旧页面，显示新页面
function dispalyEffect (oldDom, newDom) {
  if (oldDom) {
    // 隐藏掉旧的节点
    oldDom.style.display = 'none'
  }
  // 查找页面跳转后的page
  newDom.style.display = 'block'
}

// 切换页面动画
function animation (oldDom, newDom, animationIn, animationOut, forward) {
  // 动画延迟
  let delay = 0
  // 获取父元素
  var parentDom = newDom.parentElement
  if (!oldDom) {
    console.error('旧页面不存在!')
  }
  oldDom.addEventListener("animationend", oldDomFun)
  newDom.addEventListener("animationend", newDomFun)
  
  oldDom.style.position = 'absolute'

  newDom.style.display = 'block'
  newDom.style.position = 'absolute'
  // 给即将生效的页面加上“未来”标识
  if (forward) {
    newDom.classList.add('owo-animation-forward')
  } else {
    oldDom.classList.add('owo-animation-forward')
  }
  // document.body.style.overflow = 'hidden'

  parentDom.style.perspective = '1200px'
  oldDom.classList.add('owo-animation')
  animationIn.forEach(value => {
    //判断是否为延迟属性
    if (value.startsWith('delay')) {
      const tempDelay = parseInt(value.slice(5))
      if (delay < tempDelay)  delay = tempDelay
    }
    oldDom.classList.add('o-page-' + value)
  })

  newDom.classList.add('owo-animation')
  animationOut.forEach(value => {
    if (value.startsWith('delay')) {
      const tempDelay = parseInt(value.slice(5))
      if (delay < tempDelay)  delay = tempDelay
    }
    newDom.classList.add('o-page-' + value)
  })
  // 旧DOM执行函数
  function oldDomFun (e) {
    // 排除非框架引起的结束事件
    if (e.target.getAttribute('template')) {
      // 移除监听
      oldDom.removeEventListener('animationend', oldDomFun, false)
      // 延迟后再清除，防止动画还没完成
      setTimeout(() => {
        oldDom.style.display = 'none'
        // console.log(oldDom)
        oldDom.style.position = ''
        oldDom.classList.remove('owo-animation')
        oldDom.classList.remove('owo-animation-forward')
        parentDom.style.perspective = ''
        // 清除临时设置的class
        animationIn.forEach(value => {
          oldDom.classList.remove('o-page-' + value)
        })
      }, delay);
    }
  }

  // 新DOM执行函数
  function newDomFun () {
    // 移除监听
    newDom.removeEventListener('animationend', newDomFun, false)
    // 延迟后再清除，防止动画还没完成
    setTimeout(() => {
      // 清除临时设置的style
      newDom.style.position = '';
      newDom.classList.remove('owo-animation');
      newDom.classList.remove('owo-animation-forward');
      animationOut.forEach(function (value) {
        newDom.classList.remove('o-page-' + value);
      });
    }, delay);
  }
}


// 切换页面前的准备工作
function switchPage (oldUrlParam, newUrlParam) {
  var oldPage = oldUrlParam ? oldUrlParam.split('&')[0] : owo.entry
  var newPage = newUrlParam ? newUrlParam.split('&')[0] : owo.entry
  // console.log(oldPage, newPage)
  var oldDom = document.querySelector('.ox[template="' + oldPage + '"]')
  var newDom = document.querySelector('.ox[template="' + newPage + '"]')
  
  if (!newDom) {
    console.error('页面不存在!')
    return
  }
  // console.log(owo.state.animation)
  // 判断是否有动画效果
  if (!owo.script[newPage]._animation) owo.script[newPage]._animation = {}
  // 直接.in会在ie下报错
  var animationIn = owo.script[newPage]._animation['in']
  var animationOut = owo.script[newPage]._animation['out']
  if (animationIn || animationOut) {
    // 如果没用动画参数则使用默认效果
    if (!animationIn || !animationOut) {
      dispalyEffect(oldDom, newDom)
      return
    }
    owo.state.animation = {}
    animation(oldDom, newDom, animationIn.split('&&'), animationOut.split('&&'), owo.state.animation['forward'])
  } else {
    dispalyEffect(oldDom, newDom)
  }
  
  window.owo.activePage = newPage
  _owo.handleEvent(newDom, null)
  _owo.handlePage(window.owo.script[newPage], newDom)
}
/*
 * 传递函数给whenReady()
 * 当文档解析完毕且为操作准备就绪时，函数作为document的方法调用
 */
_owo.ready = (function() {               //这个函数返回whenReady()函数
  var funcs = [];             //当获得事件时，要运行的函数
  
  //当文档就绪时,调用事件处理程序
  function handler(e) {
    // 确保事件处理程序只运行一次
    if(window.owo.state.isRrady) return
    window.owo.state.isRrady = true
    //如果发生onreadystatechange事件，但其状态不是complete的话,那么文档尚未准备好
    if(e.type === 'onreadystatechange' && document.readyState !== 'complete') {
      return
    }
    
    // 运行所有注册函数
    for(var i=0; i<funcs.length; i++) {
      funcs[i].call(document);
    }
    funcs = null;
  }
  //为接收到的任何事件注册处理程序
  if (document.addEventListener) {
    document.addEventListener('DOMContentLoaded', handler, false)
    document.addEventListener('readystatechange', handler, false)            //IE9+
    window.addEventListener('load', handler, false)
  } else if(document.attachEvent) {
    document.attachEvent('onreadystatechange', handler)
    window.attachEvent('onload', handler)
  }
  //返回whenReady()函数
  return function whenReady (fn) {
    if (window.owo.state.isRrady) {
      fn.call(document)
    } else {
      funcs.push(fn)
    }
  }
})()

// 执行页面加载完毕方法
_owo.ready(_owo.showPage)


/**
 * 赋予节点动画效果
 * @param  {string} name 动画效果名称
 * @param  {dom} dom 节点
 */
owo.tool.animate = function (name, dom, delay) {
  dom.classList.add(name)
  dom.classList.add('owo-animated')
  if (delay) {
    dom.style.animationDelay = delay + 'ms'
  }
  // 待优化可以单独提出绑定方法
  dom.addEventListener('animationend', animateEnd)
  function animateEnd () {
    // 待优化 感觉不需要这样
    dom.classList.remove(name)
    dom.classList.remove('owo-animated')
    if (delay) {
      dom.style.animationDelay = ''
    }
  }
}
/**
 * 滑动检测
 * @param  {DOM} el 需要监测的dom元素
 * @param  {Function} start   开始事件
 * @param  {Function} touchmove   触摸移动事件
 * @param  {Function} end   结束事件
 */

owo.tool.touch = function (config) {
  const dom = config.el
  // 判断是否已经处于监听状态
  if (dom.getAttribute("monitor") == 'touch') return
  var start = null
  var end = null
  var startTarget = null
  // 设置监听标识
  dom.setAttribute("monitor", "touch")
  dom.addEventListener("touchstart", function (e) {
    event = e.targetTouches[0] || e.originalEvent.targetTouches[0]
    startTarget = e.target
    start = end = [event.clientX, event.clientY]
    if (config.start) config.start(event)
  }, false)
  dom.addEventListener("touchmove", function (e) {
    event = e.targetTouches[0] || e.originalEvent.targetTouches[0]
    end = [event.clientX, event.clientY]
    if (config.moveing) config.moveing(event)
  }, false)
  dom.addEventListener("touchend", function (e) {
    if (config.end) {
      config.end({
        target: startTarget,
        start: start,
        end: end,
        swipe: [end[0] - start[0], end[1] - start[1]]
      })
    }
  }, false)
  // 监控鼠标事件
  dom.addEventListener("mousedown", function (event) {
    dom.addEventListener("mousemove", function (event) {
      end = [event.clientX, event.clientY]
      if (config.moveing) config.moveing(event)
    }, false)
    start = end = [event.clientX, event.clientY]
    if (config.start) config.start(event)
  }, false)
  
  dom.addEventListener("mouseup", function () {
    // 移除监听
    dom.removeEventListener("mousemove", function () {

    }, false)
    if (config.end) {
      config.end({
        target: startTarget,
        start: start,
        end: end,
        swipe: [end[0] - start[0], end[1] - start[1]]
      })
    }
  }, false)
}/**
 * 显示toast提示 不支持ie8
 * @param  {number} text       显示的文字
 * @param  {number} time       显示时长
 */

owo.tool.toast = (text, time) => {
  if (window.owo.state.toastClock) {
    clearTimeout(window.owo.state.toastClock)
    hideToast()
  }
  if (time === undefined || time === null) {
    // 默认2秒
    time = 2000
  }
  const toast = document.createElement("div")
  toast.setAttribute("id", "toast")
  toast.setAttribute("class", "toast")
  // 设置样式
  toast.style.cssText = "position:fixed;z-index:999;background-color:rgba(0, 0, 0, 0.5);bottom:10%;line-height:40px;border-radius:10px;left:0;right:0;margin:0 auto;text-align:center;color:white;max-width:200px;padding:0 10px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;"

  toast.innerHTML = text
  document.body.appendChild(toast)
  function hideToast() {
    document.getElementById('toast').outerHTML = ''
    window.owo.state.toastClock = null
  }
  window.owo.state.toastClock = setTimeout(hideToast, time)
}

/* 运行页面所属的方法 */
_owo.handlePage = function (newPageFunction, entryDom) {
  // console.log(entryDom)
  newPageFunction['$el'] = entryDom
  // 快速选择器
  newPageFunction['query'] = function (str) {
    return this.$el.querySelectorAll(str)
  }
  /* 判断页面是否有自己的方法 */
  if (!newPageFunction) return
  // console.log(newPageFunction)
  _owo.runCreated(newPageFunction)
  // debugger
  // 判断页面是否有下属模板,如果有运行所有模板的初始化方法
  for (var key in newPageFunction.template) {
    var templateScript = newPageFunction.template[key]
    // 待修复,临时获取方式,这种方式获取到的dom不准确
    var childDom = entryDom.querySelectorAll('[template="' + key +'"]')[0]
    if (!childDom) {
      console.error('组件丢失:', key)
      continue
    }
    // 递归处理
    _owo.handlePage(templateScript, childDom)
  }
}
_owo._event_tap = function (tempDom, callBack) {
  // 变量
  var startTime = 0
  var isMove = false
  tempDom.addEventListener('touchstart', function() {
    startTime = Date.now();
  })
  tempDom.addEventListener('touchmove', function() {
    isMove = true
  })
  tempDom.addEventListener('touchend', function(e) {
    if (Date.now() - startTime < 300 && !isMove) {
      callBack(e)
    }
    // 清零
    startTime = 0;
    isMove = false
  })
}