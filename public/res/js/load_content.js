
var date = ""

function loadDoc(date) {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
	  if (this.readyState == 4 && this.status == 200) {
		  var response = JSON.parse(this.responseText)
		  $("#content_loader").append(response.html);
		date = response.date
	  }
	};
	xhttp.open("GET", "/cdn/feed?from="+date, true);
	xhttp.send();
  }

  $(window).scroll(function() {
	if($(window).scrollTop() + $(window).height() == $(document).height()) {
		loadDoc(date)
		$("#content_loader").append(response.html);
	}
 });

  //2020-04-28T00:00:00