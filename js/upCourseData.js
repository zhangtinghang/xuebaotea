//新增排课
	var addPicker = new mui.PopPicker({
				layer: 3,
				title:'选择日期',
				buttons:['取消', '确定']
			});
	var timePicker = new mui.PopPicker({
				layer: 3,
				title:'选择时间',
				buttons:['取消', '确定']
		});
	addPicker.setData(cityData3);
	timePicker.setData(timeData);

var startDate = 0;
var endDate = 0;
//打开日期
function openDate(StartDate,EndDate){
	//获得原始日期 持续时间
	startDate = StartDate;
	endDate = EndDate;
	var courseStartTime = StartDate.split(" ")[1].trim();
	var StartDate = StartDate.replace(/-/g,"/");
	var EndDate = EndDate.replace(/-/g,"/");
	var StartTimestamp = new Date(StartDate).getTime();
	var EndDateTimestamp = new Date(EndDate).getTime();
	durtionTime = EndDateTimestamp - StartTimestamp;
	addPicker.show(function(date) {
		//获取目标开始日期，推出结束日期
		var courseStartDate = todu(_getParam(date[0], 'value'))+'/'+todu(_getParam(date[1], 'value'))+'/'+todu(_getParam(date[2], 'value')) + ' ' +courseStartTime;
		var changeStartTimestamp = new Date(courseStartDate).getTime();
		var changeEndTimestamp = durtionTime + changeStartTimestamp;
		//将时间撮转为日期，存入变量
		var coursestartTime = new Date(changeStartTimestamp);
		var startgetYear = todu(coursestartTime.getFullYear(),true);
		var startgetMonth = todu(coursestartTime.getMonth()+1,true);
		var startgetDate = todu(coursestartTime.getDate(),true);
		var starthours = todu(coursestartTime.getHours(),true);
		var startminu = todu(coursestartTime.getMinutes(),true);
		//结束时间
		var endcourseEndTime = new Date(changeEndTimestamp);
		var endgetYear = todu(endcourseEndTime.getFullYear(),true);
		var endgetMonth = todu(endcourseEndTime.getMonth()+1,true);
		var endgetDate = todu(endcourseEndTime.getDate(),true);
		var endhours = todu(endcourseEndTime.getHours(),true);
		var endminu = todu(endcourseEndTime.getMinutes(),true);
		
		//本地生成排课信息
		startDate = startgetYear+'-'+startgetMonth+'-'+startgetDate+' '+starthours+':'+startminu+':'+'00';
		endDate = endgetYear+'-'+endgetMonth+'-'+endgetDate+' '+endhours+':'+endminu+':'+'00';
		if(vm.course.courseStartTime){
			vm.course.courseStartTime = startDate;
			vm.course.courseEndTime = endDate;
		}else{
			vm.course.courseStartDate = startDate;
			vm.course.courseEndDate = endDate;
		}
	})
}
//打开时间
function openTime(StartDate,EndDate){
		//获得原始日期 持续时间
		startDate = StartDate;
		endDate = EndDate;
		var StartDate = StartDate.replace(/-/g,"/");
		var EndDate = EndDate.replace(/-/g,"/");
		var courseStarDate = StartDate.split(" ")[0].trim();
		var StartTimestamp = new Date(StartDate).getTime();
		var EndDateTimestamp = new Date(EndDate).getTime();
		var durtionTime = EndDateTimestamp - StartTimestamp;
	timePicker.show(function(items) {
		//获取目标开始时间，推出结束时间
		var courseStartTime = courseStarDate + ' ' + todu(_getParam(items[0],'value'))+':'+todu(_getParam(items[1],'value'))+':'+'00';
		console.log('修改后的时间===',courseStartTime)
		var changeStartTimestamp = new Date(courseStartTime).getTime();
		var changeEndTimestamp = durtionTime + changeStartTimestamp;
		//将时间撮转为日期，存入变量
		var coursestartTime = new Date(changeStartTimestamp);
		var startgetYear = todu(coursestartTime.getFullYear(),true);
		var startgetMonth = todu(coursestartTime.getMonth()+1,true);
		var startgetDate = todu(coursestartTime.getDate(),true);
		var starthours = todu(coursestartTime.getHours(),true);
		var startminu = todu(coursestartTime.getMinutes(),true);
		//结束时间
		var endcourseEndTime = new Date(changeEndTimestamp);
		var endgetYear = todu(endcourseEndTime.getFullYear(),true);
		var endgetMonth = todu(endcourseEndTime.getMonth()+1,true);
		var endgetDate = todu(endcourseEndTime.getDate(),true);
		var endhours = todu(endcourseEndTime.getHours(),true);
		var endminu = todu(endcourseEndTime.getMinutes(),true);
		
		//本地生成排课信息
		startDate = startgetYear+'-'+startgetMonth+'-'+startgetDate+' '+starthours+':'+startminu+':'+'00';
		endDate = endgetYear+'-'+endgetMonth+'-'+endgetDate+' '+endhours+':'+endminu+':'+'00';
		if(vm.course.courseStartTime){
			vm.course.courseStartTime = startDate;
			vm.course.courseEndTime = endDate;
		}else{
			vm.course.courseStartDate = startDate;
			vm.course.courseEndDate = endDate;
		}
	})
}
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
	var _getParam = function(obj, param) {
		return obj[param] || '';
	};
