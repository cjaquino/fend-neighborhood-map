import React, { Component } from 'react';
import './App.css'

class LocationList extends Component {
  state = {
    opened: true,
    zipCode: ''
  }

  // toggles the sidbar menu location from onscreen to offscreen,
  // leaving the open/close button to be always visible
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

  // handles dropdown onChange event
  // calls onZipSelect to handle functionality and sets this component's state
  // to call render function and update list
  onChangeHandler = (e) => {
    this.props.onZipSelect(e.target.value);
    this.setState({zipCode:e.target.value});
  }

  render() {
    return (
      <nav id='sidebar' role='menu'>
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
      </nav>
    )
  }
}

export default LocationList;
