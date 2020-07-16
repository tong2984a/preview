function addmarker() {
    console.log("making marker");
    var marker = new google.maps.Marker({
        position: {lat: currentLocation[0], lng: currentLocation[1]},
        map: map,
        draggable: true,
        title: 'here is me'
    });            
    var infowindow = new google.maps.InfoWindow({
        content: contentString
    });
    marker.addListener('click', function() {
        infowindow.open(map, marker);
    });
    marker.addListener('dragend', function() {
        var markcoords = this.getPosition();
        console.log('lat:' + markcoords.lat() + ' lng: ' + markcoords.lng());
    });
    marker.addListener('drag', function() {
        var markcoordsmove = this.getPosition();
        console.log('lat:' + markcoords.lat() + ' lng: ' + markcoords.lng());
    });
}

function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
};

var options = {
enableHighAccuracy: true,
timeout: 5000,
maximumAge: 0
};

function getCurrentLocation() {
    console.log("updating location");
    navigator.geolocation.getCurrentPosition(updateLocation, error, options);
    console.log("location get");
    return true;
}

function updateLocation(position) {
    currentLocation[0] = position.coords.latitude;
    currentLocation[1] = position.coords.longitude;   
    console.log("loaction updated");                        
    console.log("latitude : " + currentLocation[0] + '\n' + "longitude : " + currentLocation[1]);
    console.log(imgString);
    addmarker();
}