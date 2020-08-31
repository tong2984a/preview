var isSideOpen = false;
var selected = [];
var filterNumber = 0;
var blueIcon = {url: 'http://maps.google.com/mapfiles/ms/micons/blue-dot.png', scaledSize: new google.maps.Size(45, 45)};
var greenIcon = {url: 'http://maps.gstatic.com/mapfiles/markers2/marker_greenV.png', scaledSize: new google.maps.Size(30, 45)};
var yellowIcon = {url: 'http://maps.google.com/mapfiles/ms/micons/yellow-dot.png', scaledSize: new google.maps.Size(45, 45)}; 
var couponIcon = {url: "https://img.icons8.com/material-rounded/48/000000/location-marker.png"}
var couponIcon2 = {url: "https://img.icons8.com/fluent/48/000000/map.png", scaledSize: new google.maps.Size(40, 40)}
const areas = [
  //kowloon
  {name: "kwuntong", center: [22.311705, 114.223108], radius: 750},
  {name: "ngautaukok", center: [22.320684, 114.218625], radius: 850},
  {name: "lamtin", center: [22.308872, 114.237096], radius: 700},
  {name: "yautong", center: [22.296846, 114.236544], radius: 700},
  {name: "choihung", center: [22.33493079072518, 114.21162537422178], radius: 700},
  {name: "kowloonbay", center: [22.32532408641564, 114.2086213001251], radius: 750},
  {name: "kowlooncity", center: [22.331085211130553, 114.18831697788237], radius: 700},

  //hong kong island
  {name: "wanchai", center: [22.2787032129389, 114.17361067583006], radius: 700},
  //new territories
];
var current;
var restaurantInput = document.getElementById('restaurantInput');


class Restaurant {
  constructor(marker, name, location, id, dishes) {
      this.marker = marker;
      this.name = name;
      this.location = location;
      this.id = id;
      var dishList = [];
      dishes.forEach(value => {
        dishList.push(new Dish(value.dish, value.fileURL, value.tags));
      })
      this.dishes = dishList;
  }

  getName() {
      return this.name;
  }

  getMarker() {
      return this.marker;
  }

  getLocation() {
      return this.location;
  }

  getDishes() {
      return this.dishes;
  }

  getRestaurantId() {
    return this.id;
  }

  //show the the restaurant details in the side bar
  showDetails() {
    document.getElementById("restName").innerText = this.name;
    document.getElementById("restLocation").innerText = this.location;
    var dishSection = document.createElement("div")
    dishSection.id = "dishSection";
    document.getElementById("slideContainer").appendChild(dishSection);
    this.dishes.forEach(element => {
      element.showDish("dishSection");
    })
  }

  //show or hide the resaturant by screening all the dishes, show the dishes match all the sectleted tags, if no dishes match, hide the marker
  filterDishes(filterTags, tagsNum) {   
    var dishMatch = 0;
    this.dishes.forEach(element => {
        var check = 0;
        filterTags.forEach(value => {
            if(element.hasTag(value)){
                check++;
            }
        })
        if(check == tagsNum){
          dishMatch++;
          element.setShow(true);
        }else{
          element.setShow(false);
        }
    });
    if(dishMatch){
      this.marker.setVisible(true);
    }else{
      this.marker.setVisible(false);
    }
  }
}

class Dish {
  constructor(name, image, tags) {
    this.name = name;
    this.image = image;
    this.tags = tags;
    var string = '';
    tags.forEach((tags) => {
        if(tags.value == true){
            string += '#' + tags.name + '  ';
        };
    });
    this.tagString = string;
    this.show = true;
  }

  //show the dish details in the side bar
  showDish(nodeId) {
    if(this.show){
      var name = document.createElement("h5");
      name.innerText = this.name;
      document.getElementById(nodeId).appendChild(name)
      var photo = document.createElement("img");
      photo.src = this.image;
      photo.style.width = '150px' 
      document.getElementById(nodeId).appendChild(photo);                
      var tag = document.createElement('h6');
      tag.innerText = this.tagString;
      document.getElementById(nodeId).appendChild(tag);     
    }
  }

  setShow(boolean) {
    this.show = boolean;
  }

  hasTag(id) {
    return this.tags[id].value;
  }
}

class CurrentMarker {
  constructor(map){
    this.location = [22.3, 114.15];
    console.log("making Current marker");
    this.marker = new google.maps.Marker({
        position: {lat: 22.3, lng: 114.15},
        map: map,
        draggable: true,
        title: 'here is me',
        icon: {url: 'https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi.png', scaledSize: new google.maps.Size(20, 35)},
        zIndex: 1000
    });            
    this.marker.addListener('dragend', function() {
        var markcoords = this.getPosition();
        this.location = [markcoords.lat(), markcoords.lng()];
        locationInput.value = markcoords;
        map.setCenter(markcoords);
        //the function below need to pay.
        //getLocationAddress(markcoords);
    });
  }

