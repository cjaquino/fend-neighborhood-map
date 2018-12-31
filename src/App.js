import React, { Component } from 'react';
import LocationList from './LocationList';
import axios from 'axios';
import './App.css';

// loads script tag into index.html with provided url
function loadScript(url) {
  let index = window.document.querySelector("script");
  let script = window.document.createElement("script");
  script.src = url
  script.async = true;
  script.defer = true;
  index.parentNode.insertBefore(script, index);
};

class App extends Component {
  state = {
    locations: [],
    filtered_locs: [],
    markers: [],
    zipCodes: [],
    map:undefined
  }

  componentDidMount() {
    this.getLocations();
  }

  loadMap = () => {
    window.initMap = this.initMap;
    loadScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyBnkgMnhHckV_jd9qEFlop5r_B8Ju7ENXE&callback=initMap");
  }

  // this function was based off of the tutorial from https://www.youtube.com/watch?v=dAhMIF0fNpo
  // using axios instead of fetch because it performs automatic trasforms to json data
  // https://medium.com/@thejasonfile/fetch-vs-axios-js-for-making-http-requests-2b261cdd3af5
  getLocations = () => {
    const endpoint = "https://api.foursquare.com/v2/venues/explore?";
    const parameters = {
      client_id:"XB5DC5RP2SBEBGQZSWXNACEMV5SNV2COAXUBK0GNR1GNBVZM",
      client_secret:"QETHWPLLKSLHVP3DFGDFLIHY0B25RAEW1MXW5MZFGPHXVFNN",
      query:"bars",
      ll:"33.7570183,-84.4013661",
      limit: 10,
      v:"20181229"
    }

    axios.get(endpoint + new URLSearchParams(parameters))
      .then(response => {
        this.setState({
          locations: response.data.response.groups[0].items,
          filtered_locs: response.data.response.groups[0].items
        }, this.loadMap())
      })
      .catch(err => {
        console.log("ERROR: " + err);
        alert("ERROR: There was a problem with the FourSquare request " + err)
      })
  }

  // handles onChange event on the dropdown menu
  // updates filtered_locs based on zipcode selected
  onZipSelect = (zipCode) => {
    // reset filtered_locs state before filtering
    this.setState({
      filtered_locs: this.state.locations
    })

    // filter locations
    let filtered_locs = this.state.locations.filter((location) => {
      return location.venue.location.postalCode === zipCode
    })
    if(zipCode){
      this.updateMarkers(filtered_locs, this.state.markers, this.state.map);
      this.setState({filtered_locs: filtered_locs})
    } else {
      this.showAllMarkers();
    }

    // console.log(this.state.filtered_locs[0].venue.name);
  }

  // display markers on map relative to filtered_locs
  updateMarkers = (filtered_locs, markers, map) => {
    const filtered_names = filtered_locs.map((loc) => {
      return loc.venue.name;
    })

    //Hide all markers
    this.hideMarkers();

    //show markers with matching names
    filtered_names.forEach((name) => {
      markers.forEach((marker) => {
        if(name === marker.title) {
          // f_locs.push(marker);
          marker.setMap(map)
        };
      })
    })
  }

  // hides all markers
  hideMarkers = () => {
    this.state.markers.forEach((marker) => {
      marker.setMap(null);
    })
  }

  // displays all markers
  showAllMarkers = () => {
    this.state.markers.forEach((marker) => {
      marker.setMap(this.state.map);
    })
  }

  // create a marker icon
  makeMarkerIcon = (color) => {
    const markerImage = new window.google.maps.MarkerImage(
      'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ color +
      '|40|_|%E2%80%A2',
      new window.google.maps.Size(21, 34),
      new window.google.maps.Point(0, 0),
      new window.google.maps.Point(10, 34),
      new window.google.maps.Size(21,34));
    return markerImage;
  }

  // handles onClick event of list item in sidebar
  // trigger a map marker click event when list item click event is triggered
  onListClick = (e) => {
    // Set selected marker color
    const marker = this.state.markers.find((marker) => {
      return marker.title === e.target.id
    })

    window.google.maps.event.trigger(marker,'click');
  }

  initMap = () => {
    const map = new window.google.maps.Map(document.getElementById('map'), {
        center: {lat:33.716502, lng:-84.38},
        zoom: 12
    });
    this.setState({map});

    let markers = [];
    let zipCodes = [];
    let bounds = new window.google.maps.LatLngBounds();
    let infoWindow = new window.google.maps.InfoWindow();

    this.state.locations.forEach((location) => {
      let infoWindowContent =
        `<div id='info-window' aria-labelledby='infowindow'>
            <h3 id='info-title'>${location.venue.name}</h3>
            <hr>
            <p id='info-addr-txt'><strong>Address:</strong></p>
            <p>${location.venue.location.formattedAddress[0]}</p>
            <p>${location.venue.location.formattedAddress[1]}</p>
            <p>${location.venue.location.formattedAddress[2]}</p>
            <hr>
            <p>Information retrieved from FourSquare API<p>
        </div>`;

      const defaultIcon = this.makeMarkerIcon('f00');
      const selectedIcon = this.makeMarkerIcon('00f');

      let marker = new window.google.maps.Marker({
        position: location.venue.location,
        map: map,
        title: location.venue.name,
        animation: window.google.maps.Animation.DROP,
        icon: defaultIcon
      });

      markers.push(marker);

      marker.addListener('click', function() {
        let listItem = document.getElementById(location.venue.name);
        let listItems = [].slice.call(document.getElementById('locations-list').childNodes)

        // display infoWindow with proper content
        infoWindow.setContent(infoWindowContent);
        infoWindow.open(map, marker);

        // reset markers' color
        markers.forEach((marker) => {
          marker.setIcon(defaultIcon);
        })

        //reset list items' color
        listItems.forEach((li) => {
          li.style.backgroundColor = "#333";
        })

        // set listItem backgroundColor
        listItem.style.backgroundColor =  "#55D";
        this.setIcon(selectedIcon);
      });

      // create zipcode array to filter out later for unique zipcodes present
      zipCodes.push(location.venue.location.postalCode);
    })

    this.setState({markers:markers})

    // get distinct zipcodes from zipcodes array
    // https://stackoverflow.com/questions/1960473/get-all-unique-values-in-a-javascript-array-remove-duplicates?answertab=votes#tab-top
    this.setState({
      zipCodes: zipCodes.filter((value, index, self) => {
        return self.indexOf(value) === index
      })
    })

    //adjust bounds to fit and display all markers
    for(let i = 0; i < markers.length; i++) {
      bounds.extend(markers[i].position);
    }
    map.fitBounds(bounds);
  }

  render() {
    return (
      <main>
        <div id="map" aria-labelledby="google_map" role="application"></div>
        <LocationList
          locations={this.state.filtered_locs}
          zipCodes={this.state.zipCodes}
          onZipSelect={this.onZipSelect}
          onListClick={this.onListClick}
        />
      </main>
    );
  }
}

export default App;
