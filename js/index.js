

$(document).ready(function(){
  $('[data-toggle="popover"]').popover({
    trigger: 'focus'
  });

  // Prepare the preview for profile picture
  if (storageAvailable('localStorage')) {
    if(localStorage.getItem("dish")) {
      let currentImage = localStorage.getItem('dish');
      document.getElementById('dishPicturePreview').src = currentImage;
      var dateTime = new Date();
      dishImageFileName = dateTime + ".jpg";
      srcToFile(
        currentImage,
        dishImageFileName,
        'jpg'
      )
      .then(function(file){
        miniFiles["dish"] = file;
        console.log("miniFiles", miniFiles);
        let miniFileDish = miniFiles["dish"];
        let miniFileReceipt = miniFiles["receipt"];
        console.log("miniFileDish", miniFileDish);
        console.log("miniFileReceipt", miniFileReceipt);
        if (miniFileDish || miniFileReceipt) {
          document.getElementById('sendBtn').style.display = "block";
          document.getElementById('tags').style.display = "block";
        }
      })
    };
    if(localStorage.getItem("receipt")) {
      let currentImage = localStorage.getItem('receipt');
      document.getElementById('receiptPicturePreview').src = currentImage;
      var dateTime = new Date();
      receiptImageFileName = dateTime + ".jpg";
      srcToFile(
        currentImage,
        receiptImageFileName,
        'jpg'
      )
      .then(function(file){
        miniFiles["receipt"] = file;
        console.log("miniFiles", miniFiles);
        let miniFileDish = miniFiles["dish"];
        let miniFileReceipt = miniFiles["receipt"];
        console.log("miniFileDish", miniFileDish);
        console.log("miniFileReceipt", miniFileReceipt);
        if (miniFileDish || miniFileReceipt) {
          document.getElementById('sendBtn').style.display = "block";
          document.getElementById('tags').style.display = "block";
        }
      })
    }
  };
  $("#receipt-picture").change(function(){
    let dateTime = new Date();
    receiptImageFileName = dateTime + ".jpg";
    readPreviewURL(this, document.getElementById('receiptPicturePreview'), document.getElementById('upload-receipt'), document.getElementById('upload-receipt-checkmark'), "receipt", receiptImageFileName);
  });
  $("#dish-picture").change(function(){
    let dateTime = new Date();
    dishImageFileName = dateTime + ".jpg";
    readPreviewURL(this, document.getElementById('dishPicturePreview'), document.getElementById('upload-dish'), document.getElementById('upload-dish-checkmark'), "dish", dishImageFileName);
  });
});

window.addEventListener('load', initializeRestaurantsOnLoad);

function readPreviewURL(input, preview, label, checkmark, miniFile, imageFileName) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    reader.onload = function (e) {
      var quality = 30;
      var output_format = "image/png";
      var img = new Image();
      img.src = e.target.result;
      img.onload = function() {
        //preview.attr('src', jic.compress(img,quality,output_format).src).fadeIn('slow');
        preview.src = jic.compress(img,quality,output_format).src;
        if (storageAvailable('localStorage')) {
          localStorage.setItem(miniFile, preview.src);
        }
        srcToFile(
          preview.src,
          imageFileName,
          'jpg'
        )
        .then(function(file){
          miniFiles[miniFile] = file;
          let filesize = ((file.size/1024)/1024).toFixed(4);
          console.log(`Finished compressing : ${filesize} MB`);
        })

        preview.onload = function() {
          document.getElementById('sendBtn').style.display = "block";
          document.getElementById('tags').style.display = "block";
          label.classList = "badge badge-pill badge-light";
          checkmark.style.display = "inline";
        }
      }
    }
    reader.readAsDataURL(input.files[0]);
  }
}
var zoom = 11;

  if (storageAvailable('localStorage')) {
    zoom = localStorage.getItem("mapZoom");
  }

