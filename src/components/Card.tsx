/**
 * Module dependencies.
 */

import AppLoading from 'expo-app-loading';
import {
	useFonts,
	Roboto_400Regular,
	Roboto_700Bold,
} from '@expo-google-fonts/roboto';
import React, { useContext, useEffect } from 'react';
import { Alert } from 'react-native';
import styled from 'styled-components/native';
import { FontAwesome5 } from '@expo/vector-icons';
import { ifProp } from 'styled-tools';
import theme from '../../theme';
import { ICard } from '../screens/addGymClass';
import * as Type from '../Types';
import { ApolloQueryResult, gql, useMutation, useQuery } from '@apollo/client';
import { BookingType, CardName } from '../../types/appEnum';
import { AuthContext } from '../utils/AuthProvider';
import { useState } from 'react';
import { IMutationEdit, InputMessage } from './Forms/updateSessionForm';
import NoImage from '../../assets/user.svg';

/**
 * `IProps` interface.
 */

interface IProps {
	cardName: CardName;
	item: ICard;
	last: boolean;
	setOpenEditModal: React.Dispatch<React.SetStateAction<boolean>>[];
	setCardData: React.Dispatch<React.SetStateAction<ICard | undefined>>;
	refetch: (
		variables?:
			| Partial<{
					first: React.Dispatch<React.SetStateAction<number>>;
			  }>
			| undefined
	) => Promise<ApolloQueryResult<any>>;
}

/**
 * `IInputMessage` interface.
 */

interface IInputDeleteMessage {
	success: string;
	message: string;
}

/**
 * `IInputDelete` interface.
 */

interface IInputDelete {
	_id: string;
}

/**
 * `CardWrapper` styled component.
 */

const CardWrapper = styled.TouchableOpacity<{ last: boolean }>`
	margin: ${ifProp({ last: true }, '12px 0 0', '12px 0')};
	background-color: ${theme.colors.main};
	border-radius: ${theme.borderRadius};
	border: 1px solid white;
	height: 50px;
	width: 100%;
	align-self: center;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	padding: 0 12px;
	height: 80px;
`;

/**
 * `ProfessorWrapper` styled component.
 */

const ProfessorWrapper = styled.View`
	display: flex;
	flex-direction: row;
	flex: 1;
	align-items: center;
`;

/**
 * `ProfileImageWrapper` styled component.
 */

const ProfileImageWrapper = styled.View`
	height: 48px;
	width: 48px;
	border-radius: 24px;
	border: 1px solid ${theme.colors.bright};
	margin-right: 12px;
	overflow: hidden;
`;

/**
 * `ProfileImage` styled component.
 */

const ProfileImage = styled.Image`
	height: 48px;
	width: 48px;
	border-radius: 24px;
`;

/**
 * `StyledText` styled component.
 */

const StyledText = styled(Type.Regular)`
	color: ${theme.colors.bright};
`;

/**
 * `StyledTextLimit` styled component.
 */

const StyledTextLimit = styled(StyledText)`
	align-self: flex-end;
	margin-top: 6px;
`;

/**
 * `ClassDateLimitWrapper` styled component.
 */

const ClassDateLimitWrapper = styled.View`
	display: flex;
	flex-direction: column;
`;

/**
 * `NoProfileImage` styled component.
 */

const NoProfileImage = styled(NoImage)`
	color: ${theme.colors.bright};
	height: 48px;
	width: 48px;
	margin-right: 12px;
`;

/**
 * `Icon` styled component.
 */

const Icon = styled(FontAwesome5).attrs({
	size: 25,
})<{ hasBooked?: boolean }>`
	transform: ${ifProp({ hasBooked: true }, 'rotate(45deg)', 'rotate(0deg)')};
`;

/**
 * `IconWrapper` styled component.
 */

const IconWrapper = styled.TouchableOpacity`
	display: flex;
	align-items: center;
	justify-content: center;
	margin-left: 16px;
`;

/**
 * DeleteMutation Mutation.
 */

const DeleteMutation = gql`
	mutation DeleteClassById($input: classDeleteInput!) {
		deleteClassById(input: $input) {
			success
			message
		}
	}
`;

/**
 * EditGymClassById Mutation.
 */

const EditGymClassById = gql`
	mutation EditGymClassById($input: editClassInput!) {
		editGymClassById(input: $input) {
			success
			message
			class {
				date
				description
				time
				members
				teacher {
					firstName
					lastName
				}
			}
		}
	}
`;

/**
 * Get profile image query.
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
 * `Card` function component.
 */

