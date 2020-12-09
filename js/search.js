var zoom = 11;

  var mymap = L.map('mapid', {zoom: zoom, worldCopyJump: true});
  L.tileLayer('https://b.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxNativeZoom: 18,
      maxZoom: 20,
      attribution: '&copy; <a target="_blank" rel="noopener" href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(mymap);

  var browserGeolocationSuccess = function(position) {
    console.log("*****browserGeolocationSuccess");
    currentLocation = [position.coords.latitude, position.coords.longitude];
    onLocationFound("You are here.");
  };

  var browserGeolocationFail = function(error) {
    onLocationFound("Refresh to find your location");
  }

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      browserGeolocationSuccess, browserGeolocationFail,
      {maximumAge: 70000, timeout: 4000, enableHighAccuracy: true});
  } else {
    onLocationFound("Cannot find your location");
  }

  function onMapClick(e) {
    var popup = L.popup();
      popup
          .setLatLng(e.latlng)
          .setContent("You clicked the map at " + e.latlng.toString())
          .openOn(mymap);
  }

    function onLocationFound(message) {
      mymap.setView(currentLocation, zoom);
      var radius = 1;
      circle = L.circle(currentLocation, {
          color: 'red',
          fillColor: '#f03',
          fillOpacity: 0.5,
          radius: 5
      }).addTo(mymap);
      let p = circle.bindPopup(message).openPopup();
      mymap.on('click', onMapClick);
    }

    const db = firebase.firestore();
    const storageRef = firebase.storage().ref();
    const storage = firebase.storage();
    initMap();

    //states
    var isGlutenShown = false;
    var isEggShown = false;
    var isDairyShown = false;
    var isTreenutShown = false;
    var isPeanutShown = false;
    var isSoyShown = false;
    var isRawShown = false;
    var isVeganShown = false;
    var isBuddhistFriendlyShown = false;
    var isAllNaturalShown = false;

    //marker list
    var markers = [];
    var showing = [];
    var newShowing = [];
    var selected = [];
    var selectedRegex = [];

    var isSideOpen = false;
    const BreakException = {};

    var map;
    var currentLocation = [22.276, 114.173];
    const mode = "search";

    function stopAnimation(marker) {
        setTimeout(function () {
            marker.setAnimation(null);
        }, 3000);
    }

    function hideAllMarkers() {
        markers.forEach(item => item.marker.setVisible(false));
    }

    function showAllMarkers() {
        markers.forEach(item => item.marker.setVisible(true));
    }

    function clearTag() {
        clearAll();
        isGlutenShown = false;
        isEggShown = false;
        isDairyShown = false;
        isTreenutShown = false;
        isPeanutShown = false;
        isSoyShown = false;
        isRawShown = false;
        isVeganShown = false;
        isBuddhistFriendlyShown = false;
        isAllNaturalShown = false;

        document.getElementById('gluten_free').style = '';
        document.getElementById('egg_free').style = '';
        document.getElementById('dairy_free').style = '';
        document.getElementById('treenut_free').style = '';
        document.getElementById('peanut_free').style = '';
        document.getElementById('soy_free').style = '';
        document.getElementById('raw').style = '';
        document.getElementById('vegan').style = '';
        document.getElementById('buddhist_friendly').style = '';
        document.getElementById('all_natural').style = '';
    }

    function initMap() {
      console.log("initializing from file");
      fetch('/data/sort-veggie.json').then(function(response) {
        return response.json();
      }).then(function(data) {
        itemsArray = data.map(item => {
          return { "name": item.SS, "dist": item.DIST, "adr": item.ADR, "lat": item.lat, "lng": item.lng }
        })
      });

      console.log('initializing map');
      db.collection('restaurants').get().then((snapshot) => {
        snapshot.docs.forEach(doc => {
          var restaurantData = doc.data();
          let dbAdr = restaurantData.adr;
          let dbName = restaurantData.name;
          if (dbAdr === "") {
            restaurantData.adr = dbName.substring(dbName.indexOf(",") + 1);
            restaurantData.name = dbName.substring(0, dbName.indexOf(","));
          }
          let marker = addRestMarker(restaurantData, doc.id);
          marker.addTo(mymap);
        });
      });
    }
