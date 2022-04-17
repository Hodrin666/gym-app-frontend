/**
 * Module dependencies.
 */

import { Modal, Alert, useWindowDimensions } from 'react-native';
import { IStackScreenProps } from '../library/StackScreenProps';
import { useContext, useState } from 'react';
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
import SessionForm from '../components/Forms/sessionForm';

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
	flex-grow: 1;
	background-color: ${theme.colors.main};
	margin: 50px 28px;
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
 * `AddGymClass function component.
 */

const AddGymClass: React.FunctionComponent<IStackScreenProps> = props => {
	const { userAuth } = useContext(AuthContext);
	const { nameProp, navigation, route } = props;

	const [fontsLoaded] = useFonts({
		Roboto_400Regular,
		Roboto_700Bold,
	});

	const [modalVisible, setModalVisible] = useState(false);

	const windowHeight = useWindowDimensions().height;

	return (
		<Container style={[{ minHeight: Math.round(windowHeight) }]}>
			<StatusBar style="light" />
			<ModalWindow>
				<Modal
					animationType={'fade'}
					transparent={true}
					visible={modalVisible}
					onRequestClose={() => {
						Alert.alert('Modal has been closed.');
						setModalVisible(!modalVisible);
					}}
				>
					<ModalF style={[{ minHeight: Math.round(windowHeight) - 200 }]}>
						<SessionForm setModalOpen={setModalVisible} />
					</ModalF>
				</Modal>
			</ModalWindow>

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
