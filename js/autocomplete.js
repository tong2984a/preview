function autocomplete(inp, restaurants) {
  /*the autocomplete function takes two arguments,
  the text field element and an array of possible autocompleted values:*/
  var currentFocus;
  // var sorted_restaurants = restaurants.sort(
  //   (a, b) => (a.location[0] < b.location[0]) ? 1 : ((a.location[1] < b.location[1]) ? 1 : -1)
  // );
  var cachedRestaurants = JSON.parse(localStorage.getItem('restaurants'));
  var sorted_restaurants = cachedRestaurants.sort(
    (a, b) => (a.lat < b.lat) ? 1 : ((a.lng < b.lng) ? 1 : -1)
  );
  var arr = sorted_restaurants.map(el => el.name);
  var filtered_restaurants = [];
    console.log(sorted_restaurants);
  /*execute a function when someone writes in the text field:*/
  inp.addEventListener("input", function(e) {
    console.log("&&&&&&&input&&&&");
    var a, b, i, val = this.value;
    /*close any already open lists of autocompleted values*/
    closeAllLists();
    filtered_restaurants = [];
    if (!val) { return false;}
    currentFocus = -1;
    /*create a DIV element that will contain the items (values):*/
    a = document.createElement("DIV");
    a.setAttribute("id", this.id + "autocomplete-list");
    a.setAttribute("class", "autocomplete-items");
    /*append the DIV element as a child of the autocomplete container:*/
    this.parentNode.appendChild(a);
    /*for each item in the array...*/
    for (i = 0; i < arr.length; i++) {
      /*check if the item starts with the same letters as the text field value:*/
      if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
        /*create a DIV element for each matching element:*/
        b = document.createElement("DIV");
        /*make the matching letters bold:*/
        b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
        b.innerHTML += arr[i].substr(val.length);
        /*insert a input field that will hold the current array item's value:*/
        b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
        /*execute a function when someone clicks on the item value (DIV element):*/
        let activeLocation = {lat:sorted_restaurants[i].lat, lng:sorted_restaurants[i].lng};
        b.addEventListener("click", function(e) {
          /*insert the value for the autocomplete text field:*/
          inp.value = this.getElementsByTagName("input")[0].value;
          /*close the list of autocompleted values,
          (or any other open lists of autocompleted values:*/
          closeAllLists();

          console.log("****b click***");
          map.setCenter(activeLocation);
          let activeMarker = new google.maps.Marker({
            position: activeLocation,
            map: map,
            icon: greenIcon,
            animation: google.maps.Animation.DROP
          });
          activeMarker.setAnimation(google.maps.Animation.BOUNCE);
          stopAnimation(activeMarker);
          setTimeout(function () {
            activeMarker.setMap(null);
          }, 6000);
        });
        a.appendChild(b);
        filtered_restaurants.push(sorted_restaurants[i]);
      }
    }
  });
  inp.addEventListener("click", function(e) {
    console.log("&&&&&&&input click&&&&");
    var a, b, i, val = this.value;
    /*close any already open lists of autocompleted values*/
    closeAllLists();
    filtered_restaurants = [];
    //if (!val) { currentFocus = -1; }
    let valLength = val.length;
    /*create a DIV element that will contain the items (values):*/
    a = document.createElement("DIV");
    a.setAttribute("id", this.id + "autocomplete-list");
    a.setAttribute("class", "autocomplete-items");
    /*append the DIV element as a child of the autocomplete container:*/
    this.parentNode.appendChild(a);
    /*for each item in the array...*/
    for (i = 0; i < arr.length; i++) {
      /*check if the item starts with the same letters as the text field value:*/

      if (valLength == 0 || (arr[i].substr(0, valLength).toUpperCase() == val.toUpperCase())) {
        /*create a DIV element for each matching element:*/
        b = document.createElement("DIV");
        /*make the matching letters bold:*/
        b.innerHTML = "<strong>" + arr[i].substr(0, valLength) + "</strong>";
        b.innerHTML += arr[i].substr(valLength);
        /*insert a input field that will hold the current array item's value:*/
        b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
        /*execute a function when someone clicks on the item value (DIV element):*/
        let activeLocation = {lat:sorted_restaurants[i].lat, lng:sorted_restaurants[i].lng};
        b.addEventListener("click", function(e) {
          /*insert the value for the autocomplete text field:*/
          inp.value = this.getElementsByTagName("input")[0].value;
          /*close the list of autocompleted values,
          (or any other open lists of autocompleted values:*/
          closeAllLists();

          console.log("****a click***");
          map.setCenter(activeLocation);
          let activeMarker = new google.maps.Marker({
            position: activeLocation,
            map: map,
            icon: greenIcon,
            animation: google.maps.Animation.DROP
          });
          activeMarker.setAnimation(google.maps.Animation.BOUNCE);
          stopAnimation(activeMarker);
          setTimeout(function () {
            activeMarker.setMap(null);
          }, 6000);
        });
        a.appendChild(b);
        filtered_restaurants.push(sorted_restaurants[i]);
      }
    }
  });
  /*execute a function presses a key on the keyboard:*/
  inp.addEventListener("keydown", function(e) {
    console.log("&&&&&&&keydown&&&&");
      var x = document.getElementById(this.id + "autocomplete-list");
      if (x) x = x.getElementsByTagName("div");
      if (e.keyCode == 40) {
        /*If the arrow DOWN key is pressed,
        increase the currentFocus variable:*/
        currentFocus++;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 38) { //up
        /*If the arrow UP key is pressed,
        decrease the currentFocus variable:*/
        currentFocus--;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 13) {
        /*If the ENTER key is pressed, prevent the form from being submitted,*/
        e.preventDefault();
        if (currentFocus > -1) {
          /*and simulate a click on the "active" item:*/
          if (x) x[currentFocus].click();
        } else {
          const data = JSON.parse(localStorage.getItem('restaurants'))
          console.log(data);
        }
      }
  });
  function addActive(x) {
  console.log("&&&&&&&addActive&&&&");
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");

    //let activeMarker = filtered_restaurants[currentFocus].marker;
    let activeLocation = {lat:filtered_restaurants[currentFocus].lat, lng:filtered_restaurants[currentFocus].lng};
    map.setCenter(activeLocation);
    let activeMarker = new google.maps.Marker({
      position: activeLocation,
      map: map,
      icon: greenIcon,
      animation: google.maps.Animation.DROP
    });
    activeMarker.setAnimation(google.maps.Animation.BOUNCE);
    stopAnimation(activeMarker);
    setTimeout(function () {
        activeMarker.setMap(null);
    }, 6000);
  }
  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  /*execute a function when someone clicks in the document:*/
  //clicking anywhere other than input box and autocomplete list
  document.addEventListener("click", function (e) {
    console.log("&&&&&&&click&&&&");
    closeAllLists(e.target);
  });
}
