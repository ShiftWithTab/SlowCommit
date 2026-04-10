export type RootStackParamList = {
    Onboarding: undefined;
    Init: undefined;
    Username: { userId: number };
    GoalSetup: { userId: number };
    MainTabs: { userId: number };
};

export type MainTabParamList = {
    Home: { userId: number };
    Stats: { userId: number };
    Profile: { userId: number };
};