import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import RootNavigator from 'src/navigation/RootNavigator';

const theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#090909',
    card: '#121212',
    border: '#1f1f1f',
    text: '#f5f5f5',
    primary: '#c8f7a6',
  },
};

export default function App() {
  return (
      <NavigationContainer theme={theme}>
        <StatusBar style="light" />
        <RootNavigator />
      </NavigationContainer>
  );
}