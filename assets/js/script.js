//Responsive Navigation
var navbarSlide = () => {
  var burger = document.querySelector('.burger');
  var nav = document.querySelector('.navbar');
  const navLinks = document.querySelectorAll('.navbar li');

  //Hamburger Toggle
  burger.addEventListener('click', () => {
    nav.classList.toggle('nav-active');

    //Menu Animation
    navLinks.forEach((link, index) => {
      if (link.style.animation){
      link.style.animation ='';
      } 
      else {
      link.style.animation = 'navLinkFade 0.5s ease forwards ${index / 5 + 1.2}s';
      }
    });

    //Hamburger Toggle Animation
    burger.classList.toggle('toggle');
  });
}

navbarSlide();



var googleAPI = "AIzaSyBD4sp3WijVBagm6u9oqfslRBK4t8Dl1jE";

var searchElement = document.querySelector("#city");
var searchBox = new google.maps.places.SearchBox(searchElement);
console.log(searchElement.value);

// Google Search Function
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

var geoLocation = getLocation();

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

// Search Event through Ticketmaster
function showPosition(data, place) {

  $.ajax({
    type: "GET",
    url:
      "https://app.ticketmaster.com/discovery/v2/events.json?size=5&apikey=pLOeuGq2JL05uEGrZG7DuGWu6sh2OnMz&segmentName=Music&city="+searchElement.value,
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

// function showEvents(json) {
//   for (var i = 0; i < json.page.size; i++) {
//     $("#eventone").append("<p>" + json._embedded.events[i].name + "</p>");
//     $("#eventtwo").append("<p>" + json._embedded.events[i].dates.start.localDate + "</p>");
//     $("#eventthree").append("<p>" + json._embedded.events[i]._embedded.venues[0].name + "</p>");
//   }
// }

// Events Display and Navigation
var page = 1;

function getEvents(page) {
  $("#events-panel").show();
  $("#attraction-panel").hide();

  if (page < 1) {
    page = 1;
    return;
  }
  if (page > 1) {
    if (page > getEvents.json.page.totalPages-1) {
      page=1;
    }
  }
  
  $.ajax({
    type:"GET",
    url:"https://app.ticketmaster.com/discovery/v2/events.json?size=5&apikey=pLOeuGq2JL05uEGrZG7DuGWu6sh2OnMz&segmentName=Music&page="+page+'&city='+searchElement.value,
    async:true,
    dataType: "json",
    success: function(json) {
          getEvents.json = json;
  			  showEvents(json);
  		   },
    error: function(xhr, status, err) {
  			  console.log(err);
  		   }
  });
}

$("#prev").click(function() {
  getEvents(--page);
});

$("#next").click(function() {
  getEvents(++page);
});

function showEvents(json) {
  var items = $("#events .list-group-item");
  items.hide();
  var events = json._embedded.events;
  var item = items.first();
  for (var i=0;i<events.length;i++) {
    item.children('.list-group-item-heading').text(events[i].name);
    item.children('.list-group-item-text').text(events[i].dates.start.localDate);
    try {
      item.children(".venue").text(events[i]._embedded.venues[0].name + " in " + events[i]._embedded.venues[0].city.name);
    } catch (err) {
      console.log(err);
    }
    item.show();
    item.off("click");
    item.click(events[i], function(eventObject) {
      console.log(eventObject.data);
      try {
        getAttraction(eventObject.data._embedded.attractions[0].id);
      } catch (err) {
      console.log(err);
      }
    });
    item=item.next();
  }
}

function getAttraction(id) {
  $.ajax({
    type:"GET",
    url:"https://app.ticketmaster.com/discovery/v2/attractions/"+id+".json?apikey=pLOeuGq2JL05uEGrZG7DuGWu6sh2OnMz",
    async:true,
    dataType: "json",
    success: function(json) {
          showAttraction(json);
  		   },
    error: function(xhr, status, err) {
  			  console.log(err);
  		   }
  });
}

function showAttraction(json) {
  $("#events-panel").hide();
  $("#attraction-panel").show();
  
  $("#attraction-panel").click(function() {
    getEvents(page);
  });
  
  $("#attraction .list-group-item-heading").first().text(json.name);
  $("#attraction img").first().attr('src',json.images[0].url);
  $("#classification").text(json.classifications[0].segment.name + " - " + json.classifications[0].genre.name + " - " + json.classifications[0].subGenre.name);
}

getEvents(page);