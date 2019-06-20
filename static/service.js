$(function(){
	var socket = io();

	socket.on('new request', function(data){

		if($('#userData').attr('pageuri') == 'pending' || $('#userData').attr('pageuri') == 'confirm'){


			if(data.toDept == $('#userData').attr('did') ){

				$('#messages').prepend(
					'<div id="request-'+data.id+'" class="message-box"><span class="msg-name1">'+data.fromUser+'</span> from <span class="dept-name1">'+data.fromDeptName+'</span> requested to <span class="msg-name2">'+data.toUser+'</span> from <span class="dept-name2">'+data.toDeptName+'</span><div class="msg-text">'+data.message+'</div></div>'
					);

				if($('#userData').attr('uid') == data.toUid && $('#userData').attr('pageuri') == 'confirm'){
					$('#request-'+data.id).append('<button class="ui positive button action-btn" onclick="accept_request(this);">Accept</button><button class="ui negative button action-btn" onclick="reject_request(this);">Reject</button>');
				}

			}

		}

    });

    socket.on('approved request', function(data){

		if($('#userData').attr('pageuri') == 'approved' ){

			if(data.toDept == $('#userData').attr('did') ){

				$('#messages').prepend(
					'<div id="request-'+data.id+'" class="message-box"><span class="msg-name1">'+data.fromUser+'</span> from <span class="dept-name1">'+data.fromDeptName+'</span> requested to <span class="msg-name2">'+data.toUser+'</span> from <span class="dept-name2">'+data.toDeptName+'</span><div class="msg-text">'+data.message+'</div></div>'
				);

			}
		}

		if($('#userData').attr('pageuri') == 'pending' || $('#userData').attr('pageuri') == 'confirm' ){

			if(data.toDept == $('#userData').attr('did') ){
				$('#request-'+data.id).remove();
			}
		}

    });

    socket.on('rejected request', function(data){

		if($('#userData').attr('pageuri') == 'rejected' ){

			if(data.toDept == $('#userData').attr('did') ){

				$('#messages').prepend(
					'<div id="request-'+data.id+'" class="message-box"><span class="msg-name1">'+data.fromUser+'</span> from <span class="dept-name1">'+data.fromDeptName+'</span> requested to <span class="msg-name2">'+data.toUser+'</span> from <span class="dept-name2">'+data.toDeptName+'</span><div class="msg-text">'+data.message+'</div></div>'
				);

			}
		}

		if($('#userData').attr('pageuri') == 'pending' || $('#userData').attr('pageuri') == 'confirm' ){

			if(data.toDept == $('#userData').attr('did') ){
				$('#request-'+data.id).remove();
			}
		}
    });

});

function accept_request(ref){
	var request_id = $(ref).parents('.message-box').attr('id');
	request_id = request_id.replace('request-', '');
	
	$.ajax({
			method: 'GET',
			url : '/switchon/accept',
			headers: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			dataType: 'json',
			data : {
				id: request_id
			}
		}).then(function (json){

			if(json.code === 555){
				
			}

		},function (json){
        //console.log(json);
    });

}

function reject_request(ref){
	var request_id = $(ref).parents('.message-box').attr('id');
	request_id = request_id.replace('request-', '');
	
	$.ajax({
			method: 'GET',
			url : '/switchon/reject',
			headers: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			dataType: 'json',
			data : {
				id: request_id
			}
		}).then(function (json){

			if(json.code === 555){
				
			}

		},function (json){
        //console.log(json);
    });

}

