/**
 * Module dependencies.
 */

import 'react-native-gesture-handler';
import {
	ApolloLink,
	ApolloClient,
	InMemoryCache,
	ApolloProvider,
	Observable,
} from '@apollo/client';
import axios from 'axios';
import { onError } from '@apollo/client/link/error';
import AppLoading from 'expo-app-loading';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider } from 'styled-components/native';
import theme from '../theme';
import { Text, useWindowDimensions } from 'react-native';
import {
	useFonts,
	Roboto_400Regular,
	Roboto_700Bold,
} from '@expo-google-fonts/roboto';
import Login from './screens/login';
import Register from './screens/register';
import { createStackNavigator } from '@react-navigation/stack';
import routes from './config/routes';
import { AuthContext, AuthProvider } from './utils/AuthProvider';
import { FC, useContext, useEffect, useState } from 'react';
import Navigation from './components/Navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setContext } from 'apollo-link-context';
import { createUploadLink } from 'apollo-upload-client';
import { assertValidExecutionArguments } from 'graphql/execution/execute';

const getData = async () => {
	try {
		const jsonValue = await AsyncStorage.getItem('@user');
		return jsonValue != null ? JSON.parse(jsonValue) : null;
	} catch (e) {
		console.log('Error', e);
	}
};

const requestRefreshToken = async (): Promise<any> => {
	const token = await getData();

	const headers = {
		'Content-Type': 'application/json',
		Authorization: `Bearer ${token.refreshToken}`,
	};

	try {
		const response = await axios.post(
			'http://100.89.10.120:4000/refresh_token',
			{},
			{
				headers,
			}
		);
		return response.data;
	} catch (error) {
		console.log(error);
	}
};

const authLink = setContext(async (_, previousContext) => {
	const { headers } = previousContext;

	const token = await getData();

	return {
		headers: {
			...headers,
			authorization: token ? `Bearer ${token?.accessToken}` : '', //header
		},
	};
});

const errorLink = onError(
	({ graphQLErrors, networkError, operation, forward }) => {
		if (graphQLErrors) {
			for (let err of graphQLErrors) {
				switch (err.message) {
					// when an Expired_Token is thrown in a resolver
					case 'Expired_Token':
						// Modify the operation context with a new token

						return new Observable(observer => {
							requestRefreshToken()
								.then(refreshResponse => {
									operation.setContext(({ headers = {} }) => ({
										headers: {
											// Re-add old headers
											...headers,
											// Switch out old access token for new one
											authorization:
												`Bearer ${refreshResponse.accessToken}` || null,
										},
									}));
								})
								.then(() => {
									const subscriber = {
										next: observer.next.bind(observer),
										error: observer.error.bind(observer),
										complete: observer.complete.bind(observer),
									};
									// Retry last failed request
									forward(operation).subscribe(subscriber);
								})
								.catch(error => {
									// No refresh or client token available, returns oberserver error
									observer.error(error);
								});
						});
				}
			}
		}

		// To retry on network errors, we recommend the RetryLink

		// instead of the onError link. This just logs the error.

		if (networkError?.message === 'Invalid_Token') {
			console.log(`[Network error]: ${networkError}`);
		}
	}
);

const link = createUploadLink({
	uri: 'http:///100.89.10.120:4000/graphql',
});

const client = new ApolloClient({
	link: ApolloLink.from([authLink as unknown as ApolloLink, errorLink, link]),
	cache: new InMemoryCache(),
});

export default function App() {
	const { userAuth, loginAuth, logoutAuth } = useContext(AuthContext);
	const [loading, setLoading] = useState(true);

	return (
		<ApolloProvider client={client}>
			<AuthProvider>
				<ThemeProvider theme={theme}>
					<Navigation />
				</ThemeProvider>
			</AuthProvider>
		</ApolloProvider>
	);
}
