var http = require("http");
var fs = require("fs");
var url = require("url");
exports.start = function(){
    var server = http.createServer(function(request, response) {
		var pathname = url.parse(request.url).pathname;
        var ext = pathname.match(/(\.[^.]+|)$/)[0];//取得后缀名
		//console.log("."+request.url);
        switch(ext){
            case ".css":
            case ".js":				
                fs.readFile("."+request.url, 'utf-8',function (err, data) {//返回css、js文件
                    if (err) {showError();return;}//throw err;
                    response.writeHead(200, {
                        "Content-Type": {
                             ".css":"text/css",
                             ".js":"text/javascript",
                      }[ext]
                    });
                    response.write(data);
                    response.end();
                });
                break;
            case ".html":
                fs.readFile("."+request.url, 'utf-8',function (err, data) {//返回html网页内容
                    if (err) {showError();return;}//throw err;
                    response.writeHead(200, {
                        "Content-Type": "text/html"
                    });
                    response.write(data);
                    response.end();
                });
			break;
			case ".jpg":
			case ".gif":
				fs.readFile("."+request.url,function (err, buf) {//返回图片
                    if (err) {showError();return;}//if (err) throw err;
                    response.writeHead(200, {
                        "Content-Type": {".jpg":"image/jpeg",".gif":"image/gif"}[ext],
						"Content-Length": buf.length
                    });
                    response.write(buf);
                    response.end();
                });
			break;
			default:
				fs.readFile("./demo.html", 'utf-8',function (err, data) {//返回html网页内容
                    if (err) {showError();return;}//throw err;
                    response.writeHead(200, {
                        "Content-Type": "text/html"
                    });
                    response.write(data);
                    response.end();
                });
			break;
        }
		function showError(){
			response.writeHead(404);
			response.write('404');
			response.end();
		}
    });
	server.listen(8080);
	var io = require('socket.io').listen(server);
	var onlineUsers = 0;
	io.sockets.on('connection', function(socket){
		console.log("connection " + socket.id + " accepted.");
		onlineUsers++;
		io.sockets.emit('online', { count: onlineUsers });
		socket.on('message', function(message){
			console.log("received message: " + message + " - from client " + socket.id);
			socket.broadcast.emit('clientMsg',message);
		});
		socket.on('disconnect', function(){
			console.log("connection " + socket.id + " terminated.");
			onlineUsers--;
			io.sockets.emit('online', { count: onlineUsers });
		});
	});
}