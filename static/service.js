$(function(){
	var socket = io();
	//var myVar = setInterval(myTimer, 1000);

	// function myTimer() {
	// 	socket.emit('chat message', 'Hello');
	// }

	socket.on('new request', function(data){

		if(data.toDept == $('#userData').attr('did') ){

			$('#messages').prepend(
				'<div id="request-'+data.id+'" class="message-box"><span class="msg-name1">'+data.fromUser+'</span> from <span class="dept-name1">'+data.fromDeptName+'</span> requested to <span class="msg-name2">'+data.toUser+'</span> from <span class="dept-name2">'+data.toDeptName+'</span><div class="msg-text">'+data.message+'</div></div>'
				);
			
			if($('#userData').attr('uid') == data.toUid && $('#userData').attr('pageuri') == 'confirm'){
				$('#request-'+data.id).append('<button class="ui positive button action-btn" onclick="accept_request();">Accept</button><button class="ui negative button action-btn" onclick="reject_request();">Reject</button>');
			}

		}

    });

});

