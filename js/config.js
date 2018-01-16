/**
 * incView:打开带原生导航条的页面(无返回按钮)
 * usuView:打开新页面
 * NativeView：打开带原生导航条的页面(有返回按钮)
 * url：打开页面相对路径
 * id：页面id
 * title：导航条上显示的名称
 */
var openView = {
	incView: function(url, id, title, extras,bounce) {
		var extras = extras || '';
		var bounce = bounce ||'vertical';
		mui.openWindow({
			url: url,
			id: id,
			extras: extras,
			waiting:{
				autoShow:false
			},
			styles: {
				bounce:bounce,
				titleNView: {
					titleText: title,
					titleColor: "#fefefe",
					titleSize: "20px",
					backgroundColor: "#0dad95",
//					progress: {
//						color: "#C1E4FF",
//						height: "2px"
//					}
				}
			}
		});
	},

	usuView: function(url, id, extras,bounce) {
		var extras = extras || '';
		var bounce = bounce ||'vertical';
		mui.openWindow({
			url: url,
			id: id,
			waiting: {
				autoShow: false,
			},
			extras: extras,
			styles:{
				bounce:bounce
			}
		})
	},

	nativeView: function(url, id, title, extras,bounce){
		var extras = extras || '';
		var title = title || null;
		var bounce = bounce ||'vertical';
		mui.openWindow({
			url: url,
			id: id,
			extras:extras,
			waiting:{
				autoShow:false
			},
			styles: { // 窗口参数 参考5+规范中的WebviewStyle,也就是说WebviewStyle下的参数都可以在此设置
				bounce:bounce,
				titleNView: { // 窗口的标题栏控件
					titleText: title, // 标题栏文字,当不设置此属性时，默认加载当前页面的标题，并自动更新页面的标题
					titleColor: "#fefefe", // 字体颜色,颜色值格式为"#RRGGBB",默认值为"#000000"
					titleSize: "20px", // 字体大小,默认17px
					//		      autoBackButton:"true",
					backgroundColor: "#0dad95", // 控件背景颜色,颜色值格式为"#RRGGBB",默认值为"#F7F7F7"
//					progress: { // 标题栏控件的进度条样式
//						color: "#C1E4FF", // 进度条颜色,默认值为"#00FF00"  
//						height: "2px" // 进度条高度,默认值为"2px"         
//					},
					//		      splitLine:{                       // 标题栏控件的底部分割线，类似borderBottom
					//		        color:"#CCCCCC",                // 分割线颜色,默认值为"#CCCCCC"  
					//		        height:"1px"                    // 分割线高度,默认值为"2px"
					//		      }
					tags: ([{
						tag: 'img',
						id: 'return_' + id,
						src: '_www/images/index/return.png',
						position: {
							top: "10px",
							left: "15px",
							width: "12px",
							height: "23px"
						}
					}])
				}
			}
		});
	}
}

//监听事件
var listenReturn = function() {
	var ws = plus.webview.currentWebview();
	var view = ws.getTitleNView();
	/**
	 * 监听原生控件(返回按钮)click事件
	 */
	view.addEventListener("click", function(e) {
		if(e.clientX > 10 && e.clientX < 40) {
			mui.back();
		}
	}, false);
}
var listenNext = function(text, url, id, title,width) {
	var extras = extras || '';
	var title = title || null;
	var ws = plus.webview.currentWebview();
	var view = ws.getTitleNView();
	var style = style || null;
	var width = width || '44px';
	view.drawText(text, {
		top: '0px',
		right: '18px',
		height: '44px',
		width: width
	}, {
		size: '15px',
		color: '#fefefe'
	}, 'next');
	view.addEventListener("click", function(e) {
	if(screen.width - e.clientX <= 60) {
			openView.nativeView(url, id, title, extras);
		}
	}, false);
	
}

var listenReturnRight = function(text,width,callback){
	var ws = plus.webview.currentWebview();
	var view = ws.getTitleNView();
	var style = style || null;
	var width = width || '44px';
	view.drawText(text, {
		top: '0px',
		right: '18px',
		height: '44px',
		width: width
	}, {
		size: '15px',
		color: '#fefefe'
	}, 'next');
}
//修改上下滑动框架高度
var wrapperFrame = function(){
	//修改框架高度
	var wrapper_box = document.getElementById("wrapper_box");
	var clear_offsetTop = wrapper_box.offsetTop;
	var msg_content = document.body.offsetHeight;
	var wrapperHeight = msg_content-clear_offsetTop;
	wrapper_box.style.height=document.body.offsetHeight-wrapper_box.offsetTop+'px';
	console.log('框架距离顶部高度',clear_offsetTop)
	console.log('body高度',msg_content)
	mui.toast(document.body.offsetHeight)
	//DIV局部滚动
		mui('.mui-scroll-wrapper').scroll({
			indicators: true //是否显示滚动条
		});
}
//修改左右上下框架高度
var silderwrapperFrame = function(){
	var slider = document.getElementById("slider");
	var slider_offsetTop = slider.offsetTop;
	var msg_content = document.body.offsetHeight;
	var wrapperHeight = msg_content-slider_offsetTop;
	slider.style.height=wrapperHeight+'px';
	//滚动区域高度
	var mui_slider_group = document.getElementById("mui-slider-group");
	slider_group_offsetTop = mui_slider_group.offsetTop;
	mui_slider_group.style.height = wrapperHeight - slider_group_offsetTop+'px';
	//DIV局部滚动
	mui('.mui-scroll-wrapper').scroll({
		indicators: true //是否显示滚动条
	});
}
