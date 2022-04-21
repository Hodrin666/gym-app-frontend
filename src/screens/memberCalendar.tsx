/**
 * Module dependencies
 */

import AppLoading from 'expo-app-loading';
import { IStackScreenProps } from '../library/StackScreenProps';
import styled from 'styled-components/native';
import theme from '../../theme';
import { StatusBar } from 'expo-status-bar';
import {
	useFonts,
	Roboto_400Regular,
	Roboto_700Bold,
} from '@expo-google-fonts/roboto';
import { VirtualizedList } from 'react-native';
import MainNavbar from '../components/MainNavbar';
import { gql, useQuery } from '@apollo/client';
import React, { useState } from 'react';
import { ICard } from './addGymClass';
import Card from '../components/Card';
import { CardName } from '../../types/appEnum';

/**
 * `Container` styled component.
 */

const Container = styled.SafeAreaView`
	background-color: ${theme.colors.main};
	flex: 1;
`;

/**
 * `CardContainer` styled component.
 */

const CardContainer = styled.View`
	background-color: ${theme.colors.main};
	flex: 1;
	margin: 60px 28px;
`;

/**
 * AllClasses Query
 */

const AllClasses = gql`
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
 * `MemberCalendar` screen.
 */

const MemberCalendar: React.FunctionComponent<IStackScreenProps> = props => {
	const { navigation } = props;
	const [skip, setSkip] = useState<number>(0);
	const [cardData, setCardData] = useState<ICard>();

	const [fontsLoaded] = useFonts({
		Roboto_400Regular,
		Roboto_700Bold,
	});

	const { loading, data, error, refetch } = useQuery(AllClasses, {
		variables: { first: setSkip },
	});

	if (!fontsLoaded || loading) {
		return <AppLoading />;
	}

	const dataCount = data.allClasses.length;

	return (
		<Container>
			<StatusBar style="light" />

			{data.allClasses && (
				<CardContainer>
					<VirtualizedList<ICard>
						// Use keyExtractor to help the list optimize performance
						keyExtractor={item => item._id}
						data={data.allClasses}
						renderItem={({ item, index }) => {
							if (index === dataCount - 1) {
								return (
									<Card
										item={item}
										last
										setOpenEditModal={[]}
										setCardData={setCardData}
										refetch={refetch}
										cardName={CardName.MEMBER}
									/>
								);
							} else {
								return (
									<Card
										item={item}
										last={false}
										setOpenEditModal={[]}
										setCardData={setCardData}
										refetch={refetch}
										cardName={CardName.MEMBER}
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

			<MainNavbar navigation={navigation} />
		</Container>
	);
};

/**
 * Export `MemberCalendar` screen.
 */

export default MemberCalendar;
