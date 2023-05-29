// 加载所有文章数据，优先使用localStorage缓存
function loadAllPostData(callback) {
  // 如果缓存中的数据是最新的
  if (localStorage.getItem("db") && localStorage.getItem("dbVersion") == blog.buildAt) {
    callback ? callback(localStorage.getItem("db")) : '';
    return ;
  }
  
  localStorage.removeItem('dbVersion');
  localStorage.removeItem('db');
  blog.ajax(
    {
      timeout: 20000,
      url: blog.baseurl + '/static/xml/search.xml?t=' + blog.buildAt
    },
    function (data) {
      localStorage.setItem("db", data);
      localStorage.setItem("dbVersion", blog.buildAt);
      callback ? callback(data) : '';
    },
    function () {
      console.error('全文检索数据加载失败...');
      callback ? callback(null) : ''
    }
  );
}

// 搜索功能
blog.addLoadEvent(function () {
  // 输入框
  let input = document.getElementById('search-input');
  // 没有搜索栏
  if (!input) {
    return
  }
  // 标题等信息
  let titles = [];
  // 正文内容
  let contents = [];
  // 低版本chrome，输入拼音的过程中也会触发input事件
  let inputLock = false;

  loadAllPostData(function (data) {
    titles = parseTitle();
    contents = parseContent(data);
    search(input.value);
  });

  // 获取所有文章的标题，返回的arr数组中的每个元素都是一个文章标题
  function parseTitle() {
    let arr = [];
    let doms = document.querySelectorAll('.list-search .title');
    for (let i = 0; i < doms.length; i++) {
      arr.push(doms[i].innerHTML);
    }
    return arr;
  }

  // 获取所有文章的内容，返回的数组arr中的每一个元素都是一个文章的内容
  function parseContent(data) {
    let arr = [];
    let root = document.createElement('div');
    root.innerHTML = data;
    let doms = root.querySelectorAll('li');
    for (let i = 0; i < doms.length; i++) {
      arr.push(doms[i].innerHTML);
    }
    return arr;
  }

  // 根据搜索框中的内容进行搜索
  function search(key) {
    // <>& 替换
    key = blog.trim(key);
    key = key.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/&/g, '&amp;');

    // doms 为搜索栏中所有隐藏的li元素，每个li元素都对应一个文章
    let doms = document.querySelectorAll('.list-search li');
    let h1 = '<span class="hint">';
    let h2 = '</span>';
    for (let i = 0; i < doms.length; i++) {
      let title = titles[i];
      let content = contents[i];
      let dom_li = doms[i];
      let dom_title = dom_li.querySelector('.title');
      let dom_content = dom_li.querySelector('.content');

      dom_content.innerHTML = '';

      // 空字符隐藏
      if (key == '') {
        dom_li.setAttribute('hidden', true);
        continue
      }
      let hide = true;
      let r1 = new RegExp(blog.encodeRegChar(key), 'gi');
      let r2 = new RegExp(blog.encodeRegChar(key), 'i');

      // 标题全局替换
      if (r1.test(title)) {
        hide = false;
        dom_title.innerHTML = title.replace(r1, h1 + key + h2);
      }
      // 内容先找到第一个，然后确定100个字符，再对这100个字符做全局替换
      let cResult = r2.exec(content)
      if (cResult) {
        hide = false
        let index = cResult.index
        let leftShifting = 10
        let left = index - leftShifting
        let right = index + (100 - leftShifting)
        if (left < 0) {
          right = right - left
        }
        content = content.substring(left, right)
        dom_content.innerHTML = content.replace(r1, h1 + key + h2) + '...'
      }
      // 内容未命中标题命中，内容直接展示前100个字符
      if (!cResult && !hide && content) {
        dom_content.innerHTML = content.substring(0, 100) + '...'
      }
      if (hide) {
        dom_li.setAttribute('hidden', true)
      } else {
        dom_li.removeAttribute('hidden')
      }
    }
  }

  blog.addEvent(input, 'input', function (event) {
    if (!inputLock) {
      search(event.target.value)
    }
  })

  blog.addEvent(input, 'compositionstart', function (event) {
    inputLock = true
  })

  blog.addEvent(input, 'compositionend', function (event) {
    inputLock = false
    search(event.target.value)
  })
})