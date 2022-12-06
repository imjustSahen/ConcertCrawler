var googleAPI = "AIzaSyBD4sp3WijVBagm6u9oqfslRBK4t8Dl1jE";

var searchElement = document.querySelector("#city");
var searchBox = new google.maps.places.SearchBox(searchElement);
console.log(searchElement.value);

searchBox.addListener("places_changed", function getCity() {
  var place = searchBox.getPlaces()[0];
  if (place == null) return;
  var latitude = place.geometry.location.lat();
  var longitude = place.geometry.location.lng();
  console.log(place);
  fetch("https://maps.googleapis.com/maps/api/js", {
    mode: "no-cors",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      latitude: latitude,
      longitude: longitude,
    }),
  })
    .then(function (res) {
      console.log(res);
      // return res.json();
    })
    .then(function (data) {
      console.log(data, place.formatted_address);
      showPosition(data, place.formatted_address);
      
    });
});


function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, showError);
  } else {
    var x = document.getElementById("location");
    x.innerHTML = "Geolocation is not supported by this browser.";
  }
}

function showError(error) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      x.innerHTML = "User denied the request for Geolocation.";
      break;
    case error.POSITION_UNAVAILABLE:
      x.innerHTML = "Location information is unavailable.";
      break;
    case error.TIMEOUT:
      x.innerHTML = "The request to get user location timed out.";
      break;
    case error.UNKNOWN_ERROR:
      x.innerHTML = "An unknown error occurred.";
      break;
  }
}

function showPosition(data, place) {

  $.ajax({
    type: "GET",
    url:
      "https://app.ticketmaster.com/discovery/v2/events.json?size=10&apikey=pLOeuGq2JL05uEGrZG7DuGWu6sh2OnMz&city="+searchElement.value,
    async: true,
    dataType: "json",
    success: function (json) {
      console.log(json);
      var e = document.getElementById("events");
      e.innerHTML = json.page.totalElements + " events found.";
      showEvents(json);
      // initMap(position, json);
    },
    error: function (xhr, status, err) {
      console.log(err);
    },
  });
}

function showEvents(json) {
  for (var i = 0; i < json.page.size; i++) {
    $("#events").append("<p>" + json._embedded.events[i].name + "</p>");
  }
}

// function initMap(position, json) {
//   var mapDiv = document.getElementById("map");
//   var map = new google.maps.Map(mapDiv, {
//     center: { lat: position.coords.latitude, lng: position.coords.longitude },
//     zoom: 10,
//   });
//   for (var i = 0; i < json.page.size; i++) {
//     addMarker(map, json._embedded.events[i]);
//   }
// }

// function addMarker(map, event) {
//   var marker = new google.maps.Marker({
//     position: new google.maps.LatLng(
//       event._embedded.venues[0].location.latitude,
//       event._embedded.venues[0].location.longitude
//     ),
//     map: map,
//   });
//   marker.setIcon("http://maps.google.com/mapfiles/ms/icons/red-dot.png");
//   console.log(marker);
// }

// showPosition({coords: {latitude: 0, longitude: 0}});