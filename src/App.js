import React, { Component } from 'react';
import LocationList from './LocationList';
import axios from 'axios';
import './App.css';

function loadScript(url) {
  let index = window.document.querySelector("script");
  let script = window.document.createElement("script");
  script.src = url
  script.async = true;
  script.defer = true;
  index.parentNode.insertBefore(script, index);
};

const locations = [
  {title: 'World of Coca-Cola', area:'downtown', lat:33.7629496, lng:-84.39266959999998}, //Downtown
  {title: 'Zoo Atlanta', area:'grant park', lat:33.734098, lng:-84.37226799999996}, //Grant Park
  {title: 'Georgia Aquarium', area:'downtown', lat:33.763382, lng:-84.3951098}, //Downtown
  {title: 'Piedmont Park', area:'midtown', lat:33.7850856, lng:-84.37380300000001}, //Midtown
  {title: 'High Museum of Art', area:'midtown', lat:33.7900632, lng:-84.38555199999996} //Midtown
];

class App extends Component {
  state = {
    locations: []
  }
  componentDidMount() {
    this.getLocations();
  }

  loadMap = () => {
    window.initMap = this.initMap;
    loadScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyBnkgMnhHckV_jd9qEFlop5r_B8Ju7ENXE&callback=initMap");
  }

  // this script was based off of the tutorial from https://www.youtube.com/watch?v=dAhMIF0fNpo
  getLocations = () => {
    const endpoint = "https://api.foursquare.com/v2/venues/explore?";
    const parameters = {
      client_id:"XB5DC5RP2SBEBGQZSWXNACEMV5SNV2COAXUBK0GNR1GNBVZM",
      client_secret:"QETHWPLLKSLHVP3DFGDFLIHY0B25RAEW1MXW5MZFGPHXVFNN",
      query:"bars",
      ll:"33.7570183,-84.4013661",
      v:"20181229"
    }

    axios.get(endpoint + new URLSearchParams(parameters))
      .then(response => {
        this.setState({
          locations: response.data.response.groups[0].items
        }, this.loadMap())
        console.log(response);
      })
      .catch(error => {
        console.log("ERROR: " + error)
      })
  }


  initMap = () => {
    const map = new window.google.maps.Map(document.getElementById('map'), {
        center: {lat:33.716502, lng:-84.38},
        zoom: 12
    });

    let markers = [];
    let bounds = new window.google.maps.LatLngBounds();
    console.log(this.state.locations);
    this.state.locations.forEach((location) => {
      let marker = new window.google.maps.Marker({
        position: location.venue.location,
        map: map,
        title: location.venue.name,
        animation: window.google.maps.Animation.DROP
      });
      markers.push(marker);
    })

    for(let i = 0; i < markers.length; i++) {
      bounds.extend(markers[i].position);
    }
    map.fitBounds(bounds);
    // console.log(markers);
  }

  render() {
    return (
      <main>
        <div id="map"></div>
        <LocationList locations={this.state.locations} />
      </main>
    );
  }
}
// <Menu menu_state={this.state.menu_state} toggleMenu={this.toggleMenuState} />

export default App;
