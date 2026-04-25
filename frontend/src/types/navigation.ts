export type RootStackParamList = {
    Onboarding: undefined;
    Init: undefined;
    Username: { userId: number };
    GoalSetup: { userId: number };
    MainTabs: { userId: number };
    CategoryCreate: undefined;
    RoutineManage: { userId: number };
    RoutineCreate: { goalId: number };
};

export type MainTabParamList = {
    Home: { userId: number };
    Stats: { userId: number };
    Settings: { userId: number };
};