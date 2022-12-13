// var googleAPI = "AIzaSyBD4sp3WijVBagm6u9oqfslRBK4t8Dl1jE";

 // Search History Array
 let searchElHistory = JSON.parse(localStorage.getItem("city")) || [];

 // Saved Event History
 var savedEventResults = [];
 
 
 
 var searchElement = document.querySelector("#city");
 var searchBox = new google.maps.places.SearchBox(searchElement);
 console.log(searchElement.value);
 var genreSelector = document.getElementById("genres");

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

// Google Search Function
searchBox.addListener("places_changed", async function getCity() {
  var place = searchBox.getPlaces()[0];
  if (place == null) return;
  var latitude = place.geometry.location.lat();
  var longitude = place.geometry.location.lng();
  console.log(place);
  await fetch("https://maps.googleapis.com/maps/api/js", {
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

      let cityName = document.querySelector("#city").value;
      
      var city = {
        city: place.formatted_address,
        lat: latitude,
        lon: longitude,
      };

      if (!searchElHistory.includes(cityName)) {
      searchElHistory.push(city);
      window.localStorage.setItem("SearchHistory", JSON.stringify(searchElHistory));
      
      }

      console.log(data, place.formatted_address);
      showPosition(data, place.formatted_address);
      
    });
});

// var geoLocation = getLocation();

// function getLocation() {
//   if (navigator.geolocation) {
//     navigator.geolocation.getCurrentPosition(showPosition, showError);
//   } else {
//     var x = document.getElementById("location");
//     x.innerHTML = "Geolocation is not supported by this browser.";
//   }
// }

// function showError(error) {
//   switch (error.code) {
//     case error.PERMISSION_DENIED:
//       x.innerHTML = "User denied the request for Geolocation.";
//       break;
//     case error.POSITION_UNAVAILABLE:
//       x.innerHTML = "Location information is unavailable.";
//       break;
//     case error.TIMEOUT:
//       x.innerHTML = "The request to get user location timed out.";
//       break;
//     case error.UNKNOWN_ERROR:
//       x.innerHTML = "An unknown error occurred.";
//       break;
//   }
// }

// Genre Selector Function
genreSelector.addEventListener('click', function getOption() {
  return showPosition();
});

// Search Event through Ticketmaster
async function showPosition(data, place) {

  await $.ajax({
    type: "GET",
    url:
      "https://app.ticketmaster.com/discovery/v2/events.json?size=8&apikey=VK10fDjGhgdBljljVCFGpQUOfYaPJrpy&sort=date,asc&segmentName=Music&city="+searchElement.value+"&genreId="+genreSelector.value,
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

// Events Display and Navigation
var page = 0;

async function getEvents(page) {
  $("#events-panel").show();
  $("#attraction-panel").hide();

  if (page < 0) {
    page = 0;
    return;
  }
  if (page > 0) {
    if (page > getEvents.json.page.totalPages-1) {
      page=0;
    }
  }
  
  await $.ajax({
    type:"GET",
    url:"https://app.ticketmaster.com/discovery/v2/events.json?size=8&apikey=VK10fDjGhgdBljljVCFGpQUOfYaPJrpy&sort=date,asc&segmentName=Music&page="+page+"&city="+searchElement.value+"&genreId="+genreSelector.value,
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
  return false;
});

$("#next").click(function() {
  getEvents(++page);
  return false;
});

function showEvents(json) {
  var items = $("#events .list-group-item");
  items.hide();
  var events = json._embedded.events;
  var item = items.first();
  for (var i = 0; i < events.length; i++) {
    item.children('.list-group-item-heading').text(events[i].name + ' @ ' + events[i]._embedded.venues[0].name);
    item.children('.list-group-item-text').text(events[i].dates.start.localDate);
    try {
      item.children(".venue").text(events[i]._embedded.venues[0].name + " in " + events[i]._embedded.venues[0].city.name);
    } catch (err) {
      console.log(err);
    }
    item.show();
    item.off("click");
    item.click(events[i], function(eventObject) {
      eventObject.preventDefault();
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
    url:"https://app.ticketmaster.com/discovery/v2/attractions/"+id+".json?apikey=VK10fDjGhgdBljljVCFGpQUOfYaPJrpy",
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

var saveButton = document.getElementById('search-button')
// To store individual events, tied to showAttraction func
function storeEvent() {
  var eventTitle = document.getElementById('event-title').innerHTML;
  console.log(eventTitle);
  var eventGenre = document.getElementById('classification').innerHTML;
  console.log(eventGenre);

  var savedEvent = {
    eventTitle, eventGenre
  };

  saveButton.addEventListener("click", function(e) {
    e.preventDefault(); 
    
    if (savedEventResults.indexOf(savedEvent) !== -1) {
      return;
    }

    savedEventResults.push(savedEvent);

    localStorage.setItem('savedEventResults', JSON.stringify(savedEventResults));
    // renderMessage();
  });
  
};

function showAttraction(json) {
  $("#events-panel").hide();
  $("#attraction-panel").show();
  
  $("#attraction-panel").click(function() {
    getEvents(page);
  });
  
  $("#attraction .list-group-item-heading").first().text(json.name);
  $("#attraction-img img").first().attr('src',json.images[0].url);
  $("#classification").text(json.classifications[0].segment.name + " - " + json.classifications[0].genre.name + " - " + json.classifications[0].subGenre.name);

  return storeEvent();
}

getEvents(page);

//youtube
$(document).ready(function(){
  
  var API_KEY = "AIzaSyCpYksTEh0yvdKE-aenNvGT8npyyGSmYu0"
  var video = ''
  
  
  $("#event1").on("click", function (event) {
    event.preventDefault()
    
    var search = $("#event1").text()

    console.log(search)

    videoSearch(API_KEY,search,1)

})
  $("#event2").on("click", function (event) {
    event.preventDefault()
    
    var search = $("#event2").text()

    console.log(search)

    videoSearch(API_KEY,search,1)

})
  $("#event3").on("click", function (event) {
    event.preventDefault()
    
    var search = $("#event3").text()

    console.log(search)

    videoSearch(API_KEY,search,1)

})

  $("#event4").on("click", function (event) {
    event.preventDefault()
    
    var search = $("#event4").text()

    console.log(search)

    videoSearch(API_KEY,search,1)

})
  $("#event5").on("click", function (event) {
    event.preventDefault()
    
    var search = $("#event5").text()

    console.log(search)

    videoSearch(API_KEY,search,1)

})
  $("#event6").on("click", function (event) {
    event.preventDefault()
    
    var search = $("#event6").text()

    console.log(search)

    videoSearch(API_KEY,search,1)

})
  $("#event7").on("click", function (event) {
    event.preventDefault()
    
    var search = $("#event7").text()

    console.log(search)

    videoSearch(API_KEY,search,1)

})
  $("#event8").on("click", function (event) {
    event.preventDefault()
    
    var search = $("#event8").text()

    console.log(search)

    videoSearch(API_KEY,search,1)

})

})

function videoSearch(key,search,maxResults) { 
  $("#videos").empty()
  $.get("https://www.googleapis.com/youtube/v3/search?key=" + key + "&type=video&part=snippet&maxResults=" + maxResults + "&q=" +search,function(data){
    console.log(data)

    data.items.forEach(item => {
      video = `
      <iframe width="400" height="320" src="http://www.youtube.com/embed/${item.id.videoId}" frameborder="0"></iframe>

      `
      $("#videos").append(video)
    });
  })

}
