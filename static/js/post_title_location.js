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
