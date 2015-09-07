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
		var year= d.getFullYear();
		var date=(month+1)+"/"+day+"/"+year;
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

	function weathertime (response)
	{
		d=new Date(response);
		var hours= d.getHours();
		return hours;

	};


	function eventApi(content,response)
	{
			//event api variables
			var newContent='';
			var dates=[];
			var times=[];
			newDates='';
			newTimes='';

			//weather api variables
			var dataWeather=$('form').serializeArray();
			var location=dataWeather[0].value;
			var urlw="http://api.openweathermap.org/data/2.5/forecast?units=imperial&q=";
			var urlw=urlw.concat(location);
			content.html(function()
			{
				//generate list of events
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
					newDates=date(response.events.event[i].start_time);
					newContent+= time(response.events.event[i].start_time)+"<br>";
					newTimes=response.events.event[i].start_time;
					dates.push({
						singer:response.events.event[i].title,
						days: newDates,
						time: newTimes
						});
					newContent+='</div';
					newContent+='</li>';	
				}
				return newContent;
			}).hide().fadeIn(400);
			
			//Click on weather button
  			$(".btn").on('click', function (event) {
  			var indexed=$(this).parent().index();
  			eventWeather=dates[indexed];

				$.ajax({
					url:urlw,
					dataType: 'jsonp',		
					success:function(response) 
					{
						$('.modal-header').html(function()
							{
								var headertext='';
								headertext+='<h4> Going to see '+eventWeather.singer+'?</h4>';
								headertext+='<h4>' +eventWeather.days+ '</h4>';
								return headertext;
							});
						$('.modal-body').html(function()
							{
								var newContentt='';
								newContentt+='<div class="row">';

								//store weather id number for advice row
								weatherType= [];

								for(var i=0; i<response.list.length; i++)
								{	
									//if returned weather json days = day of performance
									if(eventWeather.days===date(response.list[i].dt_txt+" UTC"))
									{
										var totaltime=eventWeather.time;
										totaltime=weathertime(totaltime);

										//give new class to weather happening during event to highlight later	
										if(totaltime <= (weathertime(response.list[i].dt_txt+ " UTC")))
											{
												newContentt+='<div class="selected">';
												newContentt+='<div class="col-xs-1"';
												newContentt+= '<p>'+time(response.list[i].dt_txt+ " UTC")+'<p>';
												newContentt+='<img src="http://openweathermap.org/img/w/'+response.list[i].weather[0].icon+'.png">';
												newContentt+= '<p>'+response.list[i].weather[0].main+'<p>';
												newContentt+= '<p>Temp: '+Math.round(response.list[i].main.temp)+'F<p>';
												newContentt+= '<p>RH: '+Math.round(response.list[i].main.humidity)+'%<p>';
												newContentt+= '<p>Wind: '+Math.round(response.list[i].wind.speed)+'mph<p>';
												newContentt+= '<p>'+response.list[i].weather[0].description+'<p>';
												newContentt+="</div>";
												newContentt+="</div>";
												weatherType.push(response.list[i].weather[0].id);
											}
										//else display rest of day weather	
										else
										{
												newContentt+='<div class="myModal">';
												newContentt+='<div class="col-xs-1"';
												newContentt+= '<p>'+time(response.list[i].dt_txt+ " UTC")+'<p>';
												newContentt+='<img src="http://openweathermap.org/img/w/'+response.list[i].weather[0].icon+'.png">';
												newContentt+= '<p>'+response.list[i].weather[0].main+'<p>';
												newContentt+= '<p>Temp: '+Math.round(response.list[i].main.temp)+'F<p>';
												newContentt+= '<p>RH: '+Math.round(response.list[i].main.humidity)+'%<p>';
												newContentt+= '<p>Wind: '+Math.round(response.list[i].wind.speed)+'mph<p>';
												newContentt+= '<p>'+response.list[i].weather[0].description+'<p>';
												newContentt+="</div>";
												newContentt+="</div>";
										}
									}	
								}

								newContentt+="</div>";
								return (newContentt);
							}).hide().fadeIn(400);

						//advice section		
						$('.modal-body2').html(function()
						{
							var smallest = Math.min.apply(Math, weatherType);
							var largest = Math.max.apply(Math, weatherType);
							var advice="";

							//if weather is severe	
							if(largest>=900 && largest<=906)
							{
								advice='<h4>Severe Weather forecasted.  Tune into local weather for more info</h4>';
							}

							else
							{
								switch (true) 
								{
							    case (smallest>=200 && smallest<=232):
							        advice = "<h4>Thunderstorms in the area.  Check for cancellations</h4>";
							        break;
							    case (smallest>=300 && smallest<=321):
							        advice = "<h4>Drizzle in the area. Bring an umbrella</h4>";
							        break;
							    case (smallest>=500 && smallest<=531):
							   		console.log(smallest);
							        advice = "<h4>Rain in the area. Check for cancellations if the event is outdoors</h4>";
							        break;
							    case (smallest>=600 && smallest<=622):
							        advice = "<h4>Snow in the area. Check for cancellations if the event is outdoors</h4>";
							        break;
							    case (smallest>=700 && smallest<=762):
							        advice = "<h4>Fog/dust in the area</h4>";
							        break;
							    case (smallest===800):
							        advice = "<h4>Clear Skies.  Enjoy</h4>";
							        break;
							    case (smallest===800 && smallest<=804):
							        advice = "<h4>Nothing much to report, just clouds.  Enjoy</h4>";
							        break;
							    default:
							    	advice= "";
								}
							}
							return advice;						
						}).hide().fadeIn(600);
					}
				});
	  		});
	};




	//Call eventful API and get event descriptions after form submit
	$("#query").submit(function (e)
	{
		e.preventDefault();
		var data = $(this).serialize();
		
		//event api url
		var urle="http://api.eventful.com/json/events/search?app_key=HB6LmHcST5f2KLkM&sort_order=popularity&page_number=1&";
		var urle= urle.concat(data);
		
		
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

	});
});
