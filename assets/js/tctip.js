var tctipUtil = {

	/***在目标元素target最后创建新元素。
	 * 新元素标签名为tagName,属性由param键值对决定
	 */
createElement	: function(param, tagName, target) {
				   var element = document.createElement(tagName || "div");
				   for (var key in param) {
					   key == "style" ? (element[key].cssText = param[key]) : (element[key] = param[key])
				   }
				   return (target || document.body).appendChild(element);
			   },
createElementHtml:function(param, tagName, target) {
				   var element = document.createElement(tagName || "div");
				   for (var key in param) {
					   key == "style" ? (element[key].cssText = param[key]) : (element[key] = param[key])
				   }
				   return (target || document.body).appendChild(element);
			   },

/***
 * 根据className获得元素
 */
getElementsByClassName:	function(className,node) {
						node = node || document;
						if (node.getElementsByClassName) { // use native implementation if available
						  return node.getElementsByClassName(className);
						}else {
						  return (function getElementsByClass(searchClass,node) {
								  var classElements = [],
								  els = node.getElementsByTagName("*"),
								  elsLen = els.length,
								  pattern = new RegExp("(^|\\s)"+searchClass+"(\\s|$)"), i, j;

								  for (i = 0, j = 0; i < elsLen; i++) {
									if ( pattern.test(els[i].className) ) {
										classElements[j] = els[i];
										j++;
									}
								  }
								  return classElements;
								  })(className, node);
							}
						},
/***
 * firefox兼容性处理
 * 如果是firefox，则使用textContent
 * 否则使用innerText
 */
getTextKey:		function(){
					if(tctipUtil.getExplorer() == "firefox"){
						return "textContent";
					}
					return "innerText";
				},

/***
 * 判断浏览器类型
 */
getExplorer:	function(){
						var explorer = window.navigator.userAgent.toLowerCase();
						//ie 
						if (explorer.indexOf("msie") >= 0) {
							return "ie";
						}
						//firefox 
						else if (explorer.indexOf("firefox") >= 0) {
							return "firefox";
						}
						//Chrome
						else if(explorer.indexOf("chrome") >= 0){
							return "chrome";
						}
						//Opera
						else if(explorer.indexOf("opera") >= 0){
							return "opera";
						}
						//Safari
						else if(explorer.indexOf("safari") >= 0){
							return "safari";
						}
					},
/***
 * 增加onload函数
 * 如果onload已经存在，则在原来onload函数后追加func。
 * 否则将func赋值于onload函数
**/
addLoadEvent	: function(func){
					  if(typeof window.onload != "function"){
						  window.onload = func;
					  }else{
						  var oldonload = window.onload;
						  window.onload = function(){
							  oldonload();
							  func();
						  }
					  }
				  },

/****
 * 是否支持canvas属性
 * 根据结果可以决定绘制二维码的方式
 */
isSupportCanvas	: function(){
					  try{
						  document.createElement("canvas").getContext("2d");
						  return true;
					  } catch (e) {
						  return false;
					  }
				  },

/**
  * * 判断mouseover/mouseout事件是否在事件源上执行
  * * 如果是，则执行相关操作，如果不是而是在事件源内部子元素上，则不执行操作
  * * @param {xxxEvent} e Event对象（当前的事件）
  * * @param {HTMLDivElement} target 事件源（目标对象）
  * * @return {Boolean}
* */
isMouseLeaveOrEnter	: function(e, target) {
						  if(!e) return false
						  if (e.type != 'mouseout' && e.type != 'mouseover' && e.type != 'click') return false;
						  var reltg = e.relatedTarget ? e.relatedTarget : e.type == 'mouseout' ? e.toElement : e.fromElement;
						  while (reltg && reltg != target)
							  reltg = reltg.parentNode;
						  return (reltg != target);
					  },


/***
 * 获得当前event,兼容ie和ff
 */
currentEvent:	function()
				{
					if(document.all)  return window.event;
					func= tctipUtil.currentEvent.caller;
					while(func!=null){
						var arg0=func.arguments[0];
						if(arg0){
							if((arg0.constructor==Event || arg0.constructor ==MouseEvent) || 
							   (typeof(arg0)=="object" && arg0.preventDefault && arg0.stopPropagation)){
								return arg0;
							}
						}
						func=func.caller;
					}
					return null;
	},
/****
 *两个obj合并；如果都存在的元素，则选择source
isALl: 如果source中有target不存在的属性，是否增加
**/
mergeArray : function (target, source, isAll) {
			for (var p in source) {
				if (target.hasOwnProperty(p) || isAll) {
					target[p] = source[p];
				}
			}
			return target;
},


/**
 * 简单动画效果
 * 用来显示和隐藏插件
 */
animate:	function(props, element, speed){
				/***
				 * speed和动画效果,
				 * 待实现
				 */
				for(var key in props){
					element.style[key] = props[key];
				}

		}
};


