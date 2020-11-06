var isSideOpen = false;
var selected = [];
var filterNumber = 0;
//var blueIcon = {url: 'https://maps.google.com/mapfiles/ms/micons/blue-dot.png', scaledSize: new google.maps.Size(45, 45)};
//var greenIcon = {url: 'https://maps.gstatic.com/mapfiles/markers2/marker_greenV.png', scaledSize: new google.maps.Size(30, 45)};
//var yellowIcon = {url: 'https://maps.google.com/mapfiles/ms/micons/yellow-dot.png', scaledSize: new google.maps.Size(45, 45)};
//var couponIcon = {url: "https://img.icons8.com/material-rounded/48/000000/location-marker.png"}
//var couponIcon2 = {url: "https://img.icons8.com/fluent/48/000000/map.png", scaledSize: new google.maps.Size(40, 40)}
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
const CUISINE_CATEGORIES = {
  "Asian": [],
  "Chinese": [],
  "Japanese": [],
  "Korean": [],
  "Singaporean": [],
  "Thai": [],
  "Vietnamese": [],
  "Indian": [],
  "Sri Lankan": [],
  "Middle-East": [],
  "Lebanese": [],
  "Turkish": [],
  "Western": [],
  "American": [],
  "Australian": [],
  "French": [],
  "Greek": [],
  "Italian": [],
  "Portuguese": [],
  "Spanish": [],
  "Mexican": [],
  "Fusion": []
};
const CATEGORY_INGREDIENTS = {
  "Bar": ["Vegan", "No Animal Extract", "Non-alcohol", "Dairy Free", "Egg Free"],
  "Dessert & Fruits": ["Dairy Free", "Egg Free", "Nuts Free", "Sugar Free", "Gluten Free"],
  "Coffee & Tea": ["Dairy Free", "Organic", "Plant-Based Milk"],
  "Fast Food": ["Dairy Free", "Egg Free", "Plant-Based Meat", "MSG Free"],
  "Salad": ["Dairy Free", "Egg Free", "Plant-Based Meat", "Nuts Free", "Garlic Free", "Organic"],
  "Main Dish": ["Vegan", "Dairy Free", "Egg Free", "No Animal Extract", "Plant-Based Meat", "Garlic Free", "Gluten Free", "Soy Free", "Nut Free", "MSG free"],
  "Dim Sum": ["Dairy Free", "Egg Free", "No Animal Extract", "Plant-Based Meat", "Garlic Free", "Gluten Free", "Soy Free", "Nut Free", "MSG free"],
  "Noodles": ["Dairy Free", "Egg Free", "No Animal Extract", "Rice Noodle", "Plant-Based Meat", "Garlic Free", "Gluten Free", "Soy Free", "Nut Free", "MSG free"],
  "Appetizer": ["Dairy Free", "Egg Free", "No Animal Extract", "Plant-Based Meat", "Garlic Free", "Gluten Free", "Soy Free", "Nut Free", "MSG free"],
  "Sushi": ["Dairy Free", "Egg Free", "Plant-Based Seafood", "Konjac", "Wasabi", "Soy Free", "No Animal Extract"],
  "Sashimi": ["Dairy Free", "Egg Free", "Plant-Based Seafood", "Konjac", "Wasabi", "Soy Free", "No Animal Extract"],
  "Burger": ["Dairy Free", "Egg Free", "Garlic Free", "Honey Free", "Gluten Free", "Soy Free", "Plant-Based Meat", "Impossible Burger", "Mushroom"],
  "Cheese": ["Dairy Free" , "Egg Free", "Garlic Free", "Honey Free", "Gluten Free", "Soy Free", "Nuts", "Spice", "Herbs"]
};

