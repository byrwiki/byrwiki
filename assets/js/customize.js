// customize.js

$(document)
  .ready(function() {

    // fix menu when passed
    $('.masthead')
      .visibility({
        once: false,
        onBottomPassed: function() {
          $('.fixed.menu').transition('fade in');
        },
        onBottomPassedReverse: function() {
          $('.fixed.menu').transition('fade out');
        }
      })
    ;

    // create sidebar and attach to menu open
    $('.ui.sidebar')
      .sidebar('attach events', '.toc.item')
    ;

  })
;

// copyright
$('#copyright')
  .html(
   function(){
     var date = new Date();
     return '&copy; ' +  date.getFullYear() + ' BYR-Wiki';
   }
  )
;

// search
var searchServices = {
  "baidu": {
    "id": "baidu",
    "name": "百度",
    "url": "http://www.baidu.com/s?wd="
  },
  "google": {
    "id": "google",
    "name": "谷歌",
    "url": "http://www.google.com/search?q="
  },
  "googlemirror": {
    "id": "googlemirror",
    "name": "谷歌镜像",
    "url": "http://www.acgn.ren/search?q="
  },
  "jd": {
    "id": "jd",
    "name": "京东",
    "url": "http://search.jd.com/Search?keyword="
  },
  "taobao": {
    "id": "taobao",
    "name": "淘宝",
    "url": "https://s.taobao.com/search?q="
  },
  "wechat": {
    "id": "wechat",
    "name": "微信",
    "url": "http://weixin.sogou.com/weixin?query="
  },
  "zhihu": {
    "id": "zhihu",
    "name": "知乎",
    "url": "http://www.zhihu.com/search?q="
  },
  "weibo": {
    "id": "weibo",
    "name": "微博",
    "url": "http://s.weibo.com/weibo/"
  },
  "douban": {
    "id": "douban",
    "name": "豆瓣",
    "url": "http://www.douban.com/search?q="
  },
  "music": {
    "id": "music",
    "name": "音乐",
    "url": "http://music.hao123.com/search?key="
  },
  "byr": {
    "id": "byr",
    "name": "北邮人论坛",
    "url": "http://search.icybee.cn/bbs/?key="
  },
  "github": {
    "id": "github",
    "name": "GitHub",
    "url": "http://github.com/search?q="
  }
};

for (var i in searchServices) {
  $('#search-services').append(
    $('<option>')
      .attr('value', searchServices[i].id)
      .html(searchServices[i].name)
  );
};

$('#search-services')
  .dropdown()
;

$('#search-button').click(function() {
  var service = $('#search-services').val();
  var query = $('#search-query').val();
  window.open(searchServices[service].url + query, '_blank');
});

