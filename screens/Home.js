import React, { useEffect, useState, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, TextInput } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import axios from "axios";

const Home = ({ navigation }) => {
	const [CharacterData, setCharacterData] = useState([])
	const [SearchText, setSearchText] = useState("")

	const [FilterList, setFilterList] = useState(["alive", "dead", "unknown"])
	const [CurFilter, setCurFilter] = useState(-1)

	const PageNumber = useRef(1)
	const Info = useRef({}).current

	// 
	// Loads the Characters Profile Data also based on Search Key and Applied Filter
	// 
	const LoadData = () => {
		// Increments page number on every request if the current page is not reached end
		if (Info.current?.pages && PageNumber.current < Info.current?.pages) {
			PageNumber.current = PageNumber.current + 1
		}
		// returns if last page number is reached
		else if (Info.current?.pages && PageNumber.current === Info.current?.pages) return

		let params = { page: PageNumber.current, name: SearchText }
		if (CurFilter > -1) {
			params["status"] = FilterList[CurFilter]
		}

		axios.get(`https://rickandmortyapi.com/api/character/`, { params })
			.then(res => {
				res = res.data
				Info.current = res.info

				if (PageNumber.current > 1) {
					let temp = CharacterData.filter(predicate => !predicate.next && !predicate.empty)
					temp = temp.concat(res.results)
					if (PageNumber.current < res.info.pages) {
						temp.push({ next: true })
					}
					setCharacterData(formatData(temp, 3))
				}
				else {
					if (PageNumber.current < res.info.pages) {
						res.results.push({ next: true })
					}
					setCharacterData(formatData(res.results, 3))
				}
			}).catch(() => { })
	}

	useEffect(LoadData, [SearchText, CurFilter])

	// 
	// Render Component for Profile Card called through FLatlist
	// 
	const ProfileCard = ({ item }) => {
		if (item.empty)
			return <View style={[styles.profileContainer, { width: 100, height: 100, backgroundColor: "transparent" }]} />

		if (item.next)
			return <TouchableOpacity
				onPress={LoadData}
				style={[styles.profileContainer, { justifyContent: "center", alignItems: "center", minHeight: 130 }]}>
				<Text style={{ fontWeight: "bold", fontSize: 40, color: "#fff" }}>+</Text>
				<Text style={{ fontWeight: "bold", fontSize: 10, color: "#fff" }}>Load More</Text>
			</TouchableOpacity>

		return <TouchableOpacity
			onPress={() => navigation.navigate("Profile", item)}
			style={styles.profileContainer}>
			<Image source={{ uri: item.image }} style={styles.image} />
			<View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-around" }}>
				<View style={[styles.status, { backgroundColor: item.status == "Alive" ? "#14e516" : "red" }]} />
				<Text style={{ flex: 1, fontWeight: "bold" }}>{item.name}</Text>
			</View>
			<Text style={{ paddingLeft: 6 }}>{item.species + ` (${item.gender[0]})`}</Text>
		</TouchableOpacity>
	}

	return (
		<View style={styles.container}>

			{/* Search Bar */}
			<View style={styles.search}>

				<TextInput placeholder='Find Character'
					onChangeText={text => {
						if (text === "" && SearchText !== "") setCharacterData([])
						Info.current = {}
						setSearchText(text)
						PageNumber.current = 1
					}}
					value={SearchText}
					style={[styles.input, { borderColor: "#fff" }]}
					placeholderTextColor="#fff"
				/>

				{SearchText ?
					<TouchableOpacity onPress={() => {
						setCharacterData([])
						Info.current = {}
						setSearchText("")
						PageNumber.current = 1
					}}>
						<Image source={require('../assests/cancel.png')} style={{ height: 18, width: 18 }} />
					</TouchableOpacity>
					:
					<Image source={require('../assests/search.png')} style={styles.ImageStyle} />
				}
			</View>


			{/* Render Filters List */}
			<FlatList
				horizontal={true}
				data={FilterList}
				keyExtractor={(item, index) => `${CurFilter}${index}`}
				renderItem={({ item, index }) => (
					<TouchableOpacity
						onPress={() => {
							setCharacterData([])
							setCurFilter(val => val === index ? -1 : index)
							Info.current = {}
							PageNumber.current = 1
						}}
						style={[{ height: 45, marginLeft: 13, justifyContent: "center" },
						index == FilterList.length - 1 && { marginRight: 13 },
						]}
					>

						<LinearGradient
							// Background Linear Gradient
							colors={
								index == CurFilter
									? ["rgba(30, 72, 180, 1)", "rgba(30, 72, 180, 0.5)"]
									: ["rgba(229, 238, 255, 1)", "rgba(229, 238, 255, 0)"]
							}
							style={{
								borderRadius: 50,
								overflow: "hidden",
								borderWidth: 1,
								borderColor: "rgba(30, 72, 180, 0.5)",
							}}
							start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
						>
							<Text style={[styles.filterText, { color: index == CurFilter ? "#fff" : "#2351A3", }]}>
								{item.charAt(0).toUpperCase() + item.substr(1)}
							</Text>
						</LinearGradient>
					</TouchableOpacity>
				)}
				showsVerticalScrollIndicator={false}
				showsHorizontalScrollIndicator={false}
				style={{ height: 50, maxHeight: 50 }}
			/>

			{/* Characters / Profile Render */}
			<FlatList
				data={CharacterData}
				renderItem={({ item, index }) => <ProfileCard item={item} />}
				keyExtractor={(item, index) => item.next ? index : item.id}
				numColumns={3}
				showsVerticalScrollIndicator={false}
				removeClippedSubviews
				onEndReached={LoadData}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	title: {
		color: '#000',
		fontSize: 17,
	},
	image: {
		width: 110,
		height: 105,
		borderRadius: 10,
		alignSelf: "center"
	},
	profileContainer: {
		margin: 4,
		padding: 5,
		backgroundColor: "#41AABE",
		borderRadius: 15,
		flex: 1
	},
	status: {
		width: 5,
		height: 5,
		borderRadius: 5,
		marginHorizontal: 6
	},
	filterText: {
		textAlign: "center",
		marginHorizontal: 20,
		fontFamily: "Roboto-700",
		fontSize: 13,
		paddingVertical: 3
	},
	search: {
		flexDirection: "row",
		justifyContent: "space-around",
		alignItems: "center",
		backgroundColor: "#ff8100",
		padding: 10
	},
	input: {
		height: 40,
		width: "80%",
		borderBottomWidth: 3,
		borderColor: "#ff8100",
		padding: 5,
		color: "#fff",
		fontSize: 18,
	},
	ImageStyle: {
		height: 25,
		width: 25,
		padding: 10,
		resizeMode: 'stretch',
	},
});

function formatData(dataList, numCols) {
	const totalRows = Math.floor(dataList.length / numCols);
	let totalLastRow = dataList.length - totalRows * numCols;

	while (totalLastRow !== 0 && totalLastRow !== numCols) {
		dataList.push({ key: "blank", empty: true });
		totalLastRow++;
	}
	return dataList;
}

export default Home;