var itemsArray;
  fetch('/data/sort-veggie.json').then(function(response) {
    return response.json();
  }).then(function(data) {
    itemsArray = data.map(item => {
      return { "name": item.SS, "dist": item.DIST, "adr": item.ADR, "lat": item.lat, "lng": item.lng }
    })

    itemsArray.push({name:'LOVING HUT 愛家國際餐飲 - 淘大店', dist: '51', adr: 'SHOP NOS. G242-245, G/F, AMOY PLAZA , PHASE II, 77 NGAU TAU KOK ROAD, KOWLOON', lat:22.323897, lng:114.216543});
    itemsArray.push({name:'LOVING HUT 愛家 - Port 33 分店', dist: '53', adr: 'SHOP 103A, 1/F, PORT 33, 33 TSEUK LUK STREET, SAN PO KONG, KOWLOON', lat:22.3355, lng:114.197718});
    itemsArray.push({name:'Vegan Seven Days', dist: '52', adr: 'G/F, 22C SUNG KIT STREET, HUNG HOM, KOWLOON', lat:22.311779, lng:114.188552});
    itemsArray.push({name:'POP Vegan', dist: '18', adr: 'SHOP 1, 1ST FLOOR, MILLION CITY, NO. 28 ELGIN STREET, CENTRAL, HONG KONG', lat:22.281855, lng:114.152563});
    itemsArray.push({name:'10 ST. FRANCIS', dist: '12', adr: 'G/F., 10 ST. FRANCIS STREET, WANCHAI, HONG KONG', lat:22.276165, lng:114.169578});
    itemsArray.push({name:'MANA! Starstreet', dist: '12', adr: 'G/F., 6 HENNESSY ROAD, HONG KONG', lat:22.27774, lng:114.16842});
    itemsArray.push({name:'MANA! SOHO', dist: '18', adr: 'G/F., NO. 6-8 STAUNTON STREET, CENTRAL, HONG KONG', lat:22.28162, lng:114.153091});
    itemsArray.push({name:'Feather and Bone', dist: '18', adr: 'SHOP 1A ON G/F., COMMERCIAL ACCOMMODATION, BOHEMIAN HOUSE, 321 DES VOEUX ROAD WEST, HONG KONG', lat:22.287606, lng:114.138868});
    itemsArray.push({name:'Feather and Bone', dist: '12', adr: 'THE PORTION A OF SHOP A &amp; C, G/F., WINNER BUILDING, NO. 11 WONG NAI CHUNG ROAD, HAPPY VALLEY, HONG KONG', lat:22.269535, lng:114.184088});
    itemsArray.push({name:'Feather and Bone', dist: '12', adr: 'SHOP A, G/F., LUARD ON THE PARK, 5 LUARD ROAD, WAN CHAI, HONG KONG', lat:22.276861, lng:114.171361});
    itemsArray.push({name:'Feather and Bone', dist: '92', adr: 'MAJOR PORTION OF SHOP NOS. G09 AND GO9A, G/F, OP MALL, 100 TAI HO ROAD, TSUEN WAN, NEW TERRITORIES', lat:22.368085, lng:114.110658});
    itemsArray.push({name:'Feather and Bone', dist: '18', adr: 'SHOP ON SHOP LEVEL 1 FLOOR, SOHO 38, NO. 38 SHELLEY STREET, HONG KONG', lat:22.280023, lng:114.151251});
    itemsArray.push({name:'Mana! Fast Slow Food', dist: '18', adr: 'G/F., 92 WELLINGTON STREET, CENTRAL, HONG KONG', lat:22.282801, lng:114.154556});
    itemsArray.push({name:'Fuel Espresso', dist: '18', adr: 'SHOP 3023, LEVEL 3, IFC MALL, CENTRAL, HONG KONG', lat:22.284943, lng:114.157324});
    itemsArray.push({name:'Fuel Espresso', dist: '18', adr: 'LANDMARK ATRIUM, 15 QUEEN&apos;S ROAD CENTRAL, CENTRAL, HONG KONG', lat:22.280676, lng:114.157692});
    itemsArray.push({name:'Fuel Espresso', dist: '18', adr: 'SHOP 206 AND AREA A, LEVEL 2, PACIFIC PLACE, 88 QUEENSWAY, HONG KONG', lat:22.277152, lng:114.164887});
    itemsArray.push({name:'Fuel Espresso', dist: '18', adr: 'PORTION OF OFFICE LOBBY AT G/F, CHATER HOUSE, 8 CONNAUGHT ROAD CENTRAL, CENTRAL, HONG KO', lat:22.282126, lng:114.15847});
    itemsArray.push({name:'Fuel Espresso', dist: '11', adr: 'AREA A, G/F., ONE TAIKOO PLACE, TAIKOO PLACE, 979 KING&apos;S ROAD, QUARRY BAY, HONG KONG', lat:22.287192, lng:114.211008});
    itemsArray.push({name:'Fuel Espresso', dist: '61', adr: 'SHOP B, LOBBY OF SKY OBSERVATION DECK, 2/F, ICC, 1 AUSTIN ROAD WEST, KOWLOON', lat:22.303381, lng:114.160231});
    itemsArray.push({name:'FUEL ESPRESSO QUAYSIDE', dist: '51', adr: 'SHOP NO.2, GROUND FLOOR, TOWER 1 AND TOWER 2, THE QUAYSIDE, 77 HOI BUN ROAD, KWUN TONG, KOWLOON', lat:22.316534, lng:114.213709});
    itemsArray.push({name:'LOCK CHA TEA HOUSE', dist: '18', adr: 'SHOP 01-G07 AND THE OUTSIDE SEATING ACCOMMODATION AT SIDE, G/F., HEADQUARTERS BLOCK, CENTRAL POLICE STATION, NO. 10 HOLLYWOOD ROAD, CENTRAL, HONG KONG', lat:22.281361, lng:114.153974});
    itemsArray.push({name:'NINETYS', dist: '18', adr: 'G/F., NO. 2-4 SHELLEY STREET, CENTRAL, HONG KONG', lat:22.281898, lng:114.153399});
    itemsArray.push({name:'NINETYS', dist: '18', adr: "AIA Central, 1 Connaught Road, Central, HONG KONG", lat:22.281333, lng:114.162012});
    itemsArray.push({name:'NINETYS', dist: '12', adr: "SHOP 2, G/F., NO. 222 QUEEN'S ROAD EAST, WAN CHAI, HONG KONG", lat:22.274811, lng:114.172593});

    //index.html only
    if (document.getElementById("restaurantInput")) {
      autocomplete(document.getElementById("restaurantInput"), itemsArray);
    }
  });


