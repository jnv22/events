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
	(function () 
	{
		var $categories=$('#category');
		$.ajax({
			url:"http://api.eventful.com/json/categories/list?app_key=HB6LmHcST5f2KLkM",
			dataType: 'jsonp',		
			success:function(response){
				var newContent="";
				$categories.html(function(){
						for(var i=0; i<response.category.length; i++)
						{
							newContent+='<option value="'+response.category[i].id+'">'+response.category[i].name+'</option>';
						}
						return newContent;
				});	
			}
		});	
		
 	validate();
    $('#location, #date').change(validate);

	})();
    

    function validate(){
    if ($('#location').val().length   >   0   &&
        $('#date').val().length  >   0) {
        $("input[type=submit]").prop("disabled", false);
    	$(':submit').html('');
    }
    else {
        $("input[type=submit]").prop("disabled", true);

    }
}

	function historyChange(urlnew){
		
		var content=$('#newevent');
        $.ajax({
			url:urlnew,
			dataType: 'jsonp',		
			success:function pageSubmit(response){
				//pull events		
				eventApi(content,response);
			},
			error:function(){
				content.html("<h2>Could not process request.  Please check spelling and try again</h2>");
			},
		});
	}	

	//history
	if (Modernizr.history)
	{
		$(window).on('popstate', function(event) {
		    totals=event.originalEvent.state;

		    if (window.history.state !== null)
		    {
			    var state=window.history.state.view;
			    var allpages=history.state.totalpage;
			    historyChange(state);

				if($('.pagination').data("twbs-pagination")){
			    $('.pagination').twbsPagination('destroy');
				}
				$('#pagination-demo').twbsPagination({
			                  visiblePages: 7,
			                  startPage:allpages,
			                  totalPages: pageSize,
						         onPageClick: function (event, page) {
					            $('#page-content').text('Page ' + page);
					            var newPage=state.replace("page_number="+allpages, "page_number="+page);
								historyChange(newPage,page);
								history.newState({view:newPage, totalpage:page}, "", "index.html?page="+page );
					        }
					    	});	
			}

			else 
			{
						
				if($('.pagination').data("twbs-pagination"))
				{
			    	$('.pagination').twbsPagination('destroy');
				}
				var $categories=$('#category');
				$("#newevent").empty();
				
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
			}

		});
	}


	//pagination setup
	$(function() {
		var years=new Date().getFullYear();
		var months=new Date().getMonth();
		var days=new Date().getDate();
	    $("#date").datepicker({
	    	 currentText:"Now",
	    	 dateFormat: "yy-mm-dd",
			 minDate: new Date(years, months, days),
			 maxDate: "+5d"
		});
  });

	
	function date (response)
	{
		d=new Date(response);
		return d.toDateString();
	}

	function time (response)
	{
		d=new Date(response);
		return d.toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'});
	}

	function weathertime (response)
	{
		d=new Date(response);
		return d.getHours();
	}


	function eventApi(content,response)
	{
		//event api variables
		var newContent='';
		var dates=[];
		var newDates='';
		var newTimes='';

		//weather api variables
		var dataWeather=$('form').serializeArray();
		var location=dataWeather[0].value;
		var urlw="http://api.openweathermap.org/data/2.5/forecast?units=imperial&q="+location;
		if(response.events=== null)
		{	
			content.html("<h4>Sorry, No results found</h4>");
		}
		else
		{
		content.html(function()
		{

			
			//generate list of events if search returns 1 result
			if(response.total_items==1)
			{
				//reformatting JSON date for major browser support	
				newDates=response.events.event.start_time;
				newDates=newDates.replace(/-/g,'/');

				//setup main content
				newContent+='<li class="clearfix">';
				newContent+= '<h5><a href='+$.trim(response.events.event.url)+">"+$.trim(response.events.event.title)+"</a></h5><br>";
				newContent+='<button type="button" id="myButton" class="btn btn-primary btn-lg" data-toggle="modal" data-target="#myModal">Get Weather</button>';
				
				//if image found
				if (response.events.event.image !== null)
				{
					newContent+= "<img src="+response.events.event.image.medium.url+'>';
				}

				else 
				{
					newContent+= '<img src="templates/notfound.jpg" height="128" width="128">';
				}
				newContent+='<div class="info">';
				newContent+= "<p>"+date(newDates)+"</p>";

				if(weathertime(response.events.event.start_time) !== 0)
				{	
				newContent+= "<p>"+time(newDates)+"</p>";

				}
				
				newDates=date(newDates);
				
				newTimes=response.events.event.start_time;

				//object for weather search 
				dates.push({
					singer:response.events.event.title,
					days: newDates,
					time: newTimes
					});
				newContent+='</div';
				newContent+='</li>';	
			}

			else				
			{

				//generate list of events if search returns >1 result
				for(var i=0; i<response.events.event.length; i++)
				{		
					//reformatting JSON date for major browser support	
					newDates=response.events.event[i].start_time;
					newDates=newDates.replace(/-/g,'/');
				
					//setup main content
					newContent+='<li class="clearfix">';
					newContent+= '<h5><a href='+$.trim(response.events.event[i].url)+">"+$.trim(response.events.event[i].title)+"</a></h5><br>";
					newContent+='<button type="button" id="myButton" class="btn btn-primary btn-lg" data-toggle="modal" data-target="#myModal">Get Weather</button>';

					//if image found
					if(response.events.event[i].image !== null)
					{
						newContent+= "<img src="+response.events.event[i].image.medium.url+'>';
					}

					else 
					{
						newContent+= '<img src="templates/notfound.jpg" height="128" width="128">';
					}
					newContent+='<div class="info">';
					newContent+= "<p>"+date(newDates)+"</p>";

					if(weathertime(response.events.event[i].start_time) !== 0)
					{	
						newContent+= "<p>"+time(newDates)+"</p>";
					}
					
					newDates=date(newDates);

					newTimes=response.events.event[i].start_time;
					
					//object for weather search 
					dates.push({
						singer:response.events.event[i].title,
						days: newDates,
						time: newTimes
						});
					newContent+='</div';
					newContent+='</li>';							
				}
			}
			return newContent;
		}).hide().fadeIn(400);
		
		$('.clearfix a').click(function(){
		urlLocation=$(this).attr("href");
 		 window.open(urlLocation, 'window name', 'window settings');
  		return false;
		});
		}
			

		//Click on weather button and setup weather page
			$(".btn").on('click', function () {
			var indexed=$(this).parent().index();
			var eventWeather=dates[indexed];

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

					//weather advice section		
					$('.modal-body2').html(function()
					{
						var smallest = Math.min.apply(Math, weatherType);
						var largest = Math.max.apply(Math, weatherType);
						var advice="";

						//if weather is severe	
						if(largest>=900 && largest<=906)
						{
							advice='<h4>Severe Weather forecasted.  Tune to local weather for more info</h4>';
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
						    case (smallest>800 && smallest<=804):
						        advice = "<h4>Nothing much, just clouds.  Enjoy</h4>";
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
	}

//Call eventful API and get event descriptions after form submit
	$("#query").submit(function (e)
	{
		$("#newevent").empty();
		e.preventDefault();
		var data2 = $(this).serializeArray();
		var future=data2[1].value;

		//format date for event api
		future=future.replace(/-/g,'');
		future+="00";
		var myDates=future+"-"+future;
		var page=1;
		var data="location="+data2[0].value+"&"+"date="+myDates+"&"+"category="+data2[2].value;
		//event api url
		var urle="http://api.eventful.com/json/events/search?app_key=HB6LmHcST5f2KLkM&sort_order=popularity&page_number=1&"+data;
		var content=$('#newevent');

		$.ajax({
			url:urle,
			dataType: 'jsonp',		
			success:function(response) 
			{
				//pull events		
				eventApi(content,response);
				history.pushState({view:urle, totalpage:page}, "", "index.html?page=1" );


				//pagination setup
				pageSize=response.page_count;
				//if user reloads page, delete contents of pagination
				if($('.pagination').data("twbs-pagination")){
                    $('.pagination').twbsPagination('destroy');
                }

			    $('#pagination-demo').twbsPagination({
                  totalPages: pageSize,
                  visiblePages: 7,
			        onPageClick: function (event, page) {
			            $('#page-content').text('Page ' + page);
			            var urlnew="http://api.eventful.com/json/events/search?app_key=HB6LmHcST5f2KLkM&sort_order=popularity&page_number="+page+"&"+data;
						historyChange(urlnew);
						history.pushState({view:urlnew, totalpage:page}, "", "index.html?page="+page );

			        }
		    	});	
			},


			error:function()
			{
				content.html("<h2>Could not process request.  Please check spelling and try again</h2>");
			}
			

		});

	});
});
