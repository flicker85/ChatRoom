window.onload=function(){		
	var socket;
	var status = false;//是否加入聊天室
	var imgs = document.getElementById("imgsDiv").getElementsByTagName("img");
	for(var i=0;i<imgs.length;i++){
		imgs[i].addEventListener("click",function(){
			for(var j=0;j<imgs.length;j++){
				if(imgs[j].className)
					imgs[j].className='';
			}			
			this.className="selPic";
		});
	}

	var template = document.getElementById("template").getElementsByTagName("div")[0].cloneNode(true);
	document.getElementById("sendBtn").addEventListener("click",function(){
		var path,str,temp=template.cloneNode(true);
		for(var i=0;i<imgs.length;i++){
			if(imgs[i].className){
				path = temp.getElementsByTagName("img")[0].src = imgs[i].src;				
				break;
			}
		}		
		if(!path)
			path = temp.getElementsByTagName("img")[0].src = "images/00.gif";
		
		str = temp.getElementsByTagName("p")[0].innerHTML = document.getElementById("txt").value;
		document.getElementById("panel").insertBefore(temp,
			document.getElementById("panel").childNodes[0]);
		
		if(status){
			socket.emit('message',{pic:path,msg:str});
			document.getElementById("txt").value="";
		}
	});

	document.getElementById("joinBtn").addEventListener("click",function(){
		if(!status){
			if(!socket){
				socket = io.connect('http://chatroom-9847.onmodulus.net');
				//socket = io.connect('http://localhost:8080');
				socket.on('clientMsg',function(msg){//alert(JSON.stringify(msg));
					temp = template.cloneNode(true);
					temp.getElementsByTagName("img")[0].src = msg.pic;
					temp.getElementsByTagName("p")[0].innerHTML = msg.msg;
					document.getElementById("panel").insertBefore(temp,
					document.getElementById("panel").childNodes[0]);
				});
				socket.on('connect', function (){
					document.getElementById("status").innerHTML = "在线";
					document.getElementById("online").style.display = "inline";
				});
				socket.on('disconnect', function (){
					document.getElementById("status").innerHTML = "离线";
					document.getElementById("online").style.display = "none";
				});
				socket.on('online',function(online){
					document.getElementById("online").innerHTML = "在线 "+online.count+" 人";
				});
			}
			else{
				socket.socket.reconnect();
			}
			
			status = true;
		}
	});

	document.getElementById("abortBtn").addEventListener("click",function(){
		if(status){
			socket.disconnect();
			status = false;
		}
	});

	document.getElementById("next").addEventListener("click",function(){
		if(typeof(num)=='undefined')
			num=1;
		else
			num++;
		if(num>4){num=1;}
		document.getElementById("bg").src="images/b"+num+".jpg";
	});
}