var mymap = L.map('mapid', {zoom: zoom, worldCopyJump: true});
mymap.on('moveend', function(ev) {
  if (storageAvailable('localStorage')) {
    localStorage.setItem("mapZoom", mymap.getZoom());
  }
});
L.tileLayer('https://b.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxNativeZoom: 18,
    maxZoom: 20,
    attribution: '&copy; <a target="_blank" rel="noopener" href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(mymap);
var browserGeolocationSuccess = function(position) {
  currentLocation = [position.coords.latitude, position.coords.longitude];
  onLocationFound("You are here.");
};

var browserGeolocationFail = function(error) {
  onLocationFound("Refresh to find your location");
}

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    browserGeolocationSuccess, browserGeolocationFail,
    {maximumAge: 70000, timeout: 4000, enableHighAccuracy: true}
  );
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

  function storageAvailable(type) {
      var storage;
      try {
          storage = window[type];
          var x = '__storage_test__';
          storage.setItem(x, x);
          storage.removeItem(x);
          return true;
      }
      catch(e) {
          return e instanceof DOMException && (
              // everything except Firefox
              e.code === 22 ||
              // Firefox
              e.code === 1014 ||
              // test name field too, because code might not be present
              // everything except Firefox
              e.name === 'QuotaExceededError' ||
              // Firefox
              e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
              // acknowledge QuotaExceededError only if there's something already stored
              (storage && storage.length !== 0);
      }
  }


const db = firebase.firestore();
var storageRef = firebase.storage().ref();
var storage = firebase.storage();
initMap();
// DOM element shortcuts.
var helloMessageInput = document.getElementById('helloMessageInput');
var helloMessageOutput= document.getElementById('helloMessageOutput');
var preview= document.getElementById('preview');
var bar= document.getElementById('progressBar');
var miniFiles = [];
var dishInput = document.getElementById('dishInput');
var searchInput = document.getElementById('searchInput');
var restaurantInput = document.getElementById('restaurantInput');
var locationInput = document.getElementById('locationInput');
var map;
var currentLocation = [22.276, 114.173];
var contentString = '<div>' +
                restaurantInput.value +
                '</div>' +
                '<div>' +
                dishInput.value +
                '</div>' +
                '<div>' +
                preview.value +
                '</div>' ;

var dishImageFileName = "";
var receiptImageFileName = "";
var isGlutenFree;
var isEggFree;
var isDairyFree;
var isTreenutFree;
var isPeanutFree;
var isSoyFree;
var isRaw;
var isVegan;
var isBuddhistFriendly;
var isAllNatural;
var referenceID;
// added in 23/7
var imgURL;

var request = {
    query: restaurantInput.value,
    fields: ['name', 'formatted_address', 'geometry'],
  };
var service;
var blueIcon;
var greenIcon;

var markers = [];
var showing = [];
var circle;
var current;
var currentLeaflet;
var restaurantHash = {};
const mode = "add";

function makeProgress(i){
  bar.style.width = i+'%';
  bar.innerText = i+'%';
  bar.setAttribute('aria-valuenow', i);
}

function srcToFile(src, fileName, mimeType) {
    return (fetch(src)
    .then(function(res){return res.arrayBuffer();})
    .then(function(buf){return new File([buf], fileName, {type:mimeType});})
  );
}

//create the map
function initMap() {
  console.log("initializing from file");
  fetch('/data/sort-veggie.json').then(function(response) {
    return response.json();
  }).then(function(data) {
    itemsArray = data.map(item => {
      return { "name": item.SS, "dist": item.DIST, "adr": item.ADR, "lat": item.lat, "lng": item.lng }
    })
  });

  console.log('initializing markers');
  let dishArray = [];
  db.collection('restaurants').get().then((snapshot) => {
    snapshot.docs.forEach(doc => {
      var restaurantData = doc.data();
      //split name and adr in popup if new db restaurant
      let dbAdr = restaurantData.adr;
      let dbName = restaurantData.name;
      if ((dbAdr === "") && dbName.includes(",")) {
        restaurantData.adr = dbName.substring(dbName.indexOf(",") + 1);
        restaurantData.name = dbName.substring(0, dbName.indexOf(","));
      }
      //console.log("***restaurantData", restaurantData);
      let marker = addRestMarker(restaurantData);
      marker.addTo(mymap);
      let restaurantDishes = restaurantHash[restaurantData.name];
      restaurantDishes = restaurantDishes || [];
      restaurantData.dishes.forEach(data => {
        dishArray.push(data.dish);
        restaurantDishes.push(data.dish);
      });
      restaurantHash[restaurantData.name] = [...(new Set(restaurantDishes))].sort();

      //console.log("****itemsArray", itemsArray);
      //restaurantData may have been changed above
      //if new db restaurant, check if dbAdr is empty instead
      //if (! itemsArray.some(item => ((restaurantData.name === item.name) && (restaurantData.adr === item.adr)))) {
      //design assumption new restaurant not on file has empty adr in db, in-memory itemsArray, and input field
      let existing = itemsArray.find(item => (`${dbName}, ${dbAdr}` === `${item.name}, ${item.adr}`));
        //console.log("***existing", existing);
      if (!existing) {
        let newItem = { "name": dbName, "dist": "", "adr": dbAdr, "lat": restaurantData.location[0], "lng": restaurantData.location[1] };
        //console.log("newItem", newItem);
        itemsArray.push(newItem);
      };
    });
  }).then(() => {
    dishArray = [...(new Set(dishArray))].sort();
    //index.html only
    autocomplete(document.getElementById("restaurantInput"), itemsArray);
    autocomplete2(document.getElementById("dishInput"), dishArray);
  });
}

function initNewMarker(restaurantData) {
  console.log("****initNewMarker", restaurantData);
  let dishArray = [];
  let marker = addRestMarker(restaurantData);
  marker.addTo(mymap);
  let restaurantDishes = restaurantHash[restaurantData.name];
  restaurantDishes = restaurantDishes || [];
  restaurantData.dishes.forEach(data => {
    dishArray.push(data.dish);
    restaurantDishes.push(data.dish);
  });
  restaurantHash[restaurantData.name] = [...(new Set(restaurantDishes))].sort();
  dishArray = [...(new Set(dishArray))].sort();
  autocomplete2(document.getElementById("dishInput"), dishArray);
}

function initializeRestaurantsOnLoad() {
  console.log("window load");
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js')
    .then(function(registration) {
      console.log('serviceWorker Registered');
    })
    .catch(function(error) {
      console.log('serviceWorker Registration failed: ', error);
    });
    navigator.serviceWorker.ready.then( () => {
      console.log("serviceWorker ready");
    })
  }
}

