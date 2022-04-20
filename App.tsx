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
import theme from './theme';
import { Text, useWindowDimensions } from 'react-native';
import {
	useFonts,
	Roboto_400Regular,
	Roboto_700Bold,
} from '@expo-google-fonts/roboto';
import Login from './src/screens/login';
import Register from './src/screens/register';
import { createStackNavigator } from '@react-navigation/stack';
import routes from './src/config/routes';
import { AuthContext, AuthProvider } from './src/utils/AuthProvider';
import { FC, useContext, useEffect, useState } from 'react';
import Navigation from './src/components/Navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setContext } from 'apollo-link-context';
import { createUploadLink } from 'apollo-upload-client';
import { assertValidExecutionArguments } from 'graphql/execution/execute';

//uk - http://100.89.10.29:4000/graphql
//iBase - http://192.168.31.36:4000/graphql
//ze -  http://192.168.68.120:4000/graphql

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
			'https://53a6-2a01-388-438-110-00-1-11.ngrok.io/refresh_token',
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
			authorization: token ? `Bearer ${token?.accessToken}` : '', //your custom header
		},
	};
});

const errorLink = onError(
	({ graphQLErrors, networkError, operation, forward }) => {
		if (graphQLErrors) {
			for (let err of graphQLErrors) {
				switch (err.message) {
					// Apollo Server sets code to UNAUTHENTICATED

					// when an AuthenticationError is thrown in a resolver

					case 'Expired_Token':
						console.log('Im here');
						// Modify the operation context with a new token

						return new Observable(observer => {
							requestRefreshToken()
								.then(refreshResponse => {
									console.log('da', refreshResponse.accessToken);
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
									// No refresh or client token available, we force user to login
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
	uri: 'https://53a6-2a01-388-438-110-00-1-11.ngrok.io/graphql',
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