class Restaurant {
  constructor(marker, name, location, id, dishes, cuisines) {
      this.marker = marker;
      this.name = name;
      this.location = location;
      this.id = id;
      var dishList = [];
      dishes.forEach(value => {
        dishList.push(new Dish(value.dish, value.fileURL, value.category, value.tags));
      })
      this.dishes = dishList;
      this.cuisines = cuisines || [];
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

  setInfoWindow(info) {
    this.infowindow = info;
  }

  //show the the restaurant details in the side bar
  showDetails() {
    document.getElementById("restName").innerText = this.name;
    //document.getElementById("restLocation").innerText = this.location;
    var dishSection = document.createElement("div")
    dishSection.id = "dishSection";
    document.getElementById("slideContainer").appendChild(dishSection);
    this.dishes.forEach(element => {
      element.showDish("dishSection");
    })
  }

  //show or hide the resaturant by screening all the dishes, show the dishes match all the sectleted tags, if no dishes match, hide the marker
  filterDishes(filterTags, tagsNum, category) {
    var check = 0;
    var dishMatch = 0;
    var firstDish = true;
    if(this.infowindow)this.infowindow.close();
    if(category){
      console.log('searching' + category)
      this.dishes.forEach(element => {
        if(category == element.getCategory()){
          console.log('match' + category)
          if(tagsNum){
            filterTags.forEach(value => {
              if(element.hasTag(value)){
                  check++;
              }
          })
          if(check > 0){
            dishMatch++;
            element.setShow(true);
            if(firstDish && tagsNum){
              this.showInfoWindow(element, this.marker);
              firstDish = false;
            }
          }else{
            element.setShow(false);
          }
          }else{
            dishMatch++;
            element.setShow(true);
          }
        }else{
          element.setShow(false);
        }
      })
      if(dishMatch){
        this.marker.setVisible(true);
      }else{
        this.marker.setVisible(false);
      }
    }else{
      this.dishes.forEach(element => {
        element.setShow(true);
      })
      this.marker.setVisible(true);
    }

  }

  showInfoWindow(dish, marker) {
    var contentString =
      "<h3>" + dish.getName() + "</h3><br>"
      + '<img src="' + dish.getImage() + '" style="width: 125px">'
      + "<h6>" + dish.getTagString() + "</h6>"
    var infowindow = new google.maps.InfoWindow({
      content: contentString,
      maxWidth: 125
    });
    this.setInfoWindow(infowindow);
    infowindow.open(map, marker);
  }
}

class Dish {
  constructor(name, image, category, tags) {
    this.name = name;
    this.image = image;
    this.tags = tags;
    var string = '';
    tags.forEach((tag) => {
      string += '#' + tag + '  ';
    });
    this.tagString = string;
    this.show = true;
    this.category = category;
  }

