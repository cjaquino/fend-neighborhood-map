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
  }


  render() {
    // console.log(this.props);
    return (
      <div id='sidebar' role='menu'>
        <h2>Locations</h2>
        <div id="search-container" role='search'>
          <select tabIndex="1" defaultValue='' id="location-search" onChange={(e) => this.onChangeHandler(e)}>
            <option value=''>ZIP Codes</option>
            {this.props.zipCodes.map((zipCode, index) => (
              <option key={index} value={zipCode}>{zipCode}</option>
            ))}
          </select>
        </div>
        <ul id="locations-list">
          {this.props.locations.map((location) => (
              <li tabIndex="2" key={location.venue.name} id={location.venue.name} onClick={(e) => this.props.onListClick(e)}>{location.venue.name}</li>
            ))}
        </ul>
        <button tabIndex="3" id="menu" onClick={() => this.toggleMenuHandler()}>
          <div id="icon" className='close'></div>
        </button>
      </div>
    )
  }
}

// <input id="location-search" type="text" placeholder="Ex: World of Coke" />
// <input id="submit-location-search" type="button" value="Go" />

export default LocationList;
