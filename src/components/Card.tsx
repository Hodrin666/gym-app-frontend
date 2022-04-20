/**
 * Module dependencies.
 */

import React from 'react';
import { GestureResponderEvent, Text, View } from 'react-native';
import styled, { css } from 'styled-components/native';
import { ifProp } from 'styled-tools';
import theme from '../../theme';
import { ICard } from '../screens/addGymClass';

/**
 * `IProps` interface.
 */

interface IProps {
	item: ICard;
	last: boolean;
	setOpenEditModal: React.Dispatch<React.SetStateAction<boolean>>[];
	setCardData: React.Dispatch<React.SetStateAction<ICard | undefined>>;
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

const StyledText = styled.Text`
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
 * `Card` function component.
 */

const Card = (props: IProps): JSX.Element => {
	const { item, last, setOpenEditModal, setCardData } = props;
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
		</CardWrapper>
	);
};

/**
 * Default `Card` export.
 */

export default Card;
