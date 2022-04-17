/**
 * Module dependencies.
 */

import React from 'react';
import { IStackScreenProps } from './StackScreenProps';

/**
 * Export `IRouteProps` interface.
 */

export interface IRouteProps {
	component: React.FunctionComponent<IStackScreenProps>;
	name: string;
}
