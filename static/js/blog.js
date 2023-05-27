/**
 * 允许多次onload不被覆盖
 * @param {方法} func
 */
blog.addLoadEvent = function (func) {
  var oldonload = window.onload;
  if (typeof window.onload != 'function') {
    window.onload = func;
  } else {
    window.onload = function () {
      oldonload();
      func();
    }
  }
}

/**
 * 以兼容的方式添加事件
 * @param {单个DOM节点} dom
 * @param {事件名} eventName
 * @param {事件方法} func
 * @param {是否捕获} useCapture
 */
blog.addEvent = function (dom, eventName, func, useCapture) {
  if (window.addEventListener) {
    if (useCapture != undefined && useCapture === true) {
      dom.addEventListener(eventName, func, true);
    } else {
      dom.addEventListener(eventName, func, false);
    }
  }
  else if(window.attachEvent) {
    dom.attachEvent('on' + eventName, func);
  }
}

/**
 * 向DOM节点添加某个class
 * @param {单个DOM节点} dom
 * @param {class名} className
 */
blog.addClass = function (dom, className) {
  if (!blog.hasClass(dom, className)) {
    var c = dom.className || '';
    dom.className = c + ' ' + className;
    dom.className = blog.trim(dom.className);
  }
}

/**
 * 判断DOM节点中是否有某个class
 * @param {单个DOM节点} dom
 * @param {class名} className
 */
blog.hasClass = function (dom, className) {
  // dom.className 表示DOM节点dom有的类名，字符串的形式
  // 这与函数的形参className不同！！！
  
  // 将类名拆分为类名数组
  var list = (dom.className || '').split(/\s+/);
  for (var i = 0; i < list.length; i++) {
    if (list[i] == className) return true;
  }
  return false;
}

/**
 * 删除DOM节点中的某个class
 * @param {单个DOM节点} dom
 * @param {class名} className
 */
blog.removeClass = function (dom, className) {
  if (blog.hasClass(dom, className)) {
    var list = (dom.className || '').split(/\s+/);
    var newName = '';
    for (var i = 0; i < list.length; i++) {
      if (list[i] != className) newName = newName + ' ' + list[i];
    }
    dom.className = blog.trim(newName);
  }
}

/**
 * 去除字符串两端的空白字符
 * @param {字符串} str
 */
blog.trim = function (str) {
  return str.replace(/^\s+|\s+$/g, '')
}

/**
 * 工具，转义html字符
 * @param {字符串} str
 */
blog.htmlEscape = function (str) {
  var temp = document.createElement('div')
  temp.innerText = str
  str = temp.innerHTML
  temp = null
  return str
}

/**
 * 工具，转换实体字符防止XSS
 * @param {字符串} str
 */
blog.encodeHtml = function (html) {
  var o = document.createElement('div')
  o.innerText = html
  var temp = o.innerHTML
  o = null
  return temp
}

/**
 * 工具， 转义正则关键字
 * @param {字符串} str
 */
blog.encodeRegChar = function (str) {
  // \ 必须在第一位
  var arr = ['\\', '.', '^', '$', '*', '+', '?', '{', '}', '[', ']', '|', '(', ')']
  arr.forEach(function (c) {
    var r = new RegExp('\\' + c, 'g')
    str = str.replace(r, '\\' + c)
  })
  return str
}

/**
 * 工具，Ajax
 * @param {字符串} str
 */
blog.ajax = function (option, success, fail) {
  var xmlHttp = null
  if (window.XMLHttpRequest) {
    xmlHttp = new XMLHttpRequest()
  } else {
    xmlHttp = new ActiveXObject('Microsoft.XMLHTTP')
  }
  var url = option.url
  var method = (option.method || 'GET').toUpperCase()
  var sync = option.sync === false ? false : true
  var timeout = option.timeout || 10000

  var timer
  var isTimeout = false
  xmlHttp.open(method, url, sync)
  xmlHttp.onreadystatechange = function () {
    if (isTimeout) {
      fail({
        error: '请求超时'
      })
    } else {
      if (xmlHttp.readyState == 4) {
        if (xmlHttp.status == 200) {
          success(xmlHttp.responseText)
        } else {
          fail({
            error: '状态错误',
            code: xmlHttp.status
          })
        }
        //清除未执行的定时函数
        clearTimeout(timer)
      }
    }
  }
  timer = setTimeout(function () {
    isTimeout = true
    fail({
      error: '请求超时'
    })
    xmlHttp.abort()
  }, timeout)
  xmlHttp.send()
}

/**
 * 特效：点击页面文字冒出特效
 */
