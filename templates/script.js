/*
*scripts.js
*
*Jordan Vartanian
*
*Global JavaScript
*
*
*/

$(document).ready(function()
{
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

	function date (response)
	{
		d=new Date(response);
		var day=d.getDate();
		var month=d.getMonth();
		console.log(d);
		var date=(month+1)+"/"+day;
		return date;
	};

	function time (response)
	{
		d=new Date(response);
		var hours= d.getHours();
		var minutes=d.getMinutes();
		var end='';
		if(hours>12)
		{
			var end="PM";
			var hours=hours-12;
		}

		else
		{
			var end="AM";
		}

		if(minutes < 10)
		{
			minutes = "0"+ minutes;
		}

			var time= hours +":" + minutes+ end;
		
		return time;
	};



	function eventApi(content,response)
	{
			var newContent='';
			var dates='';
			var times='';
			content.html(function()
			{
				for(var i=0; i<response.events.event.length; i++)
				{
					
					
					newContent+='<li class="clearfix">';
					newContent+= '<h5><a href='+$.trim(response.events.event[i].url)+">"
					+$.trim(response.events.event[i].title)+"</a></h5><br>";
					newContent+='<button type="button" id="myButton" class="btn btn-primary btn-lg" data-toggle="modal" data-target="#myModal">Get Weather</button>';

					if(response.events.event[i].image !== null)
					{
					newContent+= "<img src="+response.events.event[i].image.medium.url+'>';
					}
					newContent+='<div class="info">';						
					newContent+= date(response.events.event[i].start_time)+"<br>";
					newContent+= time(response.events.event[i].start_time)+"<br>";
					newContent+='</div';
					newContent+='</li>';	
				}
				return newContent;
				}).hide().fadeIn(400);


	  			$(".btn").on('click', function (e) {
	  			e.preventDefault();

		  		})
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