const Card = (props: IProps): JSX.Element => {
	const { item, last, setOpenEditModal, setCardData, refetch, cardName } =
		props;
	const [hasBooked, setHasBooked] = useState<boolean>(false);

	const { loading: loadingImage, data: dataImage } = useQuery(GetProfileImage, {
		variables: { name: item._teacherID },
	});

	const { userAuth } = useContext(AuthContext);

	const checkBooking = (members: string[], member: string): boolean => {
		for (const element of members) {
			if (element === member) return true;
		}
		return false;
	};

	useEffect(() => {
		if (userAuth?.member._id) {
			const hasBooked = checkBooking(item.members, userAuth.member._id);
			setHasBooked(hasBooked);
		}
	}, []);

	const [fontsLoaded] = useFonts({
		Roboto_400Regular,
		Roboto_700Bold,
	});

	const [deleteClassById, { loading, data }] = useMutation<
		{ deleteClassById: IInputDeleteMessage },
		{ input: IInputDelete }
	>(DeleteMutation);

	const onDelete = async () => {
		await deleteClassById({
			variables: {
				input: {
					_id: item._id,
				},
			},
			onCompleted: async ({ deleteClassById }) => {
				if (deleteClassById.success) {
					Alert.alert('Class', 'Deleted successfully!', [{ text: 'OK' }]);
				}
			},
			onError: error => {
				console.log('Error: ', error);
			},
		});

		await refetch();
	};

	const [editGymClassById, { loading: mutationLoading, data: mutationData }] =
		useMutation<{ editGymClassById: InputMessage }, { input: IMutationEdit }>(
			EditGymClassById
		);

	const onBookingType = async (type: BookingType) => {
		let members = item.members;

		if (type === BookingType.UNBOOK && userAuth?.member._id) {
			let newBookingIds: any[] = [];
			members.filter((value, index) => {
				if (value != userAuth?.member._id) {
					newBookingIds = [...newBookingIds, value];
				}
			});
			members = newBookingIds;
		}

		if (type === BookingType.BOOK && userAuth?.member._id) {
			members = [...item.members, userAuth?.member._id];
			console.log('booking', members);
		}

		editGymClassById({
			variables: {
				input: {
					_id: item._id,
					_teacherID: item._teacherID,
					members: members,
					date: item.date,
					time: item.time,
					description: item.description,
				},
			},
			onCompleted: async ({ editGymClassById }) => {
				console.log('class', editGymClassById.class);
				if (editGymClassById.success && type === BookingType.UNBOOK) {
					setHasBooked(false);
					Alert.alert('Class', 'Booking removed!', [{ text: 'OK' }]);
				} else {
					setHasBooked(true);
					Alert.alert('Class', 'Booked successfully!', [{ text: 'OK' }]);
				}
			},
			onError: error => {
				console.log('Error: ', error);
			},
		});

		await refetch();
	};

	if (!fontsLoaded) {
		return <AppLoading />;
	}

	if (loadingImage) {
		return <AppLoading />;
	} else {
		console.log('hello', dataImage);
		return (
			<CardWrapper
				last={last}
				onPress={() => {
					if (setOpenEditModal.length > 0) {
						for (const elements of setOpenEditModal) {
							elements(true);
						}
					}
					setCardData(item);
				}}
			>
				<ProfessorWrapper>
					{dataImage.getProfileImage.hasImage ? (
						<ProfileImageWrapper>
							<ProfileImage source={{ uri: dataImage.getProfileImage.url }} />
						</ProfileImageWrapper>
					) : (
						<NoProfileImage />
					)}

					{/* <ProfileImageWrapper /> */}

					<StyledText>{`${item.teacher.firstName} ${item.teacher.lastName}`}</StyledText>
				</ProfessorWrapper>

				<ClassDateLimitWrapper>
					<StyledText>{`${item.date} ${item.time}`}</StyledText>

					<StyledTextLimit>{`${item.members.length}/10`}</StyledTextLimit>
				</ClassDateLimitWrapper>

				{cardName === CardName.ADMIN ? (
					<IconWrapper onPress={onDelete}>
						<Icon name="trash" color={theme.colors.error} />
					</IconWrapper>
				) : hasBooked ? (
					<IconWrapper onPress={() => onBookingType(BookingType.UNBOOK)}>
						<Icon
							name="plus-circle"
							color={theme.colors.error}
							hasBooked={true}
						/>
					</IconWrapper>
				) : (
					<IconWrapper onPress={() => onBookingType(BookingType.BOOK)}>
						<Icon
							name="plus-circle"
							color={theme.colors.blue}
							hasBooked={false}
						/>
					</IconWrapper>
				)}
			</CardWrapper>
		);
	}
};

/**
 * Default `Card` export.
 */

export default Card;
