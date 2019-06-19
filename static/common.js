$(function(){

  $('.ui.form.signup')
  .form({
    fields: {
      name: {
        identifier: 'name',
        rules: [
        {
          type   : 'empty',
          prompt : 'Please enter your name'
        }
        ]
      },
      department: {
        identifier: 'department',
        rules: [
        {
          type   : 'empty',
          prompt : 'Please select a department'
        }
        ]
      },
      password: {
        identifier: 'password',
        rules: [
        {
          type   : 'empty',
          prompt : 'Please enter a password'
        }
        ]
      },
      terms: {
        identifier: 'terms',
        rules: [
        {
          type   : 'checked',
          prompt : 'You must agree to the terms and conditions'
        }
        ]
      }
    }
  })
;

});


function signin()
{

    $.ajax({
        method: 'POST',
        url : '/switchon/signin',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        dataType: 'json',
        data : {
            'filterTopics' : "topic 1",
            'searchQuery' : "query 2"
        }
    }).then(function (json){
        if(json.code == 555){
         
            
        }
    },function (json){
        //console.log(json);
    });

}