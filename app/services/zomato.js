// Pick up ZOMATO_USER_KEY from environment variable
const ZOMATO_USER_KEY = process.env['ZOMATO_USER_KEY']


// Define a method to call Zomato Cities API 
// refer https://developers.zomato.com/api
// It takes userLocation as input and returns the response object
// from the api.
const getCity = (userLocation) => {

	return fetch(`https://developers.zomato.com/api/v2.1/cities?lat=${userLocation.latitude}&lon=${userLocation.longitude}&count=3`, {
	  method: 'GET',
	  headers: {
	    Accept: 'application/json',
	    'user-key': ZOMATO_USER_KEY
	  },
	})	
	.then((response) => response.json())
    .then((responseJson) => {
			const cities = responseJson.location_suggestions

			if (cities.length > 1) {
				return cities[0]
			} else {
				console.log("Unable to find city for the userLocation")
				return null
			}
    }).catch((error) => {
      console.error(error);
    });
};

// Method to uniformly sample
// from the array
const getRandomElementsFromArray = (arr, n) => {
	
	var result = new Array(n),
			len = arr.length,
			taken = new Array(len);
	if (n > len)
			throw new RangeError("getRandom: more elements taken than available");
	while (n--) {
			var x = Math.floor(Math.random() * len);
			result[n] = arr[x in taken ? taken[x] : x];
			taken[x] = --len in taken ? taken[len] : len;
	}
	return result;
}

// A filter map
// to define feature threshold values
// for different filter values
const filter_map = {
	"basic": {
		"user_rating.aggregate_rating": {
			"low": 3.8,
			"high": 4.2
		},
		"average_cost_for_two": {
			"low": 200,
			"high": 600
		}
	},
	"social": {
		"user_rating.aggregate_rating": {
			"low": 4.0,
			"high": 4.3
		},
		"average_cost_for_two": {
			"low": 400,
			"high": 1200
		}
	},
	"excellent": {
		"user_rating.aggregate_rating": {
			"low": 4.2,
			"high": 4.8
		},
		"average_cost_for_two": {
			"low": 1200,
			"high": 3000
		}
	}
}

// Define a validate function
// which takes restaurant object as returned
// from Zomato Search API and checks if 
// it satisfies attribute thresholds as
// defined in the filter map.
const validateRestaurant = (restaurant, filter) => {
	
	console.log("applying filter", filter)
	const filter_values = filter_map[filter]

	const feature_values = {
		"user_rating.aggregate_rating": Number(restaurant["user_rating"]["aggregate_rating"]),
		"average_cost_for_two": Number(restaurant["average_cost_for_two"])
	}

	// Set validationFlag as false by default
	var validationFlag = false
	console.log("validating filter_values", filter_values)
	console.log("validating feature_values", feature_values)
	
	// Applies each feature threshold to the input
	// restaurant object
	Object.keys(filter_values).forEach(featureName => {
		const high_threshold = Number(filter_values[featureName].high) 
		const low_threshold = Number(filter_values[featureName].low) 
		const feature_value = feature_values[featureName]
		if((high_threshold >= feature_value) && (low_threshold <= feature_value)) {
			validationFlag = true
			console.log("key", featureName, "low_threshold", low_threshold, "high_threshold", high_threshold, "value", feature_value, "truefying")
		} else {
			console.log("key", featureName, "low_threshold", low_threshold, "high_threshold", high_threshold, "value", feature_value, "falsyfing")
		}
	})

	return validationFlag
}

// Define a method to call Zomato Search API 
// refer https://developers.zomato.com/api
// It taks userLocation as input and returns the response object
// from the api.
const getRestaurants = (userLocation, filter = "social") => {
	
	// Defines number of samples taken from API
	// and final count of results returned 
	const samples = 20
	const selection = 3

	return fetch(`https://developers.zomato.com/api/v2.1/search?lat=${userLocation.latitude}&lon=${userLocation.longitude}&count=${samples}&sort=real_distance`, {
	  method: 'GET',
	  headers: {
	    Accept: 'application/json',
	    'user-key': ZOMATO_USER_KEY
	  },
	})	
	.then((response) => response.json())
    .then((responseJson) => {
			
			const res = getRandomElementsFromArray(responseJson.restaurants.filter((obj, index, arr) => {
				if(validateRestaurant(obj.restaurant, filter)) {
					return obj
				}
			})			
			.map(obj => {
				
				// Create delivery value
				// in description for restaurants 
				// open now
				var delivering = ""
				if (obj.restaurant.is_delivering_now == "1") {
					delivering = "delivering"
				}

    		return {
    			name: obj.restaurant.name,
    			coords: {
    				latitude: Number(obj.restaurant.location.latitude), 
						longitude:  Number(obj.restaurant.location.longitude)
					},
					url: obj.restaurant.menu_url,
					description: delivering
    		}
    	}), selection)

    	return res
    })
    .catch((error) => {
      console.error(error);
    });
};

// exports the default attributes
// of this file object when imported in Home.js
export default {
	getRestaurants: getRestaurants
};