function upload() {
  uploadTags();
  if (helloMessageInput.value.length == 0) {
    helloMessageOutput.innerText = "Looks like you haven't provided a review";
    return;
  }
  else {
    helloMessage = helloMessageInput.value;
  }
  var metadata = {
    contentType: 'image/jpeg'
  };
  const imagePaths = [];
  const storageRef = storage.ref();
  for (let key of Object.keys(miniFiles)) {
    let img = miniFiles[key];
    let fileRef = storageRef.child(img.name);
    fileRef.put(img).on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
      function(snapshot) {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        helloMessageOutput.innerText = `Uploading Receipt ...`;
        console.log('Upload is ' + progress + '% done');
        makeProgress(Math.round(progress));
        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED: // or 'paused'
          console.log('Upload is paused');
          break;
          case firebase.storage.TaskState.RUNNING: // or 'running'
          console.log('Upload is running');
          break;
        }
      }, function(error) {
        switch (error.code) {
          case 'storage/unauthorized':
          // User doesn't have permission to access the object
          break;

          case 'storage/canceled':
          // User canceled the upload
          break;

          case 'storage/unknown':
          // Unknown error occurred, inspect error.serverResponse
          break;
        }
      }, function() {
        fileRef.getDownloadURL().then(function(singleImgPath) {
          imagePaths[key] = singleImgPath;
          if (Object.keys(imagePaths).length == Object.keys(miniFiles).length) {
            //current location is by default set to map center
            //currentLeaflet is undefined if start typing new restaurant without selecting
            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(
                (position) => {
                  console.log("navigator.geolocation.getCurrentPosition failed");
                  currentLocation = [position.coords.latitude, position.coords.longitude];
                  addRestaurantToDB(imagePaths['dish'] || "");
                  addReceiptToDB(imagePaths);
                },
                (error) => {
                  console.log("navigator.geolocation.getCurrentPosition failed");
                  currentLocation = [mymap.getCenter().lat, mymap.getCenter().lng];
                  addRestaurantToDB(imagePaths['dish'] || "");
                  addReceiptToDB(imagePaths);
                },
                {maximumAge: 70000, timeout: 4000, enableHighAccuracy: true}
              );
            } else {
              console.log("navigator.geolocation not accessible");
              currentLocation = [mymap.getCenter().lat, mymap.getCenter().lng];
              addRestaurantToDB(imagePaths['dish'] || "");
              addReceiptToDB(imagePaths);
            }
            //addRestaurantToDB(imagePaths['dish'] || "");
            //add receipt must follow add restaurant
            //use whatever currentLocation resulting from it
            //addReceiptToDB(imagePaths);
            //
            // if (storageAvailable('localStorage')) {
            //   localStorage.removeItem("dish");
            //   localStorage.removeItem("receipt");
            // }
            //
            // delete miniFiles["dish"];
            // delete miniFiles["receipt"];
            // document.getElementById('dishPicturePreview').src = "https://mdbootstrap.com/img/Photos/Others/placeholder.jpg";
            // document.getElementById('receiptPicturePreview').src = "https://mdbootstrap.com/img/Photos/Others/placeholder-avatar.jpg";
          }
        });
      }
    )
  }
}