/***
 * 用来生成插件的js
 */
var tctip =  window.tctip || {
	/**
	 * 配置文件，包括基本信息，比如imagePrefix，btnId等。
	 * list配置因为较为复杂，单独拆分处理；处理完毕后加入myConfig
	 */
	myConfig : {
		headText : "喜欢请打赏",
		siderText: "公告 & 打赏",
		siderTextTop: "-84px",
		siderBgcolor: "#323d45",
		siderTop:"10%",
        buttomText:"了解更多",
        buttomLink:"https://github.com/haddyyang/tctip"
	},

	/***
	 * 根据默认配置和用户自定义配置生成最终使用配置文件
	 **/
	myRewards : null,
	myRewardsBtn : null,
	myRewardsMain:	null,
	myRewardsbox: null,
	myRewardsList:null,
	myRewardsDetail:null,
	myRewardsListUl: null,
	myRewardsUbox: null,

	/***
	 * 当前li。
	 * 鼠标切换的时候需要移除className
	 */
	currentLi:		null,
	/***
	 * 生成右侧二维码的当前数据
	 */
	currentData:	null,

	/***
	 * 计算出配置文件
	 * **/
	generateMyConfig:	function(){
							tctip.myConfig = tctipUtil.mergeArray(tctip.myConfig, tctipConfig);
							var list = [];
							var num = 0;
							var hasOn = false;//是否存在显示二维码的list
							for(var key in tctipConfig.list){
								var one = tctipConfig.list[key];
								if(one.className == "myR-on"){
									hasOn = true;
								}
								list.push(one);
								num += 1;
								if(num >= 5){
									break;
								}
							}

							if(hasOn == false){
								list[0].className = "myR-on";
							}

							tctip.myConfig.list = list;
						},

	generateMyRewards:	function(){

							this.myRewards  = tctipUtil.createElement({
								id:			"myRewards", 
								className: "myRewards",
								style:"top:"+this.myConfig.siderTop+";"});/*,
								onmouseover : function(){
													tctip.showTctip(this);
												},
								onmouseout	: function(){
													tctip.hideTctip(this);
												}
								});*/
							this.generateLeftBtn();
							this.generateMyRewardsMain();
						},
	generateLeftBtn:	function(){
							var obj = {className: "btn-myRewards", href: "javascript:;"};
							obj['style'] = "margin-top:"+tctip.myConfig.siderTextTop+";";
							obj['onmouseover'] = function(){ tctip.showTctip(this);};
							this.myRewardsBtn = tctipUtil.createElement(obj, 'a', this.myRewards);

							var obj = {className: "sider-text"};
							obj["style"]="background-color:"+tctip.myConfig.siderBgcolor;
							obj[tctipUtil.getTextKey()] = tctip.myConfig.siderText;
							tctipUtil.createElement(obj, 'p', this.myRewardsBtn);
	},

	/***
	 * 显示打赏插件
	 **/
	showTctip:			function(target){
							var e = tctipUtil.currentEvent();
							if(tctipUtil.isMouseLeaveOrEnter(e, target)){
								tctipUtil.animate({width:"240px"}, tctip.myRewards, 200);
								tctipUtil.animate({display:"none"}, tctip.myRewardsBtn, 200);
							}
						},
	/***
	 * 隐藏打赏插件
	 **/
	hideTctip:			function(target){
							var e = tctipUtil.currentEvent();
							if(tctipUtil.isMouseLeaveOrEnter(e, target)){
								tctipUtil.animate({width:"0px"}, tctip.myRewards, 200);
								tctipUtil.animate({display:"block"}, tctip.myRewardsBtn, 200);
							}
						},

	generateMyRewardsMain:	function(){
							this.myRewardsMain = tctipUtil.createElement(
								{className: "myRewards-main",onmouseout:function(){tctip.hideTctip(this);}},
								'div', this.myRewards);
							var main = this.myRewardsMain;
							var obj = {className: "sider-close", title:"收起", onclick:function(){tctip.hideTctip(main);}};
							obj[tctipUtil.getTextKey()] = ">>";
							obj['href'] = "javascript:;";
							tctipUtil.createElement(obj, 'a', this.myRewardsMain);

							var obj = {className: "myR-h"};
							obj[tctipUtil.getTextKey()] = tctip.myConfig.headText;
							tctipUtil.createElement(obj, 'h1', this.myRewardsMain);

							this.generateMyRewardsbox();
							
							var myRewardsBot = tctipUtil.createElement({className: "myR-bot"}, 'p', this.myRewardsMain);
							obj = {href:tctip.myConfig.buttomLink || "https://github.com/HaddyYang/tctip", target: "_blank"};
							obj[tctipUtil.getTextKey()] =  tctip.myConfig.buttomText || "了解更多";
							tctipUtil.createElement(obj, 'a', myRewardsBot);
	},

	generateMyRewardsbox:	function(){
								this.myRewardsbox = tctipUtil.createElement({className: "myRewardsbox"},"div", this.myRewardsMain);
								this.generateMyRewardsList();
								this.generateMyRewardsDetail();
							},
	
	generateMyRewardsList:	function(){
								this.myRewardsList = tctipUtil.createElement({className: "myRewards-list"},"div", this.myRewardsbox);

								if(tctip.myConfig.list.length >= 5){
									this.myRewardsListUl = tctipUtil.createElement({}, 'ul', this.myRewardsList);
									//如果不足五行，新加一个class not-full
								}else{
									this.myRewardsListUl = tctipUtil.createElement({className: "not-full"}, 'ul', this.myRewardsList);
								}

							/***
								* 本来用的是for(var i in list)形式，
								* 但是发现有些网页会给array加一些默认属性，因此改为现在的循环形式
							***/
								for(var i= 0; i < 5; i++){
									if( ! tctip.myConfig.list.hasOwnProperty(i)){
										break;
									}
									var one		= tctip.myConfig.list[i];
									var li_el	= tctipUtil.createElement({className: one.className}, 'li', this.myRewardsListUl);
									var a_el	= null;
									/**用闭包方式动态绑定onmouseover 事件**/
									(function(){
										var tmp_one = one;
										var a_params = {
												href		:"javascript:;", 
												onmouseover : function(){
															tctip.leftMouseover(this, tmp_one);
															}
												};
											a_params[tctipUtil.getTextKey()] = one.name;
												/**第五个li增加fifth，去除boder-bottom*/
										if(i==4){
											a_params.className = "fifth";
										}
										a_el = tctipUtil.createElement(a_params, 'a', li_el);
									})();

									if(one.className == "myR-on"){
											this.currentLi	= li_el;
											this.currentData = one;
									}

									tctipUtil.createElement({className: "png", src: one.icon, alt:one.name}, 'img', a_el);
								}
							},
	generateMyRewardsDetail:function(){
								if(tctip.myRewardsDetail){
									tctip.myRewardsbox.removeChild(tctip.myRewardsDetail);
								}
								this.myRewardsDetail = tctipUtil.createElement({className: "myRewards-detail"},"div", this.myRewardsbox);

								this.myRewardsUbox = tctipUtil.createElement({className: "myRewards-ubox"},"div", this.myRewardsDetail);
								var obj = {className: "myRewards-code-tit"};
								if(tctip.currentData.hasOwnProperty('text')){
									obj[tctipUtil.getTextKey()] =  "最新公告";
									tctipUtil.createElement(obj,"p", this.myRewardsUbox);

									var myRewardsCode = tctipUtil.createElement({className: "myRewards-code"}, 'div',  this.myRewardsUbox);
									obj = {className: "myRewards-text"};
									obj['innerHTML'] = tctip.currentData.text || tctip.currentData.desc || tctip.currentData.name;
									var myRewardsAccount = tctipUtil.createElement(obj, "p", myRewardsCode);

								}else{
									obj[tctipUtil.getTextKey()] =  "扫描二维码打赏";
									tctipUtil.createElement(obj,"p", this.myRewardsUbox);
									var myRewardsCode = tctipUtil.createElement({className: "myRewards-code"}, 'div',  this.myRewardsUbox);
									if(tctip.currentData.hasOwnProperty('qrimg')){
										tctipUtil.createElement({src: tctip.currentData.qrimg}, 'img',  myRewardsCode);

										obj = {className: "myRewards-account"};
										obj[tctipUtil.getTextKey()] = tctip.currentData.desc || tctip.currentData.name;
										var myRewardsAccount = tctipUtil.createElement(obj, "p", this.myRewardsUbox);
									}
								}
							},
/***
 * 左侧鼠标滑过的效果
 * param element: 当前对象
 * param data 结构如下
 * {img: "img/bitcoin.png", name:"比特币", className:""}
 */
	 leftMouseover	:	function(element, data){
							tctip.currentLi.className = "";
							element.parentNode.className = "myR-on";
							tctip.currentLi = element.parentNode;
							tctip.currentData = data;
							tctip.generateMyRewardsDetail();
	},

	init:		function(){
					if(!document.body){
						/**判断body是否存在，如果不存在则等待完成**/
						setTimeout(tctip.init,0);
					}else{
						tctip.generateMyConfig();
						tctip.generateMyRewards();
					}
		}
};
tctip.init();
