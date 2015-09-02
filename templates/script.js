/*
*scripts.js
*
*Jordan Vartanian
*
*Global JavaScript
*
*
*/

$(document).ready(function(){
	//Call eventful API and update categories
	(function() 
	{
		var $categories=$('#category');
		$.ajax({
			url:"http://api.eventful.com/json/categories/list?app_key=HB6LmHcST5f2KLkM",
			dataType: 'jsonp',		
			success:function(response) 
			{
				var newContent="";
				$categories.html(function()
					{
						for(var i=0; i<response.category.length; i++)
						{
							newContent+='<option value="'+response.category[i].id+'">'+response.category[i].name+'</option>';
						}
						return newContent;
					});	

			}
		});
	
	})(); 

	//Call eventful API and get event descriptions after form sumbit
	$("#query").submit(function (e){
		var location=$(this);
		e.preventDefault();
		var data = $(this).serialize();
		var url="http://api.eventful.com/json/events/search?app_key=HB6LmHcST5f2KLkM&";
		var url= url.concat(data);
		var content=$('#newevent');


	$.ajax({
		url:url,
		dataType: 'jsonp',		
		success:function(response) 
		{

			var newContent='';
			content.html(function()
				{
					for(var i=0; i<response.events.event.length; i++)
					{
						newContent+= $.trim(response.events.event[i].description);
					}
					return newContent;
				}).hide().fadeIn(400);	

		}

	});
	});


});
