import React, { Component } from 'react';
import LocationList from './LocationList';
import './App.css';

function loadScript(url) {
  let index = window.document.querySelector("script");
  let script = window.document.createElement("script");
  script.src = url
  script.async = true;
  script.defer = true;
  index.parentNode.insertBefore(script, index);

}

class App extends Component {
  componentDidMount() {
    this.loadMap();
  }

  loadMap = () => {
    loadScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyBnkgMnhHckV_jd9qEFlop5r_B8Ju7ENXE&callback=initMap");
    window.initMap = this.initMap;
  }

  initMap = () => {
    const map = new window.google.maps.Map(document.getElementById('map'), {
        center: {lat:33.716502, lng:-84.32},
        zoom: 12
    });

    // Array of places I'm interested in
    const locations = [
      {title: 'World of Coke', lat:33.7629496, lng:-84.39266959999998},
      {title: 'Zoo Atlanta', lat:33.734098, lng:-84.37226799999996},
      {title: 'Ponce City Market', lat:33.772597, lng:-84.36554130000002},
      {title: 'Piedmont Park', lat:33.7850856, lng:-84.37380300000001},
      {title: 'Hartsfield-Jackson International Airport', lat:33.6407282, lng:-84.42770009999998}
    ];

    let markers = [];

    locations.forEach((location) => {
      let marker = new window.google.maps.Marker({
        position: location,
        map: map,
        title: location.title
      });
      markers.push(marker);
    })
  }


  render() {
    return (
      <main>
        <div id="map">Hello World!</div>
        <LocationList />
      </main>
    );
  }
}

export default App;
