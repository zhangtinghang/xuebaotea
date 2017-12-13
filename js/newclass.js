(function(){
mui.init();
mui.plusReady(function () {
    //监听返回
    listenReturn();
    //完成处理
    listenReturnRight('完成');
    var ws = plus.webview.currentWebview();
	var view = ws.getTitleNView();
    view.addEventListener("click", function(e) {
	if(screen.width - e.clientX <= 60){
			//事件逻辑处理
			mui.back();
		}
	}, false);
	var dataArr = {};//存放数据容器
	var doc = {
		pop:document.getElementById("popover"),
		course_description:document.getElementById("course_description"),
		left_site:document.getElementById("left_site"),
		change_class:document.getElementById("change_class"),
		addClass:document.getElementById('addClass'),
		fast_add:document.getElementById("fast_add"),
		course_li:document.getElementsByClassName('course_li'),
		confirmBtn:document.getElementById("confirmBtn"),
		returnBtn:document.getElementById("returnBtn"),
		className:document.getElementById("className"),
		courseStudents:document.getElementById("courseStudents"),
		courseNums:document.getElementById("courseNums")
	}
	//接收开设年级参数
	window.addEventListener('classChange',function(event){
		var classArr = event.detail.classArr;
		var classdata = event.detail.classdata;
		console.log('接收开设年级参数',classArr,classdata)
		dataArr.classGrade=classArr;
	});
	//接收课程介绍
	window.addEventListener('courseChange',function(event){
		var teach_goal = event.detail.teach_goal;
		var teach_content = event.detail.teach_content;
		var imgfile = event.detail.imgfile;
		var courseObj = {
		    teach_goal:teach_goal.value,
		    teach_content:teach_content.value,
		    imgfile:imgfile
	  	}
		dataArr.courseObj=courseObj;
	});
	//接收授课地址
		window.addEventListener('addressChange',function(event){
		var organizationId = event.detail.organizationId;
		var name = event.detail.name;
		console.log(organizationId,name)
		dataArr.organizationId=organizationId;
//		var imgfile = event.detail.imgfile;
//		var courseObj = {
//		    teach_goal:teach_goal.value,
//		    teach_content:teach_content.value,
//		    imgfile:imgfile
//	  	}
		
	});			
	//遮罩层
	var mask = mui.createMask(function() {
		doc.pop.classList.remove('mui-active');
	});
	//课程介绍
	doc.course_description.addEventListener('tap',function(){
		openView.nativeView('course_introduce.html', 'course_introduce', '课程介绍');
	}, false);
	//授课地址
	doc.left_site.addEventListener('tap',function(){
		openView.nativeView('../pages_student/location.html', 'location', '地址');
	}, false)
	//开设年级
	doc.change_class.addEventListener('tap',function(){
		openView.nativeView('../pages_myself/study_class.html', 'study_class', '开设年级',{'type':'newclass'});
	}, false)
	//新增排课
	var addPicker = new mui.PopPicker({
				layer: 3,
				title:'选择日期',
				buttons:['取消', '下一步']
			});
	var timePicker = new mui.PopPicker({
				layer: 3,
				title:'选择日期'
			});
	addPicker.setData(cityData3);
	timePicker.setData(cityData3);
		doc.addClass.addEventListener('tap', function(event) {
		addPicker.show(function(items) {
				console.log(JSON.stringify(items));
				//返回 false 可以阻止选择框的关闭
//							return false;
			timePicker.show(function(items){
				
				console.log(items)
			})
			});
		}, false);
	
	//快速排课
	var fastPicker = new mui.PopPicker({
			title:'快速添加'
		});
	fastPicker.setData([{
		value: '0',
		text: '每天时间重复'
	}, {
		value: '1',
		text: '每周时间重复'
	}, {
		value: '2',
		text: '自定义时间'
	}]);
	
	doc.fast_add.addEventListener('tap',function(){
		if(doc.course_li.length!=0){
			fastPicker.show(function(items){					
				console.log('快速排课',JSON.stringify(items))
				if(items[0].value=='2'){
					setTimeout(function(){
						mask.show();
						doc.pop.classList.add('mui-active');
					},50);
				}
			})
		}else{
			//直接打开自定义
			setTimeout(function(){
				mask.show();
				doc.pop.classList.add('mui-active');
			},50);
		}
	})
	
	//点击确定			  	
    doc.confirmBtn.addEventListener('tap',function(){
    	doc.pop.classList.remove('mui-active');
    	mask.close();
    })
    //点击取消
    doc.returnBtn.addEventListener('tap',function(){
    	doc.pop.classList.remove('mui-active');
    	mask.close();
    })
    
	//单选框
   var list_ul = document.getElementById("list_ul");
   var list_li = document.getElementsByClassName('evaluate_btn');
   mui('.comment_btn').on('tap','.evaluate_btn',function(){
   	for(var i=0;i<list_li.length;i++){
   		var className = 'class_add_btn'+(i+1);
   		list_li[i].classList.remove(className);
   	}
   	var that = this;
   	var data_num = that.getAttribute('data-num');
   	that.classList.add('class_add_btn'+data_num);
   });
			
	//遮罩复选框
	mui('.popover_list_ul').on('tap','li',function(){
	   	var that = this;
	   	var child = that.childNodes;
	   	var span = child[0];
	   	var img = child[1];
	   	if(span.classList.contains('text_active')){
			    span.classList.remove('text_active');
			}else{
				span.classList.add('text_active');
			}
	   	//lastIndexOf返回一个指定的字符串值最后出现的位置
	   	var imgName = img.src.substr(img.src.lastIndexOf('/') + 1); 
	   if(imgName =='kspk_no.png'){
	   		img.src="../images/myself/kspk_yes.png"
	   }else{
	   		img.src="../images/myself/kspk_no.png"
		   } 	
	   })
})
})()
