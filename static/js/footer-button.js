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