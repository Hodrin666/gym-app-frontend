/**
 * Module dependencies.
 */

import {
	Modal,
	Alert,
	useWindowDimensions,
	ActivityIndicator,
	Text,
	VirtualizedList,
	View,
	SafeAreaView,
} from 'react-native';
import { IStackScreenProps } from '../library/StackScreenProps';
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../utils/AuthProvider';
import MainNavbar from '../components/MainNavbar';
import { StatusBar } from 'expo-status-bar';
import styled from 'styled-components/native';
import theme from '../../theme';
import {
	useFonts,
	Roboto_400Regular,
	Roboto_700Bold,
} from '@expo-google-fonts/roboto';
import { FontAwesome5 } from '@expo/vector-icons';
import SessionForm from '../components/Forms/createSessionForm';
import { gql, useQuery } from '@apollo/client';
import Card from '../components/Card';
import UpdateSessionForm from '../components/Forms/updateSessionForm';

/**
 * `Card` interface
 */

export interface ICard {
	_id: string;
	_teacherID: string;
	date: string;
	time: string;
	teacher: {
		firstName: string;
		lastName: string;
	};
	members: string[];
	description: string;
}

/**
 * `Container` styled component.
 */

const Container = styled.View`
	flex: 1;
	background-color: ${theme.colors.main};
	display: flex;
	justify-content: center;
	flex-direction: column;
`;

/**
 * `ModalWindow` styled component.
 */

const ModalWindow = styled.View`
	display: flex;
	background-color: purple;
	position: absolute;
	margin: 50px 28px;
	top: 40px;
	left: 28px;
	right: 28px;
	height: 200px;
	justify-content: center;
`;

/**
 * `ModalF` styled component.
 */

const ModalF = styled.View`
	display: flex;
	flex-grow: 1;
	background-color: ${theme.colors.secondary};
	margin: 10px 28px 125px;
	border-radius: 22px;
`;

/**
 * `Button` styled component.
 */

const Button = styled.TouchableOpacity`
  background-color: ${theme.colors.blue}
  height: 60px;
  width: 60px;
  border-radius: 100px;
	border: none;
	color: ${theme.colors.blue};
  position: absolute;
  right: 28px;
  bottom: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

/**
 * `Icon` styled component.
 */

const Icon = styled(FontAwesome5)`
	color: ${theme.colors.main};
	align-self: center;
`;

/**
 * `CardContainer` styled component.
 */

const CardContainer = styled.SafeAreaView`
	background-color: ${theme.colors.main};
	margin: 60px 28px;
	display: flex;
	flex-direction: column;
	flex: 1;
`;

export const AllClasses = gql`
	query AllClasses($first: Int) {
		allClasses(first: $first) {
			_id
			_teacherID
			teacher {
				firstName
				lastName
			}
			members
			date
			time
			description
		}
	}
`;

/**
 * `AddGymClass function component.
 */

const AddGymClass: React.FunctionComponent<IStackScreenProps> = props => {
	const { userAuth } = useContext(AuthContext);
	const { nameProp, navigation, route } = props;
	const [skip, setSkip] = useState<number>(0);
	const [openEditModal, setOpenEditModal] = useState<boolean>(false);
	const [cardData, setCardData] = useState<ICard>();

	const {
		loading,
		data: dataQuery,
		error,
		refetch,
	} = useQuery(AllClasses, {
		variables: { first: setSkip },
	});

	if (error) {
		console.log('Error', error);
	}

	const [fontsLoaded] = useFonts({
		Roboto_400Regular,
		Roboto_700Bold,
	});

	const [modalVisible, setModalVisible] = useState(false);

	const windowHeight = useWindowDimensions().height;

	if (loading) {
		console.log('Loading =>', loading);
		return <ActivityIndicator />;
	}

	const dataCount = dataQuery.allClasses.length;

	return (
		<Container style={[{ minHeight: Math.round(windowHeight) }]}>
			<StatusBar style="light" />

			{dataQuery.allClasses && (
				<CardContainer>
					<VirtualizedList<ICard>
						// Use keyExtractor to help the list optimize performance
						keyExtractor={item => item._id}
						data={dataQuery.allClasses}
						renderItem={({ item, index }) => {
							if (index === dataCount - 1) {
								return (
									<Card
										item={item}
										last
										setOpenEditModal={[setOpenEditModal, setModalVisible]}
										setCardData={setCardData}
									/>
								);
							} else {
								return (
									<Card
										item={item}
										last={false}
										setOpenEditModal={[setOpenEditModal, setModalVisible]}
										setCardData={setCardData}
									/>
								);
							}
						}}
						// the virtualized list doesn't know how you want to extract your data
						// you need to tell it
						getItem={(data, index) => {
							const dataIndex = data[index];
							return dataIndex;
						}}
						// it also needs to know how much data you have
						getItemCount={data => data.length}
					/>
				</CardContainer>
			)}

			<Modal
				animationType={'fade'}
				transparent={true}
				visible={modalVisible}
				onRequestClose={() => {
					Alert.alert('Modal has been closed.');
					setModalVisible(!modalVisible);
					setOpenEditModal(!openEditModal);
					setCardData(undefined);
				}}
			>
				<ModalF style={[{ minHeight: Math.round(windowHeight) - 200 }]}>
					{openEditModal && cardData ? (
						<UpdateSessionForm
							setModalOpen={[setModalVisible, setOpenEditModal]}
							refetch={refetch}
							item={cardData}
							setCardData={setCardData}
						/>
					) : (
						<SessionForm setModalOpen={setModalVisible} refetch={refetch} />
					)}
				</ModalF>
			</Modal>
			<Button onPress={() => setModalVisible(true)}>
				<Icon name={'plus'} size={40} />
			</Button>
			<MainNavbar navigation={navigation} />
		</Container>
	);
};

/**
 * `AddGymClass` default export.
 */

export default AddGymClass;
