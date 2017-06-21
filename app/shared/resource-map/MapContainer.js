import classnames from 'classnames';
import React, { PropTypes } from 'react';
import { Map, TileLayer, ZoomControl } from 'react-leaflet';
import { connect } from 'react-redux';
import { geolocated, geoPropTypes } from 'react-geolocated';

import { searchMapClick, selectUnit } from 'actions/searchActions';
import selector from './mapSelector';
import Marker from './Marker';
import UserMarker from './UserMarker';

const defaultPosition = [60.372465778991284, 24.818115234375004];
const defaultZoom = 10;

export class UnconnectedResourceMapContainer extends React.Component {
  static propTypes = {
    markers: PropTypes.array,
    boundaries: PropTypes.shape({
      maxLatitude: PropTypes.number,
      minLatitude: PropTypes.number,
      maxLongitude: PropTypes.number,
      minLongitude: PropTypes.number,
    }),
    searchMapClick: PropTypes.func.isRequired,
    selectedUnitId: PropTypes.string,
    selectUnit: PropTypes.func.isRequired,
    showMap: PropTypes.bool.isRequired,
    ...geoPropTypes,
  };

  componentDidUpdate(prevProps) {
    if (this.map && prevProps.boundaries !== this.props.boundaries) {
      this.fitMapToBoundaries();
    }
  }

  onMapRef = (map) => {
    this.map = map;
    this.fitMapToBoundaries();
  }

  getBounds() {
    const boundaries = this.props.boundaries;
    return [
      [boundaries.minLatitude, boundaries.minLongitude],
      [boundaries.maxLatitude, boundaries.maxLongitude],
    ];
  }

  hasBoundaries() {
    const boundaries = this.props.boundaries;
    return (
      boundaries.minLatitude ||
      boundaries.minLongitude ||
      boundaries.maxLatitude ||
      boundaries.maxLongitude
    );
  }

  fitMapToBoundaries = () => {
    if (this.hasBoundaries() && this.map) {
      this.map.leafletElement.fitBounds(this.getBounds());
    }
  }

  render() {
    const center = this.props.coords ?
      [this.props.coords.latitude, this.props.coords.longitude] :
      defaultPosition;
    return (
      <div className={classnames('app-ResourceMap', { 'app-ResourceMap__showMap': this.props.showMap })}>
        <Map
          center={center}
          className="app-ResourceMap__map"
          onClick={this.props.searchMapClick}
          ref={this.onMapRef}
          zoom={defaultZoom}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://api.mapbox.com/styles/v1/city-of-helsinki/cj0w88p4j00qw2rnp9h8ylt7s/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiY2l0eS1vZi1oZWxzaW5raSIsImEiOiJjaXdwMTg1bXowMDBoMnZueHlod2RqbXRyIn0.7FKlCDKY-lDr2BNFbNlQ1w"
          />
          <ZoomControl position="bottomright" />
          {this.props.markers && this.props.markers.map(
            marker => <Marker
              {...marker}
              highlighted={this.props.selectedUnitId === marker.unitId}
              key={marker.unitId}
              selectUnit={this.props.selectUnit}
            />
          )}
          {this.props.coords &&
            <UserMarker
              latitude={this.props.coords.latitude}
              longitude={this.props.coords.longitude}
            />
          }
        </Map>
        <div className="app-ResourceMap__overlay" />
      </div>
    );
  }
}

const actions = {
  selectUnit,
  searchMapClick,
};

export default connect(selector, actions)(geolocated()(UnconnectedResourceMapContainer));
