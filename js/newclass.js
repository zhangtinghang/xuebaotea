(function(){
mui.init();
mui.plusReady(function () {
    //监听返回
    listenReturn();
    //完成处理
    listenReturnRight('完成');
    var ws = plus.webview.currentWebview();
	var view = ws.getTitleNView();
	var dataArr = {};//存放数据容器
	var courseArr = [];//存放排课信息容器
	var fileArr = {};//存放照片容器
	var classType = '14';//班课类型
	var courseStudentflag = 0;//学生数
	var courseflag = 0; //课程节数
	var classGrade ='';
	var Subject = '';
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
		courseNums:document.getElementById("courseNums"),
		address_img_text:document.getElementById("address_img_text"),
		showGrade:document.getElementById("showGrade")
	}
	
	view.addEventListener("click", function(e) {
	if(screen.width - e.clientX <= 60){
			//事件逻辑处理
			var courseSectionJson = JSON.stringify(courseArr);
			var courseStudents = courseStudentflag;
			var courseNums = courseflag;
			dataArr.classType = classType;
			dataArr.classGrade=classGrade;
			dataArr.courseSectionJson = courseSectionJson;
			dataArr.courseStudents = courseStudents;
			dataArr.courseNums = courseNums;
			dataArr.className = doc.className.value;
			dataArr.subject = Subject;
			if(dataArr.classType==""||dataArr.classGrade==""||dataArr.courseSectionJson==""||dataArr.courseStudents==""||dataArr.courseNums==""||dataArr.className==""){
				return plus.nativeUI.toast('请填写完整信息！');
			}
			sendFormData(dataArr,fileArr);
		}
	}, false);
	//接收开设年级参数
	window.addEventListener('classChange',function(event){
		var classArr = event.detail.classArr;
	 	var classdata = event.detail.classdata;
	 	doc.showGrade.innerHTML = lookdata(classdata,classArr);
	  	classGrade = classArr;
	  	//获取课程信息
	  	var subjectId = event.detail.subjectId;
	  	var subjectName = event.detail.subjectName;
		Subject = subjectId;
	});
	function lookdata(classdata,classArr){			
		for(var i = 0;i<classdata.length;i++){
	  	if(classdata[i].classId == classArr){			  		
	  		return classdata[i].className;
	  	}
	  }
	}
	//接收课程介绍
	window.addEventListener('courseChange',function(event){
		dataArr.courseTarget=event.detail.teach_goal;
		dataArr.courseContent=event.detail.teach_content;
		fileArr.courseFile = event.detail.imgfile;
	});
	//接收授课地址
		window.addEventListener('addressChange',function(event){
		var organizationId = event.detail.organizationId;
		var name = event.detail.name;
		doc.address_img_text.innerText = name;
		console.log(typeof organizationId)
		dataArr.organizationId=organizationId;
		
	});			
	//监听上课人数值改变
	doc.courseStudents.addEventListener('change',function(){
		courseStudentflag = doc.courseStudents.value;
	});
	//监听上课节数值改变
	doc.courseNums.addEventListener('change',function(){
		courseflag = doc.courseNums.value;
	});
	//监听删除课程
	mui('#course_ul').on('tap','.del_img_btn',function(){
		var index = this.getAttribute('data-index');
		courseArr.splice(index,1);
		vm.arrangement = courseArr;
	})
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
		openView.nativeView('../pages_student/location.html', 'location', '地址',{type:'new_class'});
	}, false)
	//开设年级
	doc.change_class.addEventListener('tap',function(){
		openView.nativeView('../pages_myself/study_class_radio.html', 'study_class_radio', '开设年级',{'type':'newclass'});
	}, false)
	
	/**
			 * 获取对象属性的值
			 * 主要用于过滤三级联动中，可能出现的最低级的数据不存在的情况，实际开发中需要注意这一点；
			 * @param {Object} obj 对象
			 * @param {String} param 属性名
			 */
	var _getParam = function(obj, param) {
		return obj[param] || '';
	};
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
	timePicker.setData(timeData);
		doc.addClass.addEventListener('tap', function(event) {
		addPicker.show(function(date) {
			timePicker.show(function(items){
				//构造日期时间
				var courseStartDate = todu(_getParam(date[0], 'value'))+'/'+todu(_getParam(date[1], 'value'))+'/'+todu(_getParam(date[2], 'value'));
				var courseStartTime = todu(_getParam(items[0],'value'))+':'+todu(_getParam(items[1],'value'))+':'+'00';
				var courseDurtion = _getParam(items[2], 'value');
				var courseTime = courseStartDate +' '+courseStartTime;
				//获取时间戳
				var courseTimestamp = new Date(courseTime).getTime();
				//将分钟转为毫秒，加上排课时间
				var courseEndTimestamp = courseTimestamp + 1000*60*courseDurtion;
				//转为正常时间
				var courseEndTime = new Date(courseEndTimestamp);
				var getYear = todu(courseEndTime.getFullYear(),true);
				var getMonth = todu(courseEndTime.getMonth()+1,true);
				var getDate = todu(courseEndTime.getDate(),true);
				var hours = todu(courseEndTime.getHours(),true);
				var minu = todu(courseEndTime.getMinutes(),true);
				//本地生成排课信息
				var startDate = todu(_getParam(date[0], 'value'))+'-'+todu(_getParam(date[1], 'value'))+'-'+todu(_getParam(date[2], 'value'));
				var startTime = todu(_getParam(items[0],'value'))+':'+todu(_getParam(items[1],'value'))+':'+'00';
				courseStartDate = startDate+' '+startTime;
				var courseEndDate = getYear+'-'+getMonth+'-'+getDate+' '+hours+':'+minu+':'+'00';
				courseArr.push({courseStartDate:courseStartDate,courseEndDate:courseEndDate});
				vm.arrangement = courseArr;								
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
	}
//	, {
//		value: '2',
//		text: '自定义时间'
//	}
	]);
	
	doc.fast_add.addEventListener('tap',function(){
		if(doc.course_li.length!=0){
			fastPicker.show(function(items){
				var lastTime = courseArr[courseArr.length-1];
				//计算出排课时间数
				var lastCourseStartTime = lastTime.courseStartDate;
				var lastCourseEndTime = lastTime.courseEndDate;
				//转成时间戳
				lastCourseStartTime = lastCourseStartTime.replace(/-/g,"/");
				lastCourseEndTime = lastCourseEndTime.replace(/-/g,"/");
				
				var lastStartTimestamp = Date.parse(new Date(lastCourseStartTime));
				var lastEndTimestamp = Date.parse(new Date(lastCourseEndTime));
				var courseDurtion = lastEndTimestamp - lastStartTimestamp;
				console.log('这是课程时间',lastStartTimestamp,lastEndTimestamp)
				//得到持续时间数
				var DurtionTime = (courseDurtion/1000)/60;
				//根据开始时间往后推n天（根据剩余课程节数）
				if(items[0].value!='2'){
				for(var i=1;i<courseflag;i++){
					//加一天
					if(items[0].value=='0'){
						var startTimestamp = lastStartTimestamp+(1000*60*60*24)*i; 
					}else if(items[0].value=='1'){
						var startTimestamp = lastStartTimestamp+(1000*60*60*24*7)*i; 
					}								
					var endTimeStamp = startTimestamp + courseDurtion;
					//将时间撮转为日期，存入数组
					var coursestartTime = new Date(startTimestamp);
					
					var startgetYear = todu(coursestartTime.getFullYear(),true);
					var startgetMonth = todu(coursestartTime.getMonth()+1,true);
					var startgetDate = todu(coursestartTime.getDate(),true);
					var starthours = todu(coursestartTime.getHours(),true);
					var startminu = todu(coursestartTime.getMinutes(),true);
					//结束时间
					var endcourseEndTime = new Date(endTimeStamp);
					var endgetYear = todu(endcourseEndTime.getFullYear(),true);
					var endgetMonth = todu(endcourseEndTime.getMonth()+1,true);
					var endgetDate = todu(endcourseEndTime.getDate(),true);
					var endhours = todu(endcourseEndTime.getHours(),true);
					var endminu = todu(endcourseEndTime.getMinutes(),true);
					
					//本地生成排课信息
					var courseStartDate = startgetYear+'-'+startgetMonth+'-'+startgetDate+' '+starthours+':'+startminu+':'+'00';
					var courseEndDate = endgetYear+'-'+endgetMonth+'-'+endgetDate+' '+endhours+':'+endminu+':'+'00';
					courseArr.push({courseStartDate:courseStartDate,courseEndDate:courseEndDate});
					vm.arrangement = courseArr;
				}
				}
				//将排好的数据存入数组
				//渲染
				//自定义
				if(items[0].value=='2'){
//					console.log(getClientHeight() + getScrollTop())
//					pop.style.bottom = getClientHeight() + getScrollTop() +'px';
//					setTimeout(function(){
//						mask.show();
//						pop.classList.add('mui-active');
//					},50);
				}
			})
		}else{
			plus.nativeUI.toast('请先增加一节课程！');
//			//直接打开自定义
//			setTimeout(function(){
//				mask.show();
//				doc.pop.classList.add('mui-active');
//			},50);
		}
	})
	//将单位数前加0
	function todu(value,dispose) {
		var dispose = dispose || false;
		if(!dispose){
			var value = value.substr(value.lastIndexOf('-') + 1);
		}
		
		if(value < 10) {
			return '0' + value;
		} else {
			return '' + value;
		}
	}
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
   	classType = that.getAttribute('data-type');
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
