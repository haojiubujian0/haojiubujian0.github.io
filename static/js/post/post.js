// 文章目录生成
blog.addLoadEvent(function () {
  // 查找博客文章中的所有一级，并设置目录项内容
  const arr = document.querySelectorAll('.post-content h1');
  const ul = document.querySelector(".toc-list");
  const links = [];  // 存储所有的列表项中的a标签
  var li, a;
  for(let i = 0; i < arr.length; i++) {
    // 创建目录的列表项
    li = document.createElement("li");
    a = document.createElement("a");
    // 设置列表项的内容
    a.textContent = arr[i].textContent.trim();
    a.href = 
    // 设置列表项的class
    li.className = "toc-item";
    a.className = "toc-link";
    a.setAttribute("href", "#"+arr[i].id);
    // 打入列表
    li.appendChild(a);
    ul.appendChild(li);
    links.push(a);
  }

  // 更新列表项的样式
  function updateListItemClass(elem) {
    for(let i = 0; i < links.length; ++i) {
      blog.removeClass(links[i], "selected");
    }
    blog.addClass(elem, "selected");
  }

  // 定位滚轮的位置处于哪个 h1标签及其对应的内容 块中，并相应地设置目录项的样式
  // 存储每个 h1 元素的位置信息, h1元素的顶部与文档顶部之间的距离
  const headingPositions = [];
  var scrollDistance;
  arr.forEach((heading) => {
    const rect = heading.getBoundingClientRect();
    // 获取视口滚动距离
    scrollDistance = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
    headingPositions.push({
      top: rect.top + scrollDistance
    });
  });

  // 监听滚轮事件
  blog.addEvent(window, "scroll", function () {
    scrollDistance = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
    // 特殊情况判断
    if(scrollDistance < headingPositions[0].top - 10) {
      for(let i = 0; i < links.length; ++i) {
        blog.removeClass(links[i], "selected");
      }
    }
    if(scrollDistance >= headingPositions[headingPositions.length-1].top)
      updateListItemClass(links[headingPositions.length-1]);

    for(let i = 0; i < headingPositions.length - 1; ++i) {
      if(Math.abs(headingPositions[i].top-scrollDistance) < 2) {
        updateListItemClass(links[i]);
      }
      if(scrollDistance >= headingPositions[i].top && scrollDistance < headingPositions[i+1].top) {
        if(Math.abs(headingPositions[i+1].top-scrollDistance) < 2) {
          updateListItemClass(links[i+1]);
        }
        else updateListItemClass(links[i]);
      }
    }
  });

});

// 小屏幕目录显示按钮以及文章目录的显示
blog.addLoadEvent(function () {
  const tocBtn = document.getElementById("toc-btn");
  var toc = document.querySelector(".post-main .toc");
  var film = document.querySelector(".post-main .film");
  const sidebarHead = document.querySelector(".sidebar-head");
  var flag = false;

  function updateTOCPos() {
    rect = sidebarHead.getBoundingClientRect();
    // console.log(rect.bottom);
    toc.style.top = rect.bottom + "px";
  }

  // 优化
  film.onclick = function () {
    blog.removeClass(toc, "show");
    film.style.display = "none";
    flag = false;
    // 移除flag为true时所加入的事件
    window.removeEventListener("scroll", updateTOCPos);
  };
  tocBtn.addEventListener("click", function () {
    flag = flag ? false : true;
    if(flag) {
      updateTOCPos();
      blog.addClass(toc, "show");
      film.style.display = "block";
      // 监听滚动条并实时设置目录的位置
      window.addEventListener("scroll", updateTOCPos);
    }
    else {
      blog.removeClass(toc, "show");
      film.style.display = "none";
      // 移除flag为true时所加入的事件
      window.removeEventListener("scroll", updateTOCPos);
    }
  });
});


// 标题定位
blog.addLoadEvent(function () {
  // 查找博客文章中的所有一级和二级标题
  const list = document.querySelectorAll('.post-content h1');

  for (var i = 0; i < list.length; i++) {
    blog.addEvent(list[i], 'click', function (event) {
      const elem = event.currentTarget;
      if (elem.scrollIntoView) {
        // 将滚动元素 elem 到可视区域的顶部位置
        elem.scrollIntoView({ block: 'start' });
      }
      // 在jekyll的配置文件中设置auto_ids, 故这里会存在elem.id 
      if (elem.id && history.replaceState) {
        // 将当前页面的 URL 更新为带有相应标题元素的 ID 的锚点链接
        history.replaceState({}, '', '#' + elem.id);
      }
    });
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