blog.initClickEffect = function (textArr) {
  function createDOM(text) {
    var dom = document.createElement('span')
    dom.innerText = text
    dom.style.left = 0
    dom.style.top = 0
    dom.style.position = 'fixed'
    dom.style.fontSize = '12px'
    dom.style.whiteSpace = 'nowrap'
    dom.style.webkitUserSelect = 'none'
    dom.style.userSelect = 'none'
    dom.style.opacity = 0
    dom.style.transform = 'translateY(0)'
    dom.style.webkitTransform = 'translateY(0)'
    return dom
  }

  blog.addEvent(window, 'click', function (ev) {
    let target = ev.target
    while (target !== document.documentElement) {
      if (target.tagName.toLocaleLowerCase() == 'a') return
      if (blog.hasClass(target, 'footer-btn')) return
      target = target.parentNode
    }

    var text = textArr[parseInt(Math.random() * textArr.length)]
    var dom = createDOM(text)

    document.body.appendChild(dom)
    var w = parseInt(window.getComputedStyle(dom, null).getPropertyValue('width'))
    var h = parseInt(window.getComputedStyle(dom, null).getPropertyValue('height'))

    var sh = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0
    dom.style.left = ev.pageX - w / 2 + 'px'
    dom.style.top = ev.pageY - sh - h + 'px'
    dom.style.opacity = 1

    setTimeout(function () {
      dom.style.transition = 'transform 500ms ease-out, opacity 500ms ease-out'
      dom.style.webkitTransition = 'transform 500ms ease-out, opacity 500ms ease-out'
      dom.style.opacity = 0
      dom.style.transform = 'translateY(-26px)'
      dom.style.webkitTransform = 'translateY(-26px)'
    }, 20)

    setTimeout(function () {
      document.body.removeChild(dom)
      dom = null
    }, 520)
  })
};

// 新建DIV包裹TABLE
blog.addLoadEvent(function () {
  // 文章页生效
  if (document.getElementsByClassName('page-post').length == 0) {
    return
  }
  var tables = document.getElementsByTagName('table')
  for (var i = 0; i < tables.length; i++) {
    var table = tables[i]
    var elem = document.createElement('div')
    elem.setAttribute('class', 'table-container')
    table.parentNode.insertBefore(elem, table)
    elem.appendChild(table)
  }
});

// 点击图片全屏预览
blog.addLoadEvent(function () {
  if (!document.querySelector('.page-post')) {
    return
  }
  console.debug('init post img click event')
  let imgMoveOrigin = null
  let restoreLock = false
  let imgArr = document.querySelectorAll('.page-post img')

  let css = [
    '.img-move-bg {',
    '  transition: opacity 300ms ease;',
    '  position: fixed;',
    '  left: 0;',
    '  top: 0;',
    '  right: 0;',
    '  bottom: 0;',
    '  opacity: 0;',
    '  background-color: #000000;',
    '  z-index: 100;',
    '}',
    '.img-move-item {',
    '  transition: all 300ms ease;',
    '  position: fixed;',
    '  opacity: 0;',
    '  cursor: pointer;',
    '  z-index: 101;',
    '}'
  ].join('')
  var styleDOM = document.createElement('style')
  if (styleDOM.styleSheet) {
    styleDOM.styleSheet.cssText = css
  } else {
    styleDOM.appendChild(document.createTextNode(css))
  }
  document.querySelector('head').appendChild(styleDOM)

  window.addEventListener('resize', toCenter)

  for (let i = 0; i < imgArr.length; i++) {
    imgArr[i].addEventListener('click', imgClickEvent, true)
  }

  function prevent(ev) {
    ev.preventDefault()
  }

  function toCenter() {
    if (!imgMoveOrigin) {
      return
    }
    let width = Math.min(imgMoveOrigin.naturalWidth, parseInt(document.documentElement.clientWidth * 0.9))
    let height = (width * imgMoveOrigin.naturalHeight) / imgMoveOrigin.naturalWidth
    if (window.innerHeight * 0.95 < height) {
      height = Math.min(imgMoveOrigin.naturalHeight, parseInt(window.innerHeight * 0.95))
      width = (height * imgMoveOrigin.naturalWidth) / imgMoveOrigin.naturalHeight
    }

    let img = document.querySelector('.img-move-item')
    img.style.left = (document.documentElement.clientWidth - width) / 2 + 'px'
    img.style.top = (window.innerHeight - height) / 2 + 'px'
    img.style.width = width + 'px'
    img.style.height = height + 'px'
  }

  function restore() {
    if (restoreLock == true) {
      return
    }
    restoreLock = true
    let div = document.querySelector('.img-move-bg')
    let img = document.querySelector('.img-move-item')

    div.style.opacity = 0
    img.style.opacity = 0
    img.style.left = imgMoveOrigin.x + 'px'
    img.style.top = imgMoveOrigin.y + 'px'
    img.style.width = imgMoveOrigin.width + 'px'
    img.style.height = imgMoveOrigin.height + 'px'

    setTimeout(function () {
      restoreLock = false
      document.body.removeChild(div)
      document.body.removeChild(img)
      imgMoveOrigin = null
    }, 300)
  }

  function imgClickEvent(event) {
    imgMoveOrigin = event.target

    let div = document.createElement('div')
    div.className = 'img-move-bg'

    let img = document.createElement('img')
    img.className = 'img-move-item'
    img.src = imgMoveOrigin.src
    img.style.left = imgMoveOrigin.x + 'px'
    img.style.top = imgMoveOrigin.y + 'px'
    img.style.width = imgMoveOrigin.width + 'px'
    img.style.height = imgMoveOrigin.height + 'px'

    div.onclick = restore
    div.onmousewheel = restore
    div.ontouchmove = prevent

    img.onclick = restore
    img.onmousewheel = restore
    img.ontouchmove = prevent
    img.ondragstart = prevent

    document.body.appendChild(div)
    document.body.appendChild(img)

    setTimeout(function () {
      div.style.opacity = 0.5
      img.style.opacity = 1
      toCenter()
    }, 0)
  }
});