  getLocation() {
    return this.location;
  }

  //set the location of the marker
  setLocation(lat, lng) {
    this.location = [lat, lng];
    this.marker.setPosition({lat, lng});
  }

  lat() {
    return this.location[0];
  }

  lng() {
    return this.location[1];
  }
}

//show the side bar
function toggleSidebar() {
    document.getElementById("sidebar-wrapper").classList.toggle('open');
    isSideOpen = !isSideOpen;
    console.log('ckicked')
}

//check weather the restaurant inside the searching area
function isInArea(position, center, radius) {
    var distance;
    if ((position.lat() == center.lat()) && (position.lng() == center.lng())) {
        distance = 0;
    } else {
        console.log(position.lat(), position.lng());
        console.log(center.lat(), center.lng())
        console.log(center);
        distance = google.maps.geometry.spherical.computeDistanceBetween(position, center);
        console.log(distance);
    }
    return(distance < radius);
}

//stop the bouncing animation after searched
function stopAnimation(marker) {
    setTimeout(function () {
        marker.setAnimation(null);
    }, 3000);
}

//the restaurant searching function that search all the restaurant in the database
function searchRestaurantDemo(input, mode, selected = []) {
    var count = 0; 
    var str = input.toLowerCase().replace(/\s/g,'');          
    var search =  new RegExp(str);            
    var areaCenter;
    var areaRadius;
    var checkArea = false;      
    var isFilter = (selected)?true:false ;
    areas.some((value) => {
        var pattern = new RegExp(value.name);                        
        if(pattern.test(str)){
          areaCenter = new google.maps.LatLng(value.center[0], value.center[1]);
          areaRadius = value.radius;
          checkArea = true;
          str = str.replace(value.name,'');
          search =  new RegExp(str);   
          return true;
        }
    })
    markers.filter(value => value.marker.getVisible() == true).forEach(item => {
        if(search.test(item.name.toLowerCase())){
            count++;                        
            item.marker.setAnimation(google.maps.Animation.BOUNCE); 
            stopAnimation(item.marker);     
            item.marker.setIcon(blueIcon);
            map.setCenter(item.marker.position);
            item.marker.setVisible(true);
            showing.push(item);
        }else{
            item.marker.setVisible(false);
            item.marker.setIcon(greenIcon);
        }
        if(item.marker.getVisible()){
          if(mode === "add"){
          currentLocation[0] = item.marker.position.lat();
          currentLocation[1] = item.marker.position.lng();
          current.setPosition(item.marker.position);
          }
          restaurantInput.value = item.name;
        }
    })
    if(checkArea){
      console.log("checking area")
        markers.forEach(item => {
          if(item.marker.getVisible()){
            if(isInArea(item.marker.position, areaCenter, areaRadius)){
              if(!item.marker.getVisible())count++;                        
                item.marker.setAnimation(google.maps.Animation.BOUNCE); 
                stopAnimation(item.marker);     
                item.marker.setIcon(blueIcon);
                map.setCenter(item.marker.position);
                item.marker.setVisible(true);
            }else{
                if(item.marker.getVisible())count--;  
                item.marker.setVisible(false);
                item.marker.setIcon(greenIcon);
            }
            if(item.marker.getVisible()){
              if(mode === "add"){
                currentLocation[0] = item.marker.position.lat();
                currentLocation[1] = item.marker.position.lng();
                current.setPosition(item.marker.position);
                }
              restaurantInput.value = item.name;
            }
          }
        })
    }
    if(mode === "search"){}
    if(isFilter){
      document.getElementById('restSearch').innerText = count + ' restaurant found under the filter requirment(s)';
    }else{
      document.getElementById('restSearch').innerText = count + ' restaurant found';  
    }
    if(count > 0){
        document.getElementById('restSearch').style.color = 'rgb(0,255,0)'
    }else{
        document.getElementById('restSearch').style.color = 'rgb(255,0,0)'
        markers.forEach(item => item.marker.setVisible(true));
    };
}

