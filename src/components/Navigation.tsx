/**
 * Module dependencies
 */

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import routes, { landingRoutes } from '../config/routes';
import React, { FC, useContext } from 'react';
import { AuthContext } from '../utils/AuthProvider';

const Stack = createStackNavigator();

/**
 * `Navigation` function component.
 */

const Navigation = (): JSX.Element => {
	const { userAuth } = useContext(AuthContext);

	return (
		<NavigationContainer>
			{userAuth ? (
				<Stack.Navigator
					initialRouteName="Home"
					screenOptions={{ headerShown: false }}
				>
					{landingRoutes.map((r, i) => (
						<Stack.Screen key={i} name={r.name}>
							{props => <r.component nameProp={r.name} {...props} />}
						</Stack.Screen>
					))}
				</Stack.Navigator>
			) : (
				<Stack.Navigator
					initialRouteName="Login"
					screenOptions={{ headerShown: false }}
				>
					{routes.map((r, i) => (
						<Stack.Screen key={i} name={r.name}>
							{props => <r.component nameProp={r.name} {...props} />}
						</Stack.Screen>
					))}
				</Stack.Navigator>
			)}
		</NavigationContainer>
	);
};

/**
 * Export Navigation.
 */

export default Navigation;
