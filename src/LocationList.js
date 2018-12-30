import React, { Component } from 'react';
import './App.css'

class LocationList extends Component {
  state = {
    opened: true
  }

  toggleMenuHandler = () => {
    this.setState((state) => ({
      opened: !this.state.opened
    }))
    document.getElementById("icon").classList.toggle("open");
    document.getElementById("icon").classList.toggle("close");
    if(this.state.opened) {
      document.getElementById("sidebar").style.left = "-250px";
    } else {
      document.getElementById("sidebar").style.left = "0";
    }
  }

  onChangeHandler = () => {
    // console.log(document.getElementById("location-search").value);
    let value = document.getElementById("location-search").value;
    this.setState((state) => ({
      selectedArea: value
    }))
  }

  render() {
    // console.log(this.props);
    return (
      <div id='sidebar'>
        <h2>Locations</h2>
        <div id="search-container">
          <select defaultValue='' id="location-search" onChange={() => this.onChangeHandler()}>
            <option value=''>Area</option>
            <option value='midtown'>Midtown</option>
            <option value='downtown'>Downtown</option>
            <option value='grant park'>Grant Park</option>
          </select>
        </div>
        <ul id="locations-list">
          {this.props.locations.map((location,idx) => (
              <li key={idx}>{location.venue.name}</li>
            ))}
        </ul>
        <div id="menu" onClick={() => this.toggleMenuHandler()}>
          <div id="icon" className='close'></div>
        </div>
      </div>
    )
  }
}

// <input id="location-search" type="text" placeholder="Ex: World of Coke" />
// <input id="submit-location-search" type="button" value="Go" />

export default LocationList;
