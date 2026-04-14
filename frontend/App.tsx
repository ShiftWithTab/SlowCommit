import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import RootNavigator from 'src/navigation/RootNavigator';
import Toast from 'react-native-toast-message';
import { View, Text } from 'react-native';

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

const toastConfig = {
    success: ({ text1, text2 }: any) => (
        <View style={{ width: '90%', backgroundColor: '#1a1a1a', borderRadius: 16, padding: 16, borderLeftWidth: 4, borderLeftColor: '#c8f7a6' }}>
            <Text style={{ color: '#c8f7a6', fontWeight: 'bold', fontSize: 14 }}>
                {typeof text1 === 'string' ? text1 : ''}
            </Text>

            {typeof text2 === 'string' && (
                <Text style={{ color: '#f5f5f5', marginTop: 4 }}>
                    {text2}
                </Text>
            )}
        </View>
    ),

    error: ({ text1 }: any) => (
        <View style={{ width: '90%', backgroundColor: '#1a1a1a', borderRadius: 16, padding: 16, borderLeftWidth: 4, borderLeftColor: '#ff6b6b' }}>
            <Text style={{ color: '#ff6b6b' }}>
                {typeof text1 === 'string' ? text1 : ''}
            </Text>
        </View>
    ),

    info: ({ text1 }: any) => (
        <View style={{ width: '90%', backgroundColor: '#1a1a1a', borderRadius: 16, padding: 16, borderLeftWidth: 4, borderLeftColor: '#888' }}>
            <Text style={{ color: '#f5f5f5' }}>
                {typeof text1 === 'string' ? text1 : ''}
            </Text>
        </View>
    ),
};

export default function App() {
    return (
        <View style={{ flex: 1 }}>
            <NavigationContainer theme={theme}>
                <StatusBar style="light" />
                <RootNavigator />
            </NavigationContainer>

            <Toast config={toastConfig} />
        </View>
    );
}