import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { Location, Permissions } from 'expo';
import { Button } from 'react-native-elements';
import get from 'lodash/get';
import pick from 'lodash/pick';

import zomato from '../services/zomato';
import Map from '../components/Map';


// Define the style attributes used in the screen definition
const styles = {
	filters: {
		flexDirection: 'column',
		justifyContent: 'flex-start',
		alignItems: 'center',
		flexWrap: 'wrap'
	},
	button: {
		marginVertical: 3
	}
};


class Home extends Component {
	// The state variables which
	// define a unique render of the screen
	state = {
		location: null,
		errorMessage: null,
		restaurants: []
	};


	// Mount components on the screen
	// This method is called at init
	componentWillMount() {
		this.getLocationAsync();
	}


	// Defines the function which fetches user location
	getLocationAsync = async () => {
		let { status } = await Permissions.askAsync(Permissions.LOCATION);
		if (status !== 'granted') {
			this.setState({
				errorMessage: 'Permission to access location was denied'
			});
		}

		let location = await Location.getCurrentPositionAsync({});
		await this.setState({ location });
		this.getRestaurants();
	};


	// Screen component
	// Filter Buttons, these are used to filter
	// the restaurants state value on oress.
	filterButtons = [
		// #8BC34A, #00BCD4 and #F44336
		{ label: 'बस खाएगा', 
		  color: '#9C27B0', 
		  filter: "basic"
		},
		{ label: 'मस्त खाएगा', 
		  color: '#E91E63', 
		  filter: "excellent"
		},
		{ label: 'साथ में खाएगा', 
		  color: '#E91E63', 
		  filter: "social"
		},
	];	


	// State Changer
	// this function takes a filter value as input
	// and updates the state on screen
	getRestaurants = async filter => {
		const coords = get(this.state.location, 'coords');
		const userLocation = pick(coords, ['latitude', 'longitude']);
		let restaurants = await zomato.getRestaurants(
			userLocation,
			filter
		);
		console.log(restaurants);
		this.setState({ restaurants: restaurants });
	};


	// Higher level abstraction on getRestaurants to 
	// tie in other function calls if necessary
	handleFilterPress = filter => {
		this.getRestaurants(filter);
	};
	

	// Defines and creates the filter buttons on screen
	renderFilterButtons() {
		return this.filterButtons.map((button, i) => (
			<Button
				key={i}
				title={button.label}
				buttonStyle={{
					backgroundColor: button.color,
					...styles.button
				}}
				onPress={() => this.handleFilterPress(button.filter)}
			/>
		));
	}


	// Defines the final definition of the screen. 
	// It uses the 3 values from the state object 
	// to render the definition of the screen
	// the state changes will be tracked on screen
	// such as the restaurants value change
	// when the Button on screen is pressed
	render() {
		const { location, restaurants: restaurants } = this.state;

		return (
			<View style={{ flex: 7 }}>
				<Map location={location} places={restaurants} />
				<View style={styles.filters}>{this.renderFilterButtons()}</View>
			</View>
		);
	}
}


// Export the screen
export { Home as Home };
