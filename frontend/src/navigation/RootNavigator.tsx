import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import InitScreen from '../screens/InitScreen';
import UsernameScreen from '../screens/UsernameScreen';
import GoalSetupScreen from '../screens/GoalSetupScreen';
import HomeScreen from '../screens/HomeScreen';
import StatsScreen from '../screens/StatsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import CategoryCreateScreen from '../screens/CategoryCreateScreen';
import RoutineManageScreen from '../screens/RoutineManageScreen';
import RoutineCreateScreen from "../screens/RoutineCreateScreen";

import { RootStackParamList, MainTabParamList } from '../types/navigation';

import { useFonts } from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import GoalManageScreen from "../screens/GoalManageScreen";
import ReminderManageScreen from "../screens/ReminderManageScreen";

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
                    borderTopWidth: 0,
                },
                tabBarActiveTintColor: '#d8c2ff',
                tabBarInactiveTintColor: '#8b8b8b',
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '700',
                },
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
                name="Settings"
                component={SettingsScreen}
                initialParams={{ userId }}
            />
        </Tab.Navigator>
    );
}

export default function RootNavigator() {
    const [fontsLoaded] = useFonts({
        ...Ionicons.font,
    });

    if (!fontsLoaded) {
        return null;
    }
    return (
        <Stack.Navigator initialRouteName="Onboarding" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            <Stack.Screen name="Init" component={InitScreen} />
            <Stack.Screen name="Username" component={UsernameScreen} />
            <Stack.Screen name="GoalSetup" component={GoalSetupScreen} />
            <Stack.Screen name="MainTabs" component={MainTabs} />
            <Stack.Screen name="CategoryCreate" component={CategoryCreateScreen}/>
            <Stack.Screen name="RoutineManage" component={RoutineManageScreen}/>
            <Stack.Screen name="RoutineCreate" component={RoutineCreateScreen}/>
            <Stack.Screen name="GoalManage"component={GoalManageScreen}/>
            <Stack.Screen name="ReminderManage" component={ReminderManageScreen}/>
        </Stack.Navigator>
    );
}