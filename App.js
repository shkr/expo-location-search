import React from "react"
import { StyleSheet, SafeAreaView } from "react-native"

// The Style Attributes of the App render
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		justifyContent: 'flex-start'
	}
})

// The index.js file in screens directory exports Home screen
// therefore it is not needed to be imported from its specific
// file.
import { Home as Home } from "./app/screens"

// The App.js file exports the App Component
// which is rendered by react native 
// and it is configured using screens configured using
// components and state changes
export default class App extends React.Component {
	render() {
		return (
			<SafeAreaView style={styles.container}>
				<Home />
			</SafeAreaView>
		)
	}
}

