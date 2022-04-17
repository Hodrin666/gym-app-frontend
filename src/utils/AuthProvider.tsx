import React, { useContext, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * `User` type.
 */

type User = {
	member: any;
	accessToken?: string;
	refreshToken?: string;
} | null;

/**
 * `LoginInput` type.
 */

interface LoginInput {
	success: boolean;
	refreshToken?: string;
	accessToken?: string;
	message: string;
	member?: any;
}

/**
 * Export `AuthContext` react context.
 */

export const AuthContext = React.createContext<{
	userAuth: User;
	loginAuth: (data: LoginInput) => void;
	logoutAuth: () => void;
}>({
	userAuth: null,
	loginAuth: (data: any) => {},
	logoutAuth: () => {},
});

/**
 * `AuthProviderProps` interface.
 */

interface AuthProviderProps {
	children: React.ReactNode;
}

/**
 * Export `AuthProvider` function component.
 */

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
	const [user, setUser] = useState<User | null>(null);
	const { userAuth } = useContext(AuthContext);

	return (
		<AuthContext.Provider
			value={{
				userAuth: user,
				loginAuth: async data => {
					if (data?.success) {
						setUser({
							member: data.member,
							accessToken: data.accessToken,
							refreshToken: data.refreshToken,
						});

						try {
							const loggedInUser = {
								accessToken: data.accessToken,
								refreshToken: data.refreshToken,
							};
							await AsyncStorage.setItem('@user', JSON.stringify(loggedInUser));
						} catch (e) {
							console.log('Error');
						}
					}
				},
				logoutAuth: async () => {
					setUser(null);
					try {
						await AsyncStorage.removeItem('@user');
					} catch (e) {
						console.log('Error', e);
					}
				},
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};
