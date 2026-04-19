export type RootStackParamList = {
    Onboarding: undefined;
    Init: undefined;
    Username: { userId: number };
    GoalSetup: { userId: number };
    MainTabs: { userId: number };
    CategoryCreate: undefined;
};

export type MainTabParamList = {
    Home: { userId: number };
    Stats: { userId: number };
    Settings: { userId: number };
    CategoryCreate: undefined;
};