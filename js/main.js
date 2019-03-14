var page = 1;
var last_filter = "";
var next_page = true;
var total_results = null;
var imgs_inserted = 0;

function addListeners() {
	$("#search-query").keyup(checkInput);
	$(document).scroll(checkScroll);
}

function checkInput(event_data){
	if (event_data.keyCode == 13) {
		clearFilms();
		page = 1;
		imgs_inserted = 0;
		last_filter = $("#search-query").val();
		getFilms(last_filter, page);
	}
}

function getFilms(filter=last_filter, page=page) {
	$.getJSON("https://www.omdbapi.com/?s="+filter+"&page="+page, function(data){
		next_page = true;
		if (data.Response == "False") {
			insertError(data);
		} else {
			$(".search-result-text").css("display", "block");
			total_results = parseInt(data.totalResults);
			$.each(data["Search"], function(index, film) {
				insertFilm(film.Title, film.Poster, film.Year, film.imdbID);
			});
		}
	});
}

function checkScroll() {
	if($(document).innerHeight() - $(document).scrollTop() <= $(window).height() + 20 && next_page && imgs_inserted < total_results) {
        console.log(page);
        next_page = false;
        page++;
        getFilms(last_filter, page);
    }
}

function clearFilms() {
	if ($("#search-result").html().length > 0) {
		$("#search-result").html("");		
	}
}

function insertFilm(title, img, year, imdb) {
	if (img == "N/A") {
		img = "img/nocoverart.jpg";
	}

	$("#search-result").append("<div class='col-lg-3 col-md-4 col-sm-6 col-xs-12 film'>\
		<a href='http://www.imdb.com/title/"+imdb+"' target='_blank'><span class='film-poster' style='background-image: url("+img+");'></span></a>\
		<span class='film-title'>"+title+"</span>\
		<span class='film-year'><small>"+year+"</small></span>\
		</div>");

	$("#search-result .film:last").animate({
		opacity: 1,
		top: 0
	}, 800);

	imgs_inserted += 1;
}

function insertError(data) {
	$(".search-result-text").css("display", "none");
	$("#search-result").append("<h1 class='error'>"+data.Error+"</h1>");
}

$(document).ready(function(){
	addListeners();
})
