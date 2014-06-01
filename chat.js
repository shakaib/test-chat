function clean_list(){
		 var selctor = localStorage.getItem("id");
		 $("."+selctor).remove();
		}


function check_if_container_exist(id){
	if ($("#container-"+id).length > 0)
		return true;
	return false;
}

function make_container(id){
	// $(".main-container").append("<div class = 'contianer-client' style = 'display:none;' id = 'container-"+id+"'></div>");
	$(".main-container").append("<ul class='contianer-client chat' style = 'display:none;'  id = 'container-"+id+"' ></ul>");
}

function parase_message_add_to_id(data,me){
	// $("#container-"+data.from).append("<p>"+data.msg+"</p>");
	if(me){
		$("#container-"+data.from).append("<li class='left clearfix' ><span class='chat-img pull-right'><img class='img-circle' alt='User Avatar' src='ME.gif'></span><div class='chat-body clearfix'><p>"+data.msg+"</p></div></li>");
		}
	else{
		$("#container-"+data.from).append("<li class='left clearfix' ><span class='chat-img pull-left'><img class='img-circle' alt='User Avatar' src='U.gif'></span><div class='chat-body clearfix'><p>"+data.msg+"</p></div></li>");
	}
}
function append_to_container(data){
	if (! check_if_container_exist(data.from)){
	 	make_container(data.from)
	}
	parase_message_add_to_id(data)
}

function put_notification(data){
	if (! $("#list-item-client-"+data.from).hasClass("active")){
		// put notification
		$("#list-item-client-"+data.from).addClass("circle");
		$("#list-buddies").addClass("circle");
	}

	append_to_container(data)
}
function show_hide_containers(id){
	$(".contianer-client").hide();
	$("#container-"+id).show();
}

var id = Math.floor((Math.random() * 100000) + 1);

id = id + Math.floor((Math.random() * 10000) + 1); 

var name = "shakaib";

var socket = io.connect('192.168.0.102:3000/');

socket.emit("handshake", {client_id : id});

socket.on('base-channel', function (data) {
	if (data.jsn && data.jsn.to !== undefined){
		if (data.jsn.to == id){
			put_notification(data.jsn)
		}
	}
	// else if (typeof data.hello != "string"){
	// 	var arr = data.hello;
	// 	for (var i = 0; i < arr.length; i++) {
	// 		$("#container").append("<p class = 'bg-warning'>"+arr[i].message+"</p>");
	// 	};
	// }
	else if (data.hello === "Connected."){
			 $("#connection").append("<p class = 'bg-info'>"+data.hello+"</p>");	
	}
	else{
				 $("#container").append("<p class = 'bg-success'>"+data.hello+"</p>");
	}
});

socket.on("room-list",function (data){
	var html = "";
	for (var i = 0; i < data.list.length; i++) {
		if (data.list[i].client_name != id){
		html += "<a href='javascript:void(0);' id = 'list-item-client-"+data.list[i].client_name+"' class='list-group-item clientid-"+data.list[i].client_name+"'>"+data.list[i].client_name+"</a>";}
	}
	$(".list-group").html(html);

});
	

$(document).ready(function(){

			
	$("#send").click(function(){

		if ($(".list-group-item").hasClass("active")){
			var stranger_id = $(".list-group").find(".active").attr("id");
			var to_client = stranger_id;
			to_client = to_client.split("-");
			var to_client = to_client[3];
			var msg = $("#name").val();

			socket.emit("transmit-channel", {from : id, msg : msg, to: to_client});
			parase_message_add_to_id({from : to_client, msg : msg},true);
		
			$("#name").val("");
			
		}else{
			
			alert("select someone");
		}

	});


$(document.body).on('click', '.list-group-item', function(event) {
	$(".list-group-item").removeClass("active");
	$(".list-group-item").removeClass("circle");
	$(this).addClass("active");
	var orignal_id = $(this).attr("id");
	var id = orignal_id;
	id = id.split("-");
	id = id[3];
	if (! check_if_container_exist(id)){
	 	make_container(id)
	}
	show_hide_containers(id);

});

});