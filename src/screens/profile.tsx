/**
 * Module dependencies.
 */

import React, { useContext, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import theme from '../../theme';
import { IStackScreenProps } from '../library/StackScreenProps';
import { FontAwesome5 } from '@expo/vector-icons';
import { gql, useMutation, useQuery } from '@apollo/client';
import AppLoading from 'expo-app-loading';
import UserProfileForm from '../components/Forms/UserProfileForm';
import { AuthContext } from '../utils/AuthProvider';
import { StatusBar } from 'expo-status-bar';
import {
	Alert,
	Dimensions,
	View,
	Image,
	ActivityIndicator,
	Text,
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import NoImage from '../../assets/user.svg';
import * as ImagePicker from 'expo-image-picker';
import mime from 'mime';
import { ReactNativeFile } from 'apollo-upload-client';

const { width } = Dimensions.get('screen');

/**
 * `ProfileContainer` styled component;
 */

const ProfileContainer = styled(SafeAreaView)`
	background-color: ${theme.colors.main};
	flex: 1;
`;

/**
 * `HeaderContainer` styled component;
 */

const HeaderContainer = styled.View`
	position: relative;
	background-color: ${theme.colors.blue};
	height: 60px;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
`;

/**
 * `Title` styled component;
 */

const Title = styled.Text`
	color: ${theme.colors.main};
	font-size: 22px;
	font-weight: bold;
`;

/**
 * `IconBack` styled component;
 */

const IconBack = styled(FontAwesome5)`
	color: ${theme.colors.main};
	margin-left: 22px;
`;

/**
 * `TitleContainer` styled component;
 */

const TitleContainer = styled.View`
	flex: 1;
	display: flex;
	justify-content: center;
	align-items: center;
`;

/**
 * `IconContainer` styled component;
 */

const IconContainer = styled.View`
	flex: 1;
	display: flex;
`;

/**
 * `ImageContainer` styled component;
 */

const ImageContainer = styled.View`
	flex: 1;
	max-height: 163px;
	background-color: ${theme.colors.blue};
	display: flex;
	flex-direction: row;
	align-items: center;
	position: relative;
`;

/**
 * `NoImage` styled component.
 */

const NoProfileImage = styled(NoImage)`
	color: ${theme.colors.bright};
	width: 126px;
	height: 126px;
`;

/**
 * `ImageWrapper` styled component.
 */

const ImageWrapper = styled.TouchableOpacity`
	position: absolute;
	bottom: 0px;
	background-color: ${theme.colors.secondary};
	border-radius: 63px;
	left: ${Math.round(width / 2) - 63}px;
`;

/**
 * `ProfileImage` styled component.
 */

const ProfileImage = styled(Image)`
	width: 126px;
	height: 126px;
	border-radius: 63px;
	border: 3px ${theme.colors.bright};
`;

/**
 * `Liner` styled component.
 */

const Liner = styled.View`
	background-color: ${theme.colors.main};
	width: ${width}px;
	margin-top: auto;
	height: 63px;
	z-index: -1;
`;

const UserByIdQuery = gql`
	query Query($id: ID!, $name: String!) {
		getUserById(_id: $id) {
			firstName
			lastName
			email
			contact
		}
		getProfileImage(name: $name) {
			hasImage
			url
		}
	}
`;

const UploadImage = gql`
	mutation UploadFile($file: Upload!) {
		uploadFile(file: $file) {
			message
			status
			url
		}
	}
`;

/**
 * `Profile` screen.
 */

const Profile: React.FunctionComponent<IStackScreenProps> = props => {
	const { userAuth } = useContext(AuthContext);
	const { navigation, nameProp, route } = props;
	const [hasProfileImage, setHasProfileImage] = useState(false);
	const { loading, data, error, refetch } = useQuery(UserByIdQuery, {
		variables: {
			id: userAuth?.member._id,
			name: userAuth?.member._id,
		},
	});

	const [uploadFile, { loading: mutationLoading, data: mutationData }] =
		useMutation(UploadImage);

	const onChangeImage = async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [4, 3],
			quality: 1,
		});

		if (!result.cancelled) {
			const file = new ReactNativeFile({
				uri: result.uri,
				type: mime.getType(result.uri) || '',
				name: userAuth?.member._id,
			});

			console.log(file);

			uploadFile({
				variables: {
					file,
				},
				onCompleted: async ({ uploadFile }) => {
					await refetch();
				},
				onError: error => {
					console.log('Error: ', error);
				},
			});
		}
	};

	if (loading) {
		return <AppLoading />;
	} else {
		return (
			<ProfileContainer>
				<StatusBar backgroundColor={theme.colors.blue} />
				<HeaderContainer>
					<IconContainer>
						<TouchableOpacity onPress={() => navigation.navigate('Home')}>
							<IconBack name="arrow-left" size={25} />
						</TouchableOpacity>
					</IconContainer>
					<TitleContainer>
						<Title>{'Profile'}</Title>
					</TitleContainer>
					<View style={{ flex: 1 }}></View>
				</HeaderContainer>

				<ImageContainer>
					<ImageWrapper onPress={onChangeImage}>
						{data.getProfileImage.hasImage ? (
							<ProfileImage source={{ uri: data.getProfileImage.url }} />
						) : (
							<NoProfileImage />
						)}
					</ImageWrapper>

					<Liner />
				</ImageContainer>

				<UserProfileForm userData={data.getUserById} />
			</ProfileContainer>
		);
	}
};

/**
 * Export `Profile` screen.
 */

export default Profile;
