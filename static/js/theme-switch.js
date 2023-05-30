// Add by Zeng Zhenxiang
// 主题切换
// 显示下拉内容
function displayThemeOptions() {
  var themeDropdown = document.getElementById('themeDropdown');
  themeDropdown.style.display = themeDropdown.style.display === 'none' ? 'block' : 'none';
}
function changeTheme(iconClass) {
  // 主题切换开关的文本以及图标元素
  var themeToggleIcon = document.getElementById('themeToggleIcon');
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
  if(theme) { site_logo.src = blog.baseurl + "/static/img/Luffy_dark.svg"; }
  else { site_logo.src = blog.baseurl + "/static/img/Luffy_light.svg"; }
}
// 页面完成加载后设置网站的主题
function updateTheme(theme) {
  // 更新浏览器缓存
  localStorage.setItem("theme", theme ? "dark" : "light");
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
  if(theme == true) changeTheme('icon-dark');
  else changeTheme('icon-light');
});