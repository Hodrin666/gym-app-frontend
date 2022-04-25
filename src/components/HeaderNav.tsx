/**
 * Module dependencies.
 */

import { StackNavigationProp } from '@react-navigation/stack';
import React, { useContext } from 'react';
import { AuthContext } from '../utils/AuthProvider';
import styled from 'styled-components/native';
import theme from '../../theme';
import { FontAwesome5 } from '@expo/vector-icons';
import { useFonts, Raleway_900Black } from '@expo-google-fonts/raleway';
import AppLoading from 'expo-app-loading';
import { gql, useQuery } from '@apollo/client';
import NoImage from '../../assets/user.svg';
import { Image } from 'react-native';

/**
 * IProps interface.
 */

interface IProps {
	navigation: StackNavigationProp<any>;
}

/**
 * HeaderContainer styled component.
 */

const HeaderContainer = styled.View`
	min-height: 60px;
	background-color: ${theme.colors.main};
	display: flex;
	align-items: center;
	justify-content: space-evenly;
	flex-direction: row;
`;

/**
 * Divider styled component.
 */

const Divider = styled.View`
	width: 100%;
	height: 2px;
	background-color: ${theme.colors.bright};
	position: absolute;
	bottom: 0;
	left: 0;
`;

/**
 * Icon styled component.
 */

const Icon = styled(FontAwesome5)`
	color: ${theme.colors.bright};
`;

/**
 * `ProfileImageContaine` styled component.
 */

const IconContainer = styled.TouchableOpacity`
	position: relative;
	height: 32px;
	width: 32px;
	border-radius: 32px;
	border: 1px solid ${theme.colors.bright};
	margin-right: 28px;
	display: flex;
	align-items: center;
	justify-content: center;
	overflow: hidden;
`;

/**
 * `NoProfileImage` styled component.
 */

const NoProfileImage = styled(NoImage)`
	color: ${theme.colors.bright};
	width: 32px;
	height: 32px;
`;

/**
 * `Title` styled component.
 */

const Title = styled.Text`
	color: ${theme.colors.bright};
	font-size: 22px;
	font-family: Raleway_900Black;
`;

/**
 * `TextContainer` styled component.
 */

const TextContainer = styled.View`
	flex: 1;
	display: flex;
	flex-direction: row;
	margin-left: 28px;
	align-items: center;
`;

/**
 * `ProfileImage` styled component.
 */

const ProfileImage = styled(Image)`
	width: 32px;
	height: 32px;
`;

/**
 * `TitleHighlighted` styled component.
 */

const TitleHighlighted = styled(Title)`
	background-color: ${theme.colors.bright};
	color: ${theme.colors.main};
`;

/**
 * GetProfileImage query
 */

const GetProfileImage = gql`
	query GetProfileImage($name: String!) {
		getProfileImage(name: $name) {
			hasImage
			url
		}
	}
`;

/**
 * `HeaderNav` component.
 */

const HeaderNav = (props: IProps): JSX.Element => {
	const { userAuth } = useContext(AuthContext);
	const { navigation } = props;
	const { loading, error, data } = useQuery(GetProfileImage, {
		variables: { name: userAuth?.member._id },
	});

	const [fontsLoaded] = useFonts({
		Raleway_900Black,
	});

	if (!fontsLoaded) {
		return <AppLoading />;
	}

	if (error) {
		console.log('Error', error);
	}

	if (loading) {
		return <AppLoading />;
	} else {
		return (
			<HeaderContainer>
				<TextContainer>
					<Title>{'Power '}</Title>
					<TitleHighlighted>{'CrossFit'}</TitleHighlighted>
				</TextContainer>
				<IconContainer onPress={() => navigation.navigate('Profile')}>
					{data.getProfileImage.hasImage ? (
						<ProfileImage source={{ uri: data.getProfileImage.url }} />
					) : (
						<NoProfileImage />
					)}
				</IconContainer>
				<Divider />
			</HeaderContainer>
		);
	}
};

/**
 * Export `HeaderNav` component.
 */

export default HeaderNav;
