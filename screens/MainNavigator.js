import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './Home';
import Proflie from './Profile';

const Stack = createStackNavigator();

export default function Navigator() {
	return (
		<NavigationContainer>
			<Stack.Navigator>
				<Stack.Screen name="HOME" component={Home} options={{ title: 'Rick & Morty' }} />
				<Stack.Screen name="Profile" component={Proflie} />
			</Stack.Navigator>
		</NavigationContainer>
	);
}
