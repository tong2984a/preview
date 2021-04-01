var isSideOpen = false;
var selected = [];
var filterNumber = 0;
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
  "Southeast Asian": [],
  "Singaporean": [],
  "Thai": [],
  "Vietnamese": [],
  "Indian": [],
  "Sri Lankan": [],
  "Balinese": [],
  "Middle-East": [],
  "Lebanese": [],
  "Turkish": [],
  "Egyptian": [],
  "Western": [],
  "American": [],
  "Australian": [],
  "Belgium": [],
  "French": [],
  "German": [],
  "Greek": [],
  "Italian": [],
  "Portuguese": [],
  "Spanish": [],
  "Mexican": [],
  "Fusion": []
};
const GROCERY_ORIGIN_CATEGORIES = {
  "Chinese": [],
  "International": [],
  "Japanese": [],
  "Taiwanese": [],
  "Sri Lankan": [],
  "Indian": [],
  "Pakistan": [],
  "South East Asia": [],
  "Thailand": [],
  "Italian": [],
  "Western": [],
  "Local": []
};
const CATEGORY_INGREDIENTS = {
  "Alcohol":["Vegan","Gluten Free", "Organic"],
  "Appetizer": ["Dairy Free", "Egg Free", "No Animal Extract", "Plant-Based Meat", "Garlic Free", "Gluten Free", "Soy Free", "Nut Free", "MSG free"],
  "Bar": ["Vegan", "No Animal Extract", "Non-alcohol", "Dairy Free", "Egg Free"],
  "Buffet": ["Vegan", "Dairy Free", "Egg Free", "No Animal Extract", "Plant-Based Meat", "Garlic Free", "Gluten Free", "Soy Free", "Nut Free", "MSG free"],
  "Burger": ["Dairy Free", "Egg Free", "Garlic Free", "Honey Free", "Gluten Free", "Soy Free", "Plant-Based Meat", "Impossible Burger", "Mushroom"],
  "Cheese": ["Dairy Free" , "Egg Free", "Garlic Free", "Honey Free", "Gluten Free", "Soy Free", "Nuts", "Spice", "Herbs"],
  "Coffee & Tea": ["Dairy Free", "Organic", "Plant-Based Milk"],
  "Dessert & Fruits": ["Dairy Free", "Egg Free", "Nuts Free", "Sugar Free", "Gluten Free"],
  "Dim Sum": ["Dairy Free", "Egg Free", "No Animal Extract", "Plant-Based Meat", "Garlic Free", "Gluten Free", "Soy Free", "Nut Free", "MSG free"],
  "Fast Food": ["Dairy Free", "Egg Free", "Plant-Based Meat", "MSG Free"],
  "Main Dish": ["Vegan", "Dairy Free", "Egg Free", "No Animal Extract", "Plant-Based Meat", "Garlic Free", "Gluten Free", "Soy Free", "Nut Free", "MSG free"],
  "Noodles": ["Dairy Free", "Egg Free", "No Animal Extract", "Rice Noodle", "Plant-Based Meat", "Garlic Free", "Gluten Free", "Soy Free", "Nut Free", "MSG free"],
  "Sandwich": ["Vegan", "Dairy Free", "Egg Free", "Plant-Based Meat", "Nuts Free", "Soy Free", "Garlic Free", "MSG Free", "Organic"],
  "Sashimi": ["Dairy Free", "Egg Free", "Plant-Based Seafood", "Konjac", "Wasabi", "Soy Free", "No Animal Extract"],
  "Soup & Salad": ["Vegan", "Dairy Free", "Egg Free", "Plant-Based Meat", "Nuts Free", "Soy Free", "Garlic Free", "MSG Free", "Organic"],
  "Sushi": ["Dairy Free", "Egg Free", "Plant-Based Seafood", "Konjac", "Wasabi", "Soy Free", "No Animal Extract"]
};
const GROCERY_CATEGORY_INGREDIENTS = {
  "Noodles": ["Vegetable Protein"],
  "Sauce": ["Vegetable Protein"],
  "Herbs": ["Vegetable Protein"],
  "Plant-Based Meat": ["Vegetable Protein"],
  "Plant-Based Egg": ["Vegetable Protein"],
  "Plant-Based Milk": ["Vegetable Protein"],
  "Chocolate": ["Vegetable Protein"],
  "Ice Cream": ["Vegetable Protein"],
  "Yogurt": ["Vegetable Protein"],
  "Cheese": ["Vegetable Protein"],
  "Cake": ["Vegetable Protein"],
  "Bread": ["Vegetable Protein"],
  "Alcohol": ["Vegetable Protein"]
};

