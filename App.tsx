import { StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

const styles = StyleSheet.create({
	container: {
		alignItems: 'center',
		backgroundColor: '#fff',
		flex: 1,
		justifyContent: 'center',
	},
});

export default function App() {
	return (
		<View style={styles.container}>
			<Text>Open up App.tsx to start working on your app!</Text>

			<Text> {'Hello world'}</Text>

			<StatusBar style="auto" />
		</View>
	);
}
