$(function(){

	load_dept();

});

	function load_dept()
{

    $.ajax({
        method: 'GET',
        url : '/switchon/dept',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        dataType: 'json',
        data : {}
    }).then(function (json){
        
        if(json.code === 555){
        	for (var i = 0 ; i < json.data.length ; i++){
        		if($('#userData').attr('did') == json.data[i].id){
        			continue;
        		}
        		$(".select-department").append('<option value="'+ json.data[i].id +'">'+ json.data[i].name +'</option>');
        	}
        }

    },function (json){
        //console.log(json);
    });

}

function load_user(){
	$(".select-user").html('<option value="">Select User</option>');
	var selected_dept = $(".select-department").val();

	if(selected_dept.trim() != ""){

		$.ajax({
			method: 'GET',
			url : '/switchon/user',
			headers: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			dataType: 'json',
			data : {
				id: selected_dept
			}
		}).then(function (json){

			if(json.code === 555){
				for (var i = 0 ; i < json.data.length ; i++){
					$(".select-user").append('<option value="'+ json.data[i].id +'">'+ json.data[i].name + ' (' + json.data[i].email + ')' + '</option>');
				}
			}

		},function (json){
        //console.log(json);
    });
	}
}

function create_request(){
	$('.ui.error.message').attr('style', 'display: none;');

	if(validate()){
		var uid = $(".select-user").val();
		var did = $(".select-department").val();
		var message = $("#message").val();
		var my_uid = $('#userData').attr('uid');
		var my_did = $('#userData').attr('did');

		var uname = $(".select-user option:selected").html();
		var dname = $(".select-department option:selected").html();

		var data = {uid: uid, did: did, my_uid: my_uid, my_did: my_did, message: message, uname: uname, dname: dname} ;
		$('.create-btn').addClass('loading disabled');

		$.ajax({
			method: 'POST',
			url : '/switchon/request',
			headers: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			dataType: 'json',
			data : data
		}).then(function (json){

			if(json.code === 555){
				$('.request-from')[0].reset();
				$('.ui.error.message').html('Request Created Successfully!');
				$('.ui.error.message').attr('style', 'display: block;');
			}
			$('.create-btn').removeClass('loading disabled');

		},function (json){
        //console.log(json);
        $('.create-btn').removeClass('loading disabled');
    });

	}
}

function validate(){
	if($(".select-department").val().trim() == ''){

		$('.ui.error.message').html('Please select department');
		$('.ui.error.message').attr('style', 'display: block;');
		return false;
	}
	if($(".select-user").val().trim() == ''){

		$('.ui.error.message').html('Please select user');
		$('.ui.error.message').attr('style', 'display: block;');
		return false;
	}
	return true;
}