//add the marker on a restaurant and create a Restaurant object
function addRestMarker(restaurant) {
  let lat = restaurant.location[0];
  let lng =  restaurant.location[1];
  var marker = new google.maps.Marker({
    position: {lat, lng},
    map: map,
    icon: greenIcon,
    animation: google.maps.Animation.DROP
  });  
  console.log(restaurant.coupon);
  if(restaurant.coupon > 0){
    var label = {text: restaurant.coupon.toString(), fontSize: "20px", fontWeight: "bold"}
    marker.setIcon(couponIcon2);
    marker.setLabel(label);
  }
  var restaurantObj = new Restaurant(marker, restaurant.name, restaurant.location, restaurant.id, restaurant.dishes);     
  marker.addListener('click', function() {
    if(!isSideOpen){
        document.getElementById("sidebar-wrapper").classList.toggle('open');
        isSideOpen = !isSideOpen;
        console.log('ckicked')
    } 
    $('#dishSection').remove();
    restaurantObj.showDetails();
    this.setAnimation(google.maps.Animation.BOUNCE); 
    stopAnimation(this); 
    if(mode === "add"){
      current.setPosition({lat, lng});
      currentLocation = [restaurant.location[0], restaurant.location[1]]
      locationInput.value = restaurant.location;
      currentRestaurantId = restaurant.id;
      restaurantInput.value = restaurantObj.getName();
    }    
    map.setCenter({lat, lng});
  });   
  markers.push(restaurantObj);         
}

function showDishes(name, location, dishes) {
  $('#dishSection').remove();
  document.getElementById('restName').innerText = name;
  document.getElementById('restLocation').innerText = location;
  var dishSection = document.createElement("div")
  dishSection.id = "dishSection";
  document.getElementById("slideContainer").appendChild(dishSection);
  dishes.forEach((dishes) => {                        
    var name = document.createElement("h5");
    name.innerText = "Dish: " + dishes.dish;
    document.getElementById('dishSection').appendChild(name)
    var photo = document.createElement("img");
    photo.src = dishes.fileURL;
    photo.style.width = '150px' 
    document.getElementById('dishSection').appendChild(photo);                
    var tags = dishes.tags;
    var tagString = 'Tags: ';
    var makeTagString = tags.forEach((tags) => {
        if(tags.value == true){
            tagString += '#' + tags.name + '  ';
        };
    });
    var tag = document.createElement('h6');
    tag.innerText = tagString;
    document.getElementById('dishSection').appendChild(tag); 
  }) 
}
  
//Ricardo: get the location of the restaurant
function addMarker(restaurant, iconUse) { 
    var img = "<img src='" + restaurant.fileURL + "' style='width: 125px;'>";
    var tags = restaurant.tags;
    var tagString = '';
    let name = restaurant.restaurant;
    var makeTagString = tags.forEach((tags) => {
      if(tags.value == true){
        tagString += '#' + tags.name + '  ';
      };
    });
    var marker = new google.maps.Marker({
        position: {lat: restaurant.location[0], lng: restaurant.location[1]},
        map: map,
        icon: iconUse,
    });           

    marker.addListener('click', function() {
      var infowindow = new google.maps.InfoWindow({
        content:'<div><h6> Restaurant: ' +
                name +
                '</h6><h6> Dish: ' +
                restaurant.dish +
                '<h6></div>' +
                '<div>' +
                img +
                '</div>' +
                '<div style="width: 150px;overflow: auto;"><h6>Tags : ' +
                tagString +
                '<h6></div>'
      });
      infowindow.open(map, marker);
      map.setCenter(this.position);
      currentLocation = [this.position.lat() ,this.position.lng()];
      if(current)current.setPosition(this.position);
      document.getElementById('restaurantInput').value = name;
      console.log(restaurant.location)
    });
    markers.push({marker, name});
}

//add current marker
function addCurrentMarker(pos) {
  //create the red marker that represent the current prosition
    console.log("making Current marker");
    current = new google.maps.Marker({
        position: pos,
        map: map,
        draggable: true,
        title: 'here is me',
        icon: {url: 'https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi.png', scaledSize: new google.maps.Size(20, 35)},
        zIndex: 1000,
    });          
    current.addListener('dragend', function() {
        var markcoords = this.getPosition();
        current.setPosition(markcoords);
        locationInput.value = markcoords;
        currentLocation = [markcoords.lat(), markcoords.lng()];
        map.setCenter(markcoords);
        //the function below need to pay.
        //getLocationAddress(markcoords);
    });
}

function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  //  locationInput.value = currentLocation; 
    var pos = new google.maps.LatLng(defaultLocation[0], defaultLocation[1]);
    addCurrentMarker(pos);
    map.setCenter(pos);
    map.setZoom(18);
    locationInput.value = pos;
};

var options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
};

