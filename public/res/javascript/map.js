var mymap = L.map('mapid').setView([44.017736, 1.354213], 13);

	L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
		maxZoom: 18,
		attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
			'<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
			'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
		id: 'mapbox.streets'
	}).addTo(mymap);

	var clusterLayer = L.markerClusterGroup();
		
	var popup = L.popup();	
		
	for (m in markers) {
		marker = L.marker([markers[m].lat, markers[m].lng], {
			id: markers[m].id
		})
		.addTo(clusterLayer)

		marker.bindPopup('<a href="http://www.airbnb.com/rooms/'+markers[m].id+'" target="blank">'+markers[m].id+"</a>");
		marker.on('click', function (e) {
			this.openPopup();
		});
	}	
		
	mymap.addLayer(clusterLayer);
	
	console.log(markers.length)
	

	function onMapClick(e) {
		
	}

	//mymap.on('click', onMapClick);