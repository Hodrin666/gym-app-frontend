/**
 * Module dependencies.
 */

import { IRouteProps } from '../library/RouteProp';
import LoginScreen from '../screens/login';
import RegisterScreen from '../screens/register';
import HomeScreen from '../screens/home';
import AddGymClass from '../screens/addGymClass';

/**
 * Page auth `routes`.
 */

const routes: IRouteProps[] = [
	{
		name: 'Login',
		component: LoginScreen,
	},
	{
		name: 'Register',
		component: RegisterScreen,
	},
];

/**
 * Page landing `landingRoutes`.
 */

export const landingRoutes: IRouteProps[] = [
	{
		name: 'Home',
		component: HomeScreen,
	},
	{
		name: 'TeacherCalendar',
		component: AddGymClass,
	},
];

export default routes;
