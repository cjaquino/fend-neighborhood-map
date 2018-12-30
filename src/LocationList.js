import React, { Component } from 'react';
import './App.css'

class LocationList extends Component {
  state = {
    opened: true,
    zipCode: ''
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

  onChangeHandler = (e) => {
    this.props.onZipSelect(e.target.value);
    this.setState({zipCode:e.target.value});
    this.toggleMenuHandler();
  }


  render() {
    // console.log(this.props);
    return (
      <div id='sidebar'>
        <h2>Locations</h2>
        <div id="search-container">
          <select defaultValue='' id="location-search" onChange={(e) => this.onChangeHandler(e)}>
            <option value=''>ZIP Codes</option>
            {this.props.zipCodes.map((zipCode, index) => (
              <option key={index} value={zipCode}>{zipCode}</option>
            ))}
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
