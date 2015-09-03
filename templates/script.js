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
			url:"http://api.eventful.com/json/categories/list?app_key=XXXXXX",
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

	function eventApi(content,response)
	{
			var newContent='';
				content.html(function()
					{
						for(var i=0; i<response.events.event.length; i++)
						{
							newContent+= "<p>"+$.trim(response.events.event[i].title)+"</p>";
							if(response.events.event[i].image !== null)
							{
							newContent+= "<img src="+response.events.event[i].image.medium.url+">";
							}
						}
						return newContent;
					}).hide().fadeIn(400);
	};




	//Call eventful API and get event descriptions after form sumbit
	$("#query").submit(function (e)
	{
		e.preventDefault();
		var data = $(this).serialize();
		var dataWeather=$('form').serializeArray();
		
		//event api url
		var urle="http://api.eventful.com/json/events/search?app_key=HB6LmHcST5f2KLkM&sort_order=popularity&page_number=1&";
		var urle= urle.concat(data);
		
		//weather api url
		var location=dataWeather[0].value;
		var urlw="http://api.openweathermap.org/data/2.5/forecast?units=imperial&q=";
		var urlw=urlw.concat(location);
		var content=$('#newevent');
		
		$.ajax({
			url:urle,
			dataType: 'jsonp',		
			success:function(response) 
			{

				

				//pull events		
				eventApi(content,response);


				//pagination setup
				var pageSize=response.page_count;
				console.log(pageSize);
				console.log(urle);

				//if user reloads page, delete contents of pagination
				if($('.pagination').data("twbs-pagination")){
                    $('.pagination').twbsPagination('destroy');
                }

			    $('#pagination-demo').twbsPagination({
                  totalPages: pageSize,
                  visiblePages: 7,
			        onPageClick: function (event, page) {
			            $('#page-content').text('Page ' + page);
			            var pages=page;
			            console.log(pages);
			            var urlnew="http://api.eventful.com/json/events/search?app_key=HB6LmHcST5f2KLkM&&sort_order=popularity&page_number="+pages+"&";
						var urlnew= urlnew.concat(data);
			            $.ajax({
							url:urlnew,
							dataType: 'jsonp',		
							success:function(response) 
							{

								//pull events		
								eventApi(content,response);

							}

					});
			        }
		    	});	
			}
		});

		//pull weather data
		$.ajax({
		url:urlw,
		dataType: 'jsonp',		
		success:function(response) 
		{

			var newContent= '';
			$('#forecast').html(function()
				{
					var newContentt=[];
					for(var i=0; i<response.list.length; i++)
					{								
					var dates='';
						dates+= $.trim(response.list[i].dt);
						var dates= new Date(1000*dates);
						var dates=dates.toLocaleString();
						newContentt.push(dates);
						newContent+= $.trim(response.list[i].main.temp)+"     ";
					}
					return (newContentt);
				}).hide().fadeIn(400);	
		}

		});
	});
});