var itemsArray;

      let newCategories = [];
      for (var key of Object.keys(GROCERY_CATEGORY_INGREDIENTS)) {
        newCategories.push(key);
      }
      $('#groceryCategories').select2({
        placeholder: 'Select anything',
        data: newCategories,
        closeOnSelect: true
      });

  var options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
  };

      var tagNum = 0;
      var tagList = [];
      //var category;
      var unique_categories = [];

      (function() {
        console.log('categories ready');
        // if (document.getElementById('groceryOrigins')) {
        //   document.getElementById('groceryOrigins').onchange = filterGroceryCategories;
        // }
        // if (document.getElementById('groceryCategories')) {
        //   document.getElementById('groceryCategories').onchange = filterGroceryIngredients;
        // }
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

          for (var key of Object.keys(CATEGORY_INGREDIENTS)) {
            unique_categories.push(key);
          }

          const st = document.getElementById('selectTags'); //search.html only
          const gcats = document.getElementById('groceryCategories'); //grocery.html only
          const cats = document.getElementById('indexCategories'); //index.html only
          const scats = document.getElementById('selectCategories'); //search.html only
          const gorigins = document.getElementById('groceryOrigins'); //grocery.html only
          const icuisines = document.getElementById('indexCuisines'); //index.html only
          const scuisines = document.getElementById('selectCuisines'); //search.html only

          if (gorigins) {
            $('#groceryOrigins').select2({
              placeholder: 'Select anything',
              data: Object.keys(GROCERY_ORIGIN_CATEGORIES),
              closeOnSelect: true
            });
          }

          if (icuisines) {
            $('#indexCuisines').select2({
              placeholder: 'Select anything',
              data: Object.keys(CUISINE_CATEGORIES),
              closeOnSelect: true
            });
          }

          Object.keys(CUISINE_CATEGORIES)
          .forEach(ucuisine => {
            if (icuisines) {
              // var option = document.createElement('option');
              // option.innerText = ucuisine;
              // option.value = ucuisine;
              // icuisines.appendChild(option);
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
              // var option = document.createElement('option');
              // option.innerText = ucat;
              // option.value = ucat;
              // cats.appendChild(option);
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
        //console.log("***44444");
      })();

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

  setShow(boolean) {
    this.show = boolean;
  }

  hasTag(tag) {
    return tag.test(this.tagString);
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
}

//add the marker on a restaurant and create a Restaurant object
//called by index.html initMap
function addRestMarker(restaurant) {
  let lat = restaurant.location[0];
  let lng =  restaurant.location[1];
  //console.log("****addRestMarker lat", lat);
  var marker = L.marker([lat, lng], {icon: new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
    })
  }); //.addTo(mymap);
  //console.log("****addRestMarker marker", marker);
  marker.on('click', (e) => {
    var images = restaurant.dishes;
    var slideshowContent = '';
    for(var i = 0; i < images.length; i++) {
      var img = images[i];
      let tags = img.tags.map(tag => `<mark>${tag}</mark>`).join(',');
      slideshowContent += '<div class="image' + (i === 0 ? ' ' : '') + '">' +
      '<img src="' + img.fileURL + '" />' +
      '<div class="caption">' + img.dish + '</div>' +
      '<div>' + tags + '</div>' +
      '</div>';
    }
    let best_adr = restaurant.adr;
    // let best_distance = null;
    // let best_adr = '';
    // for(var i = 0; i < itemsArray.length; i++)
    // {
    //   if(itemsArray[i].name === restaurant.name)
    //   {
    //     let distance = calcCrow(itemsArray[i].lat, itemsArray[i].lng, lat, lng).toFixed(1);
    //     if (!best_distance || distance < best_distance) {
    //       best_distance = distance;
    //       best_adr = itemsArray[i].adr;
    //     }
    //   }
    // }
    // sList = best_adr.split(",");
    // num = sList.length;
    // if (num > 2) {
    //   best_adr = sList[num-2] + "," + sList[num-1]
    // }
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
  // if(restaurant.coupon > 0){
  //   var label = {text: restaurant.coupon.toString(), fontSize: "20px", fontWeight: "bold"}
  //   //marker.setIcon(couponIcon2);
  //   //marker.setLabel(label);
  //   marker.bindTooltip(label,
  //       {
  //           permanent: true,
  //           direction: 'right'
  //       }
  //   );
  // }
  var restaurantObj = new Restaurant(marker, restaurant.name, restaurant.location, restaurant.id, restaurant.dishes, restaurant.cuisines);
  markers.push(restaurantObj);
  //console.log("****restaurantObj", restaurantObj);
  return marker;
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
            tag = 7;
            break;
        case "buddhist_friendly":
            isBuddhistFriendlyShown = !isBuddhistFriendlyShown;
            isClicked = isBuddhistFriendlyShown;
            tag = 8;
            break;
        case "all_natural":
            isAllNaturalShown = !isAllNaturalShown;
            isClicked = isAllNaturalShown;
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

    //index.html and grocery.html only
    function uploadTags() {
      if (document.getElementById('indexIngredients')) {
        tagList = $('#indexIngredients').val();
        $('#indexCategories').val().forEach(category => {
          db.collection('categories').doc(category).update({
            tags: firebase.firestore.FieldValue.arrayUnion(...tagList)
          })
        })
      }
      if (document.getElementById('groceryIngredients')) {
        tagList = $('#groceryIngredients').val();
        $('#groceryCategories').val().forEach(category => {
          db.collection('grocery_categories').doc(category).update({
            tags: firebase.firestore.FieldValue.arrayUnion(...tagList)
          })
        })
      }
    }

    //grocery.html Only
    // function filterGroceryCategories() {
    //   $('#groceryCategories').empty().trigger('change');
    //
    //   let newCategories = [];
    //   for (var key of Object.keys(GROCERY_CATEGORY_INGREDIENTS)) {
    //     newCategories.push(key);
    //   }
    //   $('#groceryCategories').select2({
    //     placeholder: 'Select anything',
    //     data: newCategories,
    //     closeOnSelect: true
    //   });
    //
    //   if ($('#groceryOrigins').val().length > 0) {
    //     document.querySelector('#groceryCategoryBlock').style.display = 'block';
    //   } else {
    //     document.querySelector('#groceryCategoryBlock').style.display = 'none';
    //   }
    // }

    //index.html Only
    function filterIndexCategories() {
      $('#indexCategories').empty().trigger('change');

      let newCategories = [];
      for (var key of Object.keys(CATEGORY_INGREDIENTS)) {
        newCategories.push(key);
      }
      $('#indexCategories').select2({
        placeholder: 'Select anything',
        data: newCategories,
        closeOnSelect: true
      });

      if ($('#indexCuisines').val().length > 0) {
        document.querySelector('#indexCategoryBlock').style.display = 'block';
      } else {
        document.querySelector('#indexCategoryBlock').style.display = 'none';
      }
    }

    //grocery.html Only
    // function filterGroceryIngredients() {
    //   $('#groceryIngredients').empty().trigger('change');
    //
    //   let newIngredients = [];
    //   $('#groceryCategories').val().forEach(indexCategory => {
    //     newIngredients.push(...(GROCERY_CATEGORY_INGREDIENTS[indexCategory] || []));
    //   });
    //   newIngredients = [...(new Set(newIngredients))].sort();
    //   $('#groceryIngredients').select2({
    //     placeholder: 'Select anything',
    //     data: newIngredients,
    //     tags: true,
    //     closeOnSelect: false
    //   });
    //
    //   if ($('#groceryCategories').val().length > 0) {
    //     document.querySelector('#groceryIngredientBlock').style.display = 'block';
    //   } else {
    //     document.querySelector('#groceryIngredientBlock').style.display = 'none';
    //   }
    // }

    //index.html Only
    function filterIndexIngredients() {
      $('#indexIngredients').empty().trigger('change');

      let newIngredients = [];
      $('#indexCategories').val().forEach(indexCategory => {
        newIngredients.push(...(CATEGORY_INGREDIENTS[indexCategory] || []));
      });
      newIngredients = [...(new Set(newIngredients))].sort();
      $('#indexIngredients').select2({
        placeholder: 'Select anything',
        data: newIngredients,
        tags: true,
        closeOnSelect: true
      });

      if ($('#indexCategories').val().length > 0) {
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

      let searchIngredients = document.getElementById('selectTags');
      while (searchIngredients.lastChild) {
        searchIngredients.removeChild(searchIngredients.lastChild);
      }

      let newIngredients = [];
      active_categories.forEach(category => {
        newIngredients.push(...(CATEGORY_INGREDIENTS[category] || []));
      });

      [...(new Set(newIngredients))].sort().forEach(tag => {
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
        // console.log("***markers", markers);
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
            item.marker.addTo(mymap);
          }
        }
      });
    }

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