// Add by Zeng Zhenxiang
// 主题切换
// 显示下拉内容
function displayThemeOptions() {
  var themeDropdown = document.getElementById('themeDropdown');
  themeDropdown.style.display = themeDropdown.style.display === 'none' ? 'block' : 'none';
}
function changeTheme(text, iconClass) {
  // 主题切换开关的文本以及图标元素
  var themeToggleText = document.getElementById('themeToggleText');
  var themeToggleIcon = document.getElementById('themeToggleIcon');
  themeToggleText.textContent = text;
  themeToggleIcon.className = iconClass + " icon";
  // 关闭主题选项
  var themeDropdown = document.getElementById('themeDropdown');
  themeDropdown.style.display = "none";
  // 主题切换
  var theme = true;
  if(iconClass.indexOf("light") >= 0) {
    theme = false;
  }
  updateTheme(theme);

  // 更新网站主页的logo
  const site_logo = document.getElementById("site-logo");
  if(theme) { site_logo.src = blog.baseurl + "/static/img/logo_dark.svg"; }
  else { site_logo.src = blog.baseurl + "/static/img/logo_light.svg"; }
}
// 页面完成加载后设置网站的主题
function updateTheme(theme) {
  // 更新浏览器缓存
  localStorage.setItem("theme", theme ? "true" : "false");
  /* document.documentElement.className 获取或设置文档根元素的类名（class name）的属性。*/
  document.documentElement.className = theme ? 'dark' : '';
  /* 
    通过执行 document.querySelector('meta[name=theme-color]')，
    可以获取文档中满足选择器条件的 <meta> 元素，该元素具有 name 属性值为 "theme-color"。
    #2D2E32: rgb(45, 46, 50) -> dark
    #FFFFFF: rgb(255, 255, 255) -> light
  */
  document.querySelector('meta[name=theme-color]').setAttribute('content', theme ? '#2D2E32' : '#FFFFFF');
}
blog.addLoadEvent(function() {
  // 默认为浅色主题
  let theme = false;
  // 页面加载完成后判断当前网站的主题
  /* 
    'window.matchMedia()' 是一个 JavaScript 方法，用于检查当前设备或浏览器是否满足指定的媒体查询条件。
    '(prefers-color-scheme: dark)' 是一个媒体查询条件，用于检查用户的首选颜色方案是否为暗色主题。这里使用了 prefers-color-scheme 媒体特性，它是一种检测用户首选颜色方案的功能。
    '.matches' 是一个属性，用于获取 window.matchMedia() 方法返回的媒体查询结果的布尔值。如果满足媒体查询条件，返回值为 true，否则为 false。
  */
  if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    theme = true;
  }
  updateTheme(theme);
  // 设置主题切换开关的相应样式
  if(theme == true) changeTheme('深色主题', 'icon-dark');
  else changeTheme('浅色主题', 'icon-light');
});

// 回到顶部按钮
blog.addLoadEvent(function () {
  var btn_to_top = document.querySelector('.footer-btn.to-top');
  function checkShowUpArrow() {
    const distanceToTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
    // console.log(distanceToTop); // 输出到顶部的垂直距离
    if (distanceToTop > 150) {
      blog.addClass(btn_to_top, 'show');
    } else {
      blog.removeClass(btn_to_top, 'show');
    }
  }
  blog.addEvent(window, 'scroll', checkShowUpArrow);
  blog.addEvent(btn_to_top, 'click', function (event) {
      window.scrollTo(0, 0);
    }
  );
  checkShowUpArrow();
});
// 去到底部按钮
blog.addLoadEvent(function () {
  var btn_to_bottom = document.querySelector('.footer-btn.to-bottom');
  function checkShowDownArrow() {
    const scrollOffset = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
    const distanceToBottom = document.documentElement.scrollHeight - (window.innerHeight + scrollOffset);
    // console.log(distanceToBottom); // 输出到底部的垂直距离
    if (distanceToBottom > 150) {
      blog.addClass(btn_to_bottom, 'show');
    } else {
      blog.removeClass(btn_to_bottom, 'show');
    }
  }
  blog.addEvent(window, 'scroll', checkShowDownArrow);
  blog.addEvent(btn_to_bottom, 'click', function (event) {
      window.scrollTo(0, document.documentElement.scrollHeight);
    }
  );
  checkShowDownArrow();
});