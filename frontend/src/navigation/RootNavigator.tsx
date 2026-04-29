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
import { useTheme } from '../theme/ThemeContext';

import Feather from '@expo/vector-icons/Feather';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

function MainTabs({ route }: any) {
    const { userId } = route.params;
    const theme  = useTheme();


    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    position: 'absolute',
                    left: 20,
                    right: 20,
                    bottom: 20,
                    height: 68,
                    borderRadius: 24,
                    backgroundColor: theme.card,
                    borderTopWidth: 0,

                    paddingBottom: 8,
                    paddingTop: 8,

                    elevation: 0,
                },

                tabBarActiveTintColor: theme.primary,

                tabBarInactiveTintColor: theme.isDark
                    ? 'rgba(255,255,255,0.45)'
                    : 'rgba(0,0,0,0.45)',

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
                options={{
                    tabBarLabel: 'Calendar',
                    tabBarIcon: ({ size, color}) => (
                        <Feather
                            name="calendar"
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />
            <Tab.Screen
                name="Stats"
                component={StatsScreen}
                initialParams={{ userId }}
                options={{
                    tabBarLabel: 'Stats',
                    tabBarIcon: ({ size, color}) => (
                        <Feather name="heart"
                                     size={size}
                                     color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Settings"
                component={SettingsScreen}
                initialParams={{ userId }}
                options={{
                    tabBarLabel: 'Settings',
                    tabBarIcon: ({ size, color}) => (
                        <Feather name="settings"
                                 size={size}
                                 color={color} />
                    ),
                }}
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