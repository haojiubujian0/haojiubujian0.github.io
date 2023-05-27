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
  var flag = false;

  var film = document.querySelector(".post-main .film");
  tocBtn.addEventListener("click", function () {
    flag = flag ? false : true;  
    if(flag) {
      blog.addClass(toc, "show");
      film.style.display = "block";
    }
    else {
      blog.removeClass(toc, "show");
      film.style.display = "none";
    }
  });

  const sidebarHead = document.querySelector(".sidebar-head");
  var rect;
  blog.addEvent(window, "scroll", function () {
    rect = sidebarHead.getBoundingClientRect();
    // console.log(rect.bottom);
    toc.style.top = rect.bottom + "px";
  });
  // 页面完成加载后, 设置初始的位置
  rect = sidebarHead.getBoundingClientRect();
  toc.style.top = rect.bottom + "px";
});