import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import InitScreen from '../screens/InitScreen';
import UsernameScreen from '../screens/UsernameScreen';
import GoalSetupScreen from '../screens/GoalSetupScreen';
import HomeScreen from '../screens/HomeScreen';
import StatsScreen from '../screens/StatsScreen';
import ProfileScreen from '../screens/ProfileScreen';

import { RootStackParamList, MainTabParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

function MainTabs({ route }: any) {
    const { userId } = route.params;

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: '#0d0d0d',
                    borderTopColor: '#1e1e1e',
                    height: 70,
                    paddingBottom: 10,
                    paddingTop: 8,
                },
                tabBarActiveTintColor: '#d8c2ff',
                tabBarInactiveTintColor: '#8b8b8b',
            }}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                initialParams={{ userId }}
            />
            <Tab.Screen
                name="Stats"
                component={StatsScreen}
                initialParams={{ userId }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                initialParams={{ userId }}
            />
        </Tab.Navigator>
    );
}

export default function RootNavigator() {
    return (
        <Stack.Navigator initialRouteName="Init" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Init" component={InitScreen} />
            <Stack.Screen name="Username" component={UsernameScreen} />
            <Stack.Screen name="GoalSetup" component={GoalSetupScreen} />
            <Stack.Screen name="MainTabs" component={MainTabs} />
        </Stack.Navigator>
    );
}