function getCurrentLocation(map) {
    console.log("updating location");
    navigator.geolocation.getCurrentPosition(setLocation, error, options);
    document.getElementById('mapSection').style.display = 'block';
    //document.getElementById('locationInput').style.display = 'block';
    document.getElementById('instruction').style.display = 'block';
    document.getElementById('locationLabel').style.display = 'none';
    document.getElementById('address').style.display = 'none';
    document.getElementById('addressConfirm').style.display = 'none';
    console.log("location get");
    return true;
}

function setLocation(position) {
  console.log("location set");
    currentLocation = [position.coords.latitude, position.coords.longitude];
    var currentLocationLatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    locationInput.value = currentLocationLatLng; 
    addCurrentMarker(currentLocationLatLng);
    map.setCenter(currentLocationLatLng);
    map.setZoom(18);
}

function getLocationAddress(pos) {
  geocoder = new google.maps.Geocoder();
  geocoder.geocode(
    {
      location: pos
    }
    ,function (result, status){
      if(status == google.maps.GeocoderStatus.OK){
        document.getElementById('address').value = result[0].formatted_address;
      }else{
        console.log('connot format the address');
      }
    }
  );
}

  //refresh map function
  function refreshMap() {
    var r = document.location.reload();
  }
  
  function newMarker() {
    //add the yellow icon to show the new upload data
    console.log("making marker");      
      var img = "<img src='" + imgURL + "' style='width: 125px;'>";
      var tagString = '';
      var makeTagString = tagList.forEach((tagList) => {
        if(tagList.value == true){
          tagString += '#' + tagList.name + '  ';
        };
      });
      var marker = new google.maps.Marker({
          position: {lat: currentLocation[0], lng: currentLocation[1]},
          map: map,
          icon: yellowIcon,
          animation: google.maps.Animation.BOUNCE
      });
      marker.addListener('click', function() {
        var infowindow = new google.maps.InfoWindow({
          content:'<div><h6> Restaurant: ' +
                  restaurantInput.value +
                  '</h6><h6> Dish: ' +
                  dishInput.value +
                  '<h6></div>' +
                  '<div>' +
                  img +
                  '</div>' +
                  '<div style="width: 150px;overflow: auto;"><h6>Tags : ' +
                  tagString +
                  '<h6></div>'
        });
        infowindow.open(map, marker);
      })       
  }

  function btnClick(btn) {
    //to add the filter requirment and call the restaurant filtering function 
    var isClicked;
    var tag;
    switch(btn.id){
        case "gluten_free":
            isGlutenShown = !isGlutenShown;
            isClicked = isGlutenShown;
           // tag = /gluten_free/;
           tag = 0;
            break;
        case "egg_free":
            isEggShown = !isEggShown;
            isClicked = isEggShown;
           //tag = /egg_free/;
           tag = 1;
            break;
        case "dairy_free":
            isDairyShown = !isDairyShown;
            isClicked = isDairyShown;
           // tag = /dairy_free/;
           tag = 2;
            break;
        case "treenut_free":
            isTreenutShown = !isTreenutShown;
            isClicked = isTreenutShown;
            //tag = /treenut_free/;
            tag = 3;
            break;
        case "peanut_free":
            isPeanutShown = !isPeanutShown;
            isClicked = isPeanutShown;
            //tag = /peanut_free/;
            tag = 4;
            break;
        case "soy_free":
            isSoyShown = !isSoyShown;
            isClicked = isSoyShown;
            //tag = /soy_free/;
            tag = 5;
            break;
        case "raw":
            isRawShown = !isRawShown;
            isClicked = isRawShown;
            //tag = /raw/;
            tag = 6;
            break;
        case "vegan":
            isVeganShown = !isVeganShown;
            isClicked = isVeganShown;
            //tag = /vegan/;
            tag = 7;
            break;
        case "buddhist_friendly":
            isBuddhistFriendlyShown = !isBuddhistFriendlyShown;
            isClicked = isBuddhistFriendlyShown;
            //tag = /buddhist_friendly/;
            tag = 8;
            break;
        case "all_natural":
            isAllNaturalShown = !isAllNaturalShown;
            isClicked = isAllNaturalShown;
            //tag = /all_natural/;
            tag = 9;
            break;
    }
    if(isClicked) {
        btn.style.backgroundColor = 'green';
        selected.push(tag);  
        filterNumber += 1;
    }else{
        btn.style = '';
        var i = selected.indexOf(tag);
        selected.splice(i, 1);  
        filterNumber -= 1;
    }        
    markers.forEach(element => {
      element.filterDishes(selected, filterNumber);
    })
}

    function clearAll() {
      //remove all the filter requirment and show all the restaurant
      selected = [];
      filterNumber = 0;
      markers.forEach(element => {
        element.filterDishes(selected, filterNumber);
      })
    }
