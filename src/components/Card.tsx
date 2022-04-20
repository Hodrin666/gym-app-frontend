/**
 * Module dependencies.
 */

import AppLoading from 'expo-app-loading';
import {
	useFonts,
	Roboto_400Regular,
	Roboto_700Bold,
} from '@expo-google-fonts/roboto';
import React from 'react';
import { Alert } from 'react-native';
import styled from 'styled-components/native';
import { MaterialIcons } from '@expo/vector-icons';
import { ifProp } from 'styled-tools';
import theme from '../../theme';
import { ICard } from '../screens/addGymClass';
import * as Type from '../Types';
import { ApolloQueryResult, gql, useMutation } from '@apollo/client';

/**
 * `IProps` interface.
 */

interface IProps {
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
 * `DeleteIcon` styled component.
 */

const DeleteIcon = styled(MaterialIcons).attrs({
	size: 30,
	name: 'delete',
})`
	color: ${theme.colors.error};
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

const DeleteMutation = gql`
	mutation DeleteClassById($input: classDeleteInput!) {
		deleteClassById(input: $input) {
			success
			message
		}
	}
`;

/**
 * `Card` function component.
 */

const Card = (props: IProps): JSX.Element => {
	const { item, last, setOpenEditModal, setCardData, refetch } = props;

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

	if (!fontsLoaded) {
		return <AppLoading />;
	}

	return (
		<CardWrapper
			last
			onPress={() => {
				setOpenEditModal[0](true);
				setOpenEditModal[1](true);
				setCardData(item);
			}}
		>
			<ProfessorWrapper>
				<ProfileImageWrapper />

				<StyledText>{`${item.teacher.firstName} ${item.teacher.lastName}`}</StyledText>
			</ProfessorWrapper>

			<ClassDateLimitWrapper>
				<StyledText>{`${item.date} ${item.time}`}</StyledText>

				<StyledTextLimit>{`${item.members.length}/10`}</StyledTextLimit>
			</ClassDateLimitWrapper>

			<IconWrapper onPress={onDelete}>
				<DeleteIcon />
			</IconWrapper>
		</CardWrapper>
	);
};

/**
 * Default `Card` export.
 */

export default Card;