//only called from upload()
function addRestaurantToDB(dishImgURL) {
  let restaurantInputValue = restaurantInput.value.trim();
  let uploadCuisine = document.getElementById('indexCuisines').value;
  let dishes = {
    dish: dishInput.value,
    fileURL: dishImgURL,
    category: category,
    tags: ($('#indexIngredients').val().split(","))
  };
  let newRestaurant = {
    name: restaurantInputValue,
    adr: "",
    location: currentLocation,
    dishes: [dishes],
    coupon:  10,
    cuisines: [uploadCuisine]
  };
  //design assumption new restaurant not on file has empty adr in db, in-memory itemsArray, and input field
  let existing = itemsArray.find(item => {
    if (item.adr === "") {
      return restaurantInputValue === item.name;
    } else {
      return restaurantInputValue === `${item.name}, ${item.adr}`;
    }
  });
    console.log("***existing", existing);
  if (existing) {
    currentLocation = [existing.lat, existing.lng];
    newRestaurant.name = existing.name;
    newRestaurant.adr = existing.adr;
    newRestaurant.location = currentLocation;
  } else {
    //currentLocation was updated to either device or map center previously

    //split name and adr in popup if new db restaurant
    // let itemAdr = "";
    // let itemName = restaurantInputValue;
    // if (restaurantInputValue.includes(",")) {
    //   itemAdr = restaurantInputValue.substring(restaurantInputValue.indexOf(",") + 1);
    //   itemName = restaurantInputValue.substring(0, restaurantInputValue.indexOf(","));
    // }
    let newItem = { "name": restaurantInputValue, "dist": "", "adr": "", "lat": currentLocation[0], "lng": currentLocation[1] };
    itemsArray.push(newItem);
    autocomplete(document.getElementById("restaurantInput"), itemsArray);
  }

  db.collection("restaurants")
  .where("name", "==", newRestaurant.name)
  .where("adr", "==", newRestaurant.adr)
  .get().then(querySnapshot => {
    console.log("***querySnapshot", querySnapshot.docs.length);
    if (querySnapshot.docs.length) {
      querySnapshot.forEach(function(doc) {
        var restaurantData = doc.data();
        var couponRemains = doc.data().coupon;
        var getCoupon = false;
        if(couponRemains > 0){
          couponRemains -= 1;
          getCoupon = true;
        }
        db.collection("restaurants").doc(doc.id).update({
          dishes: firebase.firestore.FieldValue.arrayUnion(dishes),
          coupon:  couponRemains,
          cuisines: firebase.firestore.FieldValue.arrayUnion(uploadCuisine)
        });
      })
    } else {
      // adding known restaurants on file but not in DB yet
      //should be using currentLeaflet location instead of map center
      //currentLeaflet should already be defined from either keydown or clicking on active options
      //currentLocation = [currentLeaflet.getLatLng().lat, currentLeaflet.getLatLng().lng];
      //newRestaurant.location = currentLocation;
      db.collection("restaurants").add(newRestaurant)
      .then(function(docRef) {
        console.log("Adding restaurant on file:", docRef.id);
        initNewMarker(newRestaurant);
      })
      .catch(function(error) {
        console.error("Error adding document: ", error);
      });
    }
  })
}

function addReceiptToDB(imagePaths) {
  let uploadCuisine = document.getElementById('indexCuisines').value;
  let restaurantInputValue = restaurantInput.value.trim();
  let receiptImgURL = imagePaths["receipt"] || "";
  let dishImgURL = imagePaths["dish"] || "";

  db.collection("receipts").add({
    //email: emailInput.value,
    helloMessage: helloMessage,
    fileURL: dishImgURL,
    receiptImgURL: receiptImgURL,
    dish: dishInput.value,
    location: currentLocation,
    restaurant: restaurantInputValue,
    dishImageName: dishImageFileName,
    receiptImageName: receiptImageFileName,
    tags: ($('#indexIngredients').val().split(",")),
    approved: false,
    category: category,
    cuisine: uploadCuisine
  })
  .then(function(docRef) {
    console.log("Receipt written with ID: ", docRef.id);
    helloMessageOutput.innerText = `File received with ID: ${docRef.id}`;
  })
  .catch(function(error) {
    console.error("Error adding document: ", error);
    helloMessageOutput.innerText = `Error adding document: ${error}`;
  });
}

function isAccurate(pos1, pos2) {
    var latDiff = Math.abs(pos1[0] - pos2[0]);
    var lngDiff = Math.abs(pos1[1] - pos2[1]);
    return (latDiff < 0.0001 && lngDiff < 0.0001);
}
