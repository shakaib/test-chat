var app = require('http').createServer(handler)
, io = require('socket.io').listen(app)
, fs = require('fs')
, mysql = require('mysql')

var DATABASE  = "node_test"

var CLIENT = [];
var registered = [];

var connection = mysql.createConnection({
  host     : 'localhost',
  database : DATABASE,
  user     : 'root',
  password : 'zohaib'
});


connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }

  console.log('connected as id ' + connection.threadId);
});


app.listen(3000);



function handler (req, res) {
  // fs.readFile(__dirname + '/index.html',
  // function (err, data) {
  //   if (err) {
  //     res.writeHead(500);
  //     return res.end('Error loading index.html');
  //   }
    // console.log(req.connection.remoteAddress)
  //   res.writeHead(200);
  //   res.end(data);
  // });
}

function insert_row(ip,drop){
  var tuple = {user_id: ip, message: drop}
  var query = connection.query("INSERT INTO droplet SET ?",tuple,function(err,result){
    if (err){
      console.log(err)
      return false;
    }
    console.log(result)   
  });
}

function get_all(ip,socket){
  // var sql    = 'SELECT * FROM droplet WHERE user_id = ' + connection.escape(ip);

  console.log(ip);
  var sql = "SELECT * FROM droplet WHERE user_id = " + mysql.escape(ip);

  connection.query(sql, function(err, results) {
    if(err){
      console.log("error getting rows for ip: "+ip);
      return;
    }
    
    socket.emit('news', { hello: results });

  });

}



io.sockets.on('connection', function (socket) {
 var address = socket.handshake.address;
 var ip =  address.address;
 
 
 socket.emit('base-channel', { hello: 'Connected.' });
 
 socket.on("handshake", function (data){

  CLIENT.push({client_name: data.client_id});
    
  io.sockets.emit("room-list",{list: CLIENT});

  console.log(CLIENT);

 });
 
 // socket.emit("room-list",{list: CLIENT});




 // socket.emit("list",{ip: ip});

 socket.on('transmit-channel', function (data) {
  console.log(data);
  // insert_row(ip,data.text);
  socket.broadcast.emit('base-channel', { jsn: data });
});

});
