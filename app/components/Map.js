// Component is extended to define it as Map Component
import React, { Component } from "react"
// Text Object is used in the map marker callout
import { Text } from "react-native"
// MapView object takes input and renders a MapView on android/ios
import { MapView } from "expo"
// This npm module is used to hash restaurant names into a hex code color
import assignColorToStr from 'random-material-color'

// The Market Object to put on the MapView
const Marker = MapView.Marker
// The Callout Object to put on the Marker
const Callout = MapView.Callout

// The Styles object is used assign style
// attributes the rendering of the component
// Here we are allowing the container of the Map
// component rendering to use only 80% of the vertical
// space on the screen.
const styles = {
  container: {
    width: "100%",
    height: "70%",
  }
}

// We export the Map component as it is
export default class Map extends Component {

  // In addition to the MapView this function
  // is used to render custom markers on the Map component
  renderMarkers() {
    return this.props.places.map((place, i) => (
      <Marker key={i} title={place.name} coordinate={place.coords} pinColor={assignColorToStr.getColor({text: place.name})}>
        <Callout>
          <Text>{place.name + "\n"} {place.description + "\n" + place.url} </Text>
        </Callout>
      </Marker>
    ))
  }
  
  // Renders the MapView with the style object as input
  // Additionally showsUserLocation: does a live view of the device location
  //              showsMyLocationButton:
  //              followsUserLocation: 
  render() {
    
    return (
      <MapView
        style={styles.container}
        showsUserLocation
        showsMyLocationButton
        followsUserLocation
      >
        {this.renderMarkers()}
      </MapView>
    )
  }
}

