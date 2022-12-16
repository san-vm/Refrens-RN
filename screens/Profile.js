import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';

const Profile = ({ route }) => {
	let item = route.params;

	const [LocationData, setLocationData] = useState()

	// Fetches Additional location details based on the current item ID
	useEffect(() => {
		fetch(item.location.url)
			.then(res => res.json())
			.then(setLocationData)
	}, [])


	return (
		<View
			style={styles.profileContainer}>
			<Image source={{ uri: item.image }} style={styles.image} />
			<View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginVertical: 5 }}>
				<View style={[styles.status, { backgroundColor: item.status == "Alive" ? "#14e516" : "red" }]} />
				<Text style={{ fontWeight: "bold", fontSize: 15 }}>{item.name}</Text>
			</View>

			<Text style={styles.title}>Spices: </Text>
			<View style={styles.infoBox}>
				<Text style={{}}>{item.species + ` (${item.gender[0]})`}</Text>
			</View>

			<Text style={styles.title}>Location: </Text>
			<View style={styles.infoBox}>
				<Text style={{}}>{item.location.name}</Text>
			</View>

			<Text style={styles.title}>Origin: </Text>
			<View style={styles.infoBox}>
				<Text style={{}}>{item.origin.name}</Text>
			</View>

			{LocationData && <>
				<Text style={styles.title}>Dimension: </Text>
				<View style={styles.infoBox}>
					<Text style={{}}>{LocationData.dimension}</Text>
				</View>

				<Text style={styles.title}>Population: </Text>
				<View style={styles.infoBox}>
					<Text style={{}}>{LocationData.residents.length}</Text>
				</View>
			</>}

		</View>
	)
}

const styles = StyleSheet.create({
	image: {
		width: 250,
		height: 250,
		resizeMode: "cover",
		borderRadius: 10,
		alignSelf: "center"
	},
	profileContainer: {
		backgroundColor: "#41AABE",
		flex: 1,
		alignItems: "center"
	},
	status: {
		width: 10,
		height: 10,
		borderRadius: 5,
		marginHorizontal: 10,
	},
	title: {
		paddingHorizontal: 6,
		fontWeight: "bold",
		marginVertical: 5
	},
	infoBox: {
		flexDirection: "row",
		width: "80%",
		padding: 8,
		backgroundColor: "#fff",
		borderRadius: 15,
		borderWidth: 2,
		borderColor: "green"
	}
});

export default Profile