  getName() {
    return this.name;
  }

  getImage() {
    return this.image;
  }

  getTags() {
    return this.tags;
  }

  getTagString() {
    return this.tagString;
  }

  getCategory() {
    return this.category;
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

  hasTag(tag) {
    return tag.test(this.tagString);
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
}

//check weather the restaurant inside the searching area
function isInArea(position, center, radius) {
    var distance;
    if ((position.lat() == center.lat()) && (position.lng() == center.lng())) {
        distance = 0;
    } else {
        distance = google.maps.geometry.spherical.computeDistanceBetween(position, center);
    }
    return(distance < radius);
}

function calcCrow(lat1, lon1, lat2, lon2)
{
  var R = 6371; // km
  var dLat = toRad(lat2-lat1);
  var dLon = toRad(lon2-lon1);
  var lat1 = toRad(lat1);
  var lat2 = toRad(lat2);

  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
  Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c;
  return d;
}

// Converts numeric degrees to radians
function toRad(Value)
{
  return Value * Math.PI / 180;
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
    // if(mode === "search"){}
    // if(isFilter){
    //   document.getElementById('restSearch').innerText = count + ' restaurant found under the filter requirment(s)';
    // }else{
    //   document.getElementById('restSearch').innerText = count + ' restaurant found';
    // }
    // if(count > 0){
    //     document.getElementById('restSearch').style.color = 'rgb(0,255,0)'
    // }else{
    //     document.getElementById('restSearch').style.color = 'rgb(255,0,0)'
    //     markers.forEach(item => item.marker.setVisible(true));
    // };
}

//add the marker on a restaurant and create a Restaurant object
//called by index.html initMap
function addRestMarker(restaurant) {
  let lat = restaurant.location[0];
  let lng =  restaurant.location[1];
  var marker = L.marker([lat, lng], {icon: new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
    })
  }); //.addTo(mymap);
  marker.on('click', (e) => {
    let feature = geoJson.features[0];
    var images = restaurant.dishes;
    var slideshowContent = '';
    for(var i = 0; i < images.length; i++) {
      var img = images[i];
      slideshowContent += '<div class="image' + (i === 0 ? ' ' : '') + '">' +
      '<img src="' + img.fileURL + '" />' +
      '<div class="caption">' + img.dish + '</div>' +
      '</div>';
    }
    let best_distance = null;
    let best_adr = '';
    for(var i = 0; i < itemsArray.length; i++)
    {
      if(itemsArray[i].name === restaurant.name)
      {
        let distance = calcCrow(itemsArray[i].lat, itemsArray[i].lng, lat, lng).toFixed(1);
        if (!best_distance || distance < best_distance) {
          best_distance = distance;
          best_adr = itemsArray[i].adr;
        }
      }
    }
    sList = best_adr.split(",");
    num = sList.length;
    if (num > 2) {
      best_adr = sList[num-2] + "," + sList[num-1]
    }
    var popupContent =  '<div id="' + restaurant.name + '" class="popup">' +
    "<h6><font>"+restaurant.name+
    "</font></h6><p>" +best_adr+
    "</p>"+

    '<div class="slideshow">' +
    slideshowContent +
    '</div>' +
    '<div class="cycle">' +
    '<a href="#" class="prev">&laquo; Previous</a>' +
    '<a href="#" class="next">Next &raquo;</a>' +
    '</div>'
    '</div>';

    var popup = L.popup();
    popup
    .setLatLng([lat, lng])
    .setContent(popupContent)
    .openOn(mymap);
  });
  if(restaurant.coupon > 0){
    var label = {text: restaurant.coupon.toString(), fontSize: "20px", fontWeight: "bold"}
    //marker.setIcon(couponIcon2);
    //marker.setLabel(label);
    marker.bindTooltip(label,
        {
            permanent: true,
            direction: 'right'
        }
    );
  }
  var restaurantObj = new Restaurant(marker, restaurant.name, restaurant.location, restaurant.id, restaurant.dishes, restaurant.cuisines);
  markers.push(restaurantObj);
  return marker;
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

//called from setLocation
function addCurrentMarker(pos) {
  //create the red marker that represent the current prosition
    console.log("adding Current marker");
    current = new google.maps.Marker({
        position: pos,
        map: map,
        draggable: true,
        title: 'here is me',
        icon: {url: 'https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi.png', scaledSize: new google.maps.Size(20, 35)},
        zIndex: 1000,
    });

    //var restaurants = [...(new Set(markers.map(el => el.name)))].sort();
    autocomplete(document.getElementById("restaurantInput"), markers);
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
    document.getElementById('after-location-loaded').style.display = 'block';
    console.log("location get");
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
    // document.getElementById('restaurantInput').style.display = 'block';
    // document.getElementById('dishInput').style.display = 'block';
    // document.getElementById('helloMessageInput').style.display = 'block';
    // document.getElementById('uploadLabel').style.display = 'block';
    //document.getElementById('after-location-loaded').style.display = 'block';
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
  document.getElementById('after-location-loaded').style.display = 'block';
  console.log("location get");
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


    var tagNum = 0;
    var tagList = [];
    var category;
    var unique_categories = [];

    (function() {
      console.log('categories ready');
      if (document.getElementById('indexCuisines')) {
        document.getElementById('indexCuisines').onchange = filterIndexCategories;
      }
      if (document.getElementById('indexCategories')) {
        document.getElementById('indexCategories').onchange = filterIndexIngredients;
      }
      if (document.querySelector('#indexCategoryBlock')) {
        document.querySelector('#indexCategoryBlock').style.display = 'none';
      }
      if (document.querySelector('#indexIngredientBlock')) {
        document.querySelector('#indexIngredientBlock').style.display = 'none';
      }
      if (document.getElementById('selectCuisines')) {
        document.getElementById('selectCuisines').innerHTML = '';
      }
      if (document.getElementById('selectCategories')) {
        document.getElementById('selectCategories').innerHTML = '';
      }
      if (document.getElementById('selectTags')) {
        document.getElementById('selectTags').innerHTML = '';
      }
      // db.collection('categories').get().then(docs => {
      //   docs.forEach(doc => {
      //     let c = doc.id;
      //     c = c.charAt(0).toUpperCase() + c.slice(1);
      //     unique_categories.push(c);
      //   })

        for (var key of Object.keys(CATEGORY_INGREDIENTS)) {
          //console.log(key + " -> " + p[key])
          unique_categories.push(key);
        }

        //const sb = document.querySelector('#indexList'); //index.html only
        const st = document.getElementById('selectTags'); //search.html only
        const cats = document.getElementById('indexCategories'); //index.html only
        const scats = document.getElementById('selectCategories'); //search.html only
        const icuisines = document.getElementById('indexCuisines'); //index.html only
        const scuisines = document.getElementById('selectCuisines'); //search.html only

        Object.keys(CUISINE_CATEGORIES)
        .forEach(ucuisine => {
          if (icuisines) {
            var option = document.createElement('option');
            option.innerText = ucuisine;
            option.value = ucuisine;
            icuisines.appendChild(option);
          }
          if (scuisines) {
            var box = document.createElement('input');
            box.type = 'checkbox';
            box.id = ucuisine;
            box.className = 'checkbox';
            box.name = "cuisines";
            box.onclick = filterMarkers;
            var boxLabel = document.createElement('label');
            boxLabel.innerText = ucuisine;
            boxLabel.htmlFor = ucuisine;
            scuisines.appendChild(boxLabel);
            boxLabel.appendChild(box);
          }
        });

        [...(new Set(unique_categories))].sort().forEach(ucat => {
          if (cats) {
            var option = document.createElement('option');
            option.innerText = ucat;
            option.value = ucat;
            cats.appendChild(option);
          }
          if (scats) {
            var box = document.createElement('input');
            box.type = 'checkbox';
            box.id = ucat;
            box.className = 'checkbox';
            box.name = "categories";
            box.onclick = filterIngredients;
            var boxLabel = document.createElement('label');
            boxLabel.innerText = ucat;
            boxLabel.htmlFor = ucat;
            scats.appendChild(boxLabel);
            boxLabel.appendChild(box);
          }
        });
      //})
    })();

    //index.html only
    function uploadTags() {
      let uploadCuisine = document.getElementById('indexCuisines').value;
      category = document.getElementById('indexCategories').value;
      //const sb = document.querySelector('#indexIngredients');
      tagList = $('#indexIngredients').val().split(",");
      //tagList = [...sb.options].map(el => el.value);
      //console.log("***tagList", tagList);
      db.collection('categories').doc(category).update({
        tags: firebase.firestore.FieldValue.arrayUnion(...tagList)
      })
    }

    //index.html Only
    function filterIndexCategories() {
      let uploadCuisine = document.getElementById('indexCuisines').value;
      if (uploadCuisine) {
        document.querySelector('#indexCategoryBlock').style.display = 'block';
      } else {
        document.querySelector('#indexCategoryBlock').style.display = 'none';
      }
    }

    //index.html Only
    function filterIndexIngredients() {
      //let indexIngredients = document.querySelector('#indexIngredients');
      $('#indexIngredients').tagsinput('removeAll');
      // while (indexIngredients.lastChild) {
      //   indexIngredients.removeChild(indexIngredients.lastChild);
      // }

      let newIngredients = [];
      let indexCategory = document.getElementById('indexCategories').value;
      newIngredients.push(...(CATEGORY_INGREDIENTS[indexCategory] || []));
      [...(new Set(newIngredients))].sort().forEach(tag => {
        // const option = new Option(tag, tag);
        // indexIngredients.add(option, undefined);
        $('#indexIngredients').tagsinput('add', tag);
        console.log("***tag", tag);
      })
//console.log("***newIngredients", newIngredients);
//$('#indexIngredients').tagsinput('refresh');
// $('#indexIngredients').tagsinput('add', 'some tag2');
//$('#indexIngredients').tagsinput('refresh');
console.log("***select.val refresh before add jquery", $('#indexIngredients').val());
//$('#indexIngredientsInput').tagsinput('add', "jQuery", false);
//console.log("***select.val refresh after add jquery", $('#indexIngredients').val());
//$('#indexIngredientsInput').tagsinput('add', "hi", false);
// $('#indexIngredientsInput').tagsinput('add', { "value": 2, "text": "Script"});

      if ($('#indexIngredients').val().length > 0) {
        document.querySelector('#indexIngredientBlock').style.display = 'block';
      } else {
        document.querySelector('#indexIngredientBlock').style.display = 'none';
      }
    }

    // search.html only
    function filterIngredients() {
      checkedBoxes = [...document.querySelectorAll('input[name=categories]:checked')];
      var active_categories = checkedBoxes.map(el => el.id);

      checkedBoxes = [...document.querySelectorAll('input[name=ingredients]:checked')];
      var active_ingredients = checkedBoxes.map(el => el.id);
            // let searchCuisines = document.getElementById('selectCuisines');
            // while (searchCuisines.lastChild) {
            //   searchCuisines.removeChild(searchCuisines.lastChild);
            // }

            // let searchCategories = document.getElementById('selectCategories');
            // while (searchCategories.lastChild) {
            //   searchCategories.removeChild(searchCategories.lastChild);
            // }

      //let indexIngredients = document.querySelector('#indexList');
      let searchIngredients = document.getElementById('selectTags');
      while (searchIngredients.lastChild) {
        searchIngredients.removeChild(searchIngredients.lastChild);
      }

      let newIngredients = [];
      active_categories.forEach(category => {
        newIngredients.push(...(CATEGORY_INGREDIENTS[category] || []));
      });

      [...(new Set(newIngredients))].sort().forEach(tag => {
        // if (indexIngredients) {
        //   const option = new Option(tag, tag);
        //   indexIngredients.add(option, undefined);
        // }
        //if (searchIngredients) {
          let box = document.createElement('input');
          box.type = 'checkbox';
          box.id = tag;
          box.className = 'checkbox';
          box.name = "ingredients";
          box.onclick = filterMarkers;
          if (active_ingredients.includes(tag)) {
            box.defaultChecked = true;
          }
          let boxLabel = document.createElement('label');
          boxLabel.innerText = tag;
          boxLabel.htmlFor = tag;

          searchIngredients.appendChild(boxLabel);
          boxLabel.appendChild(box);
        //}
      });

      filterMarkers();
    }

    // search.html only
    function filterMarkers() {
      var checkedBoxes = [...document.querySelectorAll('input[name=cuisines]:checked')];
      var active_cuisines = checkedBoxes.map(el => el.id.toUpperCase());

      checkedBoxes = [...document.querySelectorAll('input[name=categories]:checked')];
      var active_categories = checkedBoxes.map(el => el.id.toUpperCase());

      checkedBoxes = [...document.querySelectorAll('input[name=ingredients]:checked')];
      var active_ingredients = checkedBoxes.map(el => el.id.toUpperCase());
       // console.log("****active_cuisines", active_cuisines);
       // console.log("****active_categories", active_categories);
       // console.log("***active_ingredients", active_ingredients);
      markers.forEach((item, i) => {
        item.marker.remove();
        if (active_cuisines.length > 0 || active_categories.length > 0 || active_ingredients.length > 0) {
          let marker_cuisines = item.cuisines.map(c => c.toUpperCase());
          let marker_categories = item.dishes.map(dish => dish.category.toUpperCase());
          let marker_tags = item.dishes.reduce((a, o) => (a.push(...o.tags), a.map(tag => tag.toUpperCase())), []);

          let hasCuisine = marker_cuisines.reduce((a, marker_cuisine) => (a || active_cuisines.includes(marker_cuisine)), false);
          let hasCategory = marker_categories.reduce((a, marker_category) => (a || active_categories.includes(marker_category)), false);
          let hasIngredient = marker_tags.reduce((a, marker_tag) => (a || active_ingredients.includes(marker_tag)), false);
          // console.log("***hasCuisine", hasCuisine);
          // console.log("***hasCategory", hasCategory);
          // console.log("***hasIngredient", hasIngredient);
          // console.log("***marker_cuisines", marker_cuisines);
          // console.log("***marker_categories", marker_categories);
          // console.log("***marker_tags", marker_tags);
          if (hasCuisine && hasCategory && hasIngredient) {
            console.log("***item", item);
            item.marker.addTo(mymap);
          }
        }
      });
    }

    function addFilter(tag, state) {
      tagRegex = new RegExp(tag)
      if(state){
        selected.push(tagRegex);
        filterNumber++;
        markers.forEach(element => {
          element.filterDishes(selected, filterNumber, category);
        })
      }else{
        var i = selected.indexOf(tagRegex);
        selected.splice(i, 1);
        filterNumber--;
        markers.forEach(element => {
          element.filterDishes(selected, filterNumber, category);
        })
      }
    }

    var geoJson = {
      "type": "FeatureCollection",
      features: [{
        type: 'Feature',
        "geometry": { "type": "Point", "coordinates": [22.263204, 114.141855]},
        "properties": {
          'Title': 'LOVING HUT 愛家國際餐飲',
          'Head': '77 NGAU TAU KOK ROAD, KOWLOON',
          'Description': 'Winner of VegNews 2010 Favorite Vegan Restaurant award.',
          'URL': 'http://www.lovinghut.com/portal/hk/',
          'images': [
            ['https://firebasestorage.googleapis.com/v0/b/pay-a-vegan.appspot.com/o/images%2FMon%20Oct%2012%202020%2006%3A40%3A19%20GMT-0400%20(Eastern%20Daylight%20Time).jpg?alt=media&token=acc68f1a-1eb8-4f5f-825c-2ce2382188fe','Fresh Ingredients.'],
            ['https://firebasestorage.googleapis.com/v0/b/pay-a-vegan.appspot.com/o/images%2FMon%20Sep%2007%202020%2005%3A40%3A36%20GMT-0400%20(Eastern%20Daylight%20Time).jpg?alt=media&token=b6b73a68-a30d-4ba0-98d1-28370834702b', 'Comtemporary brunch and meals'],
            ['https://firebasestorage.googleapis.com/v0/b/pay-a-vegan.appspot.com/o/images%2FWed%20Sep%2009%202020%2004%3A00%3A27%20GMT-0400%20(Eastern%20Daylight%20Time).jpg?alt=media&token=0e417833-9709-4c74-b1d9-6fabfc1b24d0', 'Convenient Location. Nice atmosphere.']
          ]
        }
      }, {
        type: 'Feature',
        "geometry": { "type": "Point", "coordinates": [22.261456, 114.176531]},
        "properties": {
          'Title': 'LOCK CHA TEA HOUSE',
          'Head': '10 HOLLYWOOD ROAD, CENTRAL, HONG KONG',
          'Description': 'The best teahouse in Hong Kong',
          'URL': 'https://www.lockcha.com/en/',
          'images': [
            ['https://firebasestorage.googleapis.com/v0/b/pay-a-vegan.appspot.com/o/images%2FFri%20Sep%2025%202020%2019%3A02%3A47%20GMT%2B0800%20(HKT).jpg?alt=media&token=02d087ab-a91e-4d6f-a2f4-5d1597a8d97f','Tasty.'],
            ['https://firebasestorage.googleapis.com/v0/b/pay-a-vegan.appspot.com/o/images%2FSun%20Oct%2018%202020%2000%3A14%3A39%20GMT-0400%20(Eastern%20Daylight%20Time).jpg?alt=media&token=28cdf0ff-71fb-46e4-b266-8e27b4a8c222', 'Good breakfast.'],
            ['https://firebasestorage.googleapis.com/v0/b/pay-a-vegan.appspot.com/o/images%2FTue%20Sep%2029%202020%2011%3A34%3A18%20GMT%2B0800%20(HKT).jpg?alt=media&token=b80d6e8b-b07b-4918-8574-070fd99b34df','Friendly service. Good dessert.']
          ]

        }
      }]};


      //var map = L.map('map').setView([52.105, -0.09], 9);

      //L.tileLayer( 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      // attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      // subdomains: ['a','b','c']
      //}).addTo( map );

      var geojsonMarkerOptions = {
        radius: 8,
        fillColor: "#ff7800",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      };
      var sitis =  L.geoJson(geoJson, {
        pointToLayer: function (feature, latlng) {
          feature.properties.myKey = feature.properties.Title + ', ' + feature.properties.Head
          return L.circleMarker(latlng, geojsonMarkerOptions);
        },
        onEachFeature: onEachFeature
      }).addTo(mymap);

    //L.tileLayer( 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; <a href="openstreetmap.org/copyright">OpenStreetMap</a>', subdomains: ['a','b','c'] }).addTo( map )

    function onEachFeature(feature, layer) {
      // does this feature have a property named popupContent?
      if (feature.properties && feature.properties.Title) {
        var images = feature.properties.images
        var slideshowContent = '';

        for(var i = 0; i < images.length; i++) {
          var img = images[i];
          slideshowContent += '<div class="image' + (i === 0 ? ' ' : '') + '">' +
          '<img src="' + img[0] + '" />' +
          '<div class="caption">' + img[1] + '</div>' +
          '</div>';
        }

        var popupContent =  '<div id="' + feature.properties.Title + '" class="popup">' +
        "<h1><font color='red'>"+feature.properties.Title+
        "</font></h1><h2>Address: " +feature.properties.Head+
        "</h2><p>"+feature.properties.Description+"</p><p> Website:"
        +feature.properties.URL+"</p>"+

        '<div class="slideshow">' +
        slideshowContent +
        '</div>' +
        '<div class="cycle">' +
        '<a href="#" class="prev">&laquo; Previous</a>' +
        '<a href="#" class="next">Next &raquo;</a>' +
        '</div>'
        '</div>';

      }
    };


    var $slideshow = $('.slideshow');
    $slideshow.find('.active').removeClass('active').hide();

    $('#mapid').on('click', '.popup .cycle a', function() {
      var $slideshow = $('.slideshow'),
      $newSlide;

      if ($(this).hasClass('prev')) {
        $newSlide = $slideshow.find('.active').prev();
        if ($newSlide.index() < 0) {
          $newSlide = $('.image').last();
        }
      } else {
        $newSlide = $slideshow.find('.active').next();
        if ($newSlide.index() < 0) {
          $newSlide = $('.image').first();
        }
      }

      $slideshow.find('.active').removeClass('active').hide();
      $newSlide.addClass('active').show();
      return false;
    });
