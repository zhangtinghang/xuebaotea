
var sendFormData = function (dataObj,fileArr){
	var uploader = null;
	//加密
	var state = app.getState();
	var key = state.data.key;
	dataObj.teacherId = state.data.id;
	dataObj.userId = state.data.id;
	dataObj.timestamp = JSON.stringify(Date.parse(new Date()));
	console.log(JSON.stringify(dataObj))
	//取出key相加后返回
	var hashStr = encryptAdd(dataObj);
	console.log('2222==',hashStr)
	//处理数据结束
	var sortStr = sortArr(hashStr);
	var hash = CryptoJS.HmacSHA1(sortStr,key);
	//前端使用HmacSHA1加密必须先将hash输出到input中才能获取正常值
	getPassword.value = hash;
	dataObj.token=getPassword.value;
	
	var file = fileArr.file || [];
	var url =ajaxUrl+'/restful1/teacher/teachernews/newteachernews';
		uploader = plus.uploader.createUpload(url, {
			method: 'POST'
		}, function(upload, status) {
			console.log("upload cb:"+upload.responseText);
			if(status==200){
				var data = JSON.parse(upload.responseText);
				if (data.code === 200) {
					console.log('提交成功！');
					plus.nativeUI.toast('提交成功');
					mui.back();
				}
			}else{
				console.log("upload fail");
				console.log(status);
				console.log(JSON.stringify(upload))
			}
			
		});
		//添加上传数据
		mui.each(dataObj, function(index, element) {
				console.log("addData:"+index+","+element);
				uploader.addData(index, element)
		});
		//添加上传文件
		mui.each(file, function(index, element) {
			var f = file[index];
			console.log("addFile:"+JSON.stringify(f.path));
			uploader.addFile(f.path, {
				key: "file"
			});
		});
		//开始上传任务
		uploader.start();
	};
	

//取出obj中的值，并且相加
var encryptAdd = function(dataObj){
	var dataStr = '';
	for(var key in dataObj){
		dataStr+=dataObj[key];
   } 
	return dataStr;
}
//对相加后的值排序
var sortArr = function(data){
	var len = data.length;
	var str = data;
	var tempArr = [];
	for (var i = 0; i < len; i++) {
	  tempArr.push(str.charAt(i));
	}
	tempArr = tempArr.sort();
	str = tempArr.join('');
	return str;
}