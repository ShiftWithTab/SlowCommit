export type RootStackParamList = {
    Onboarding: undefined;
    Init: undefined;
    Username: { userId: number };
    GoalSetup: { userId: number };
    MainTabs: { userId: number };
    CategoryCreate: undefined;
    GoalManage: { goalId: number };
    RoutineManage: { userId: number };
    RoutineCreate: { goalId: number };
    ReminderManage: { userId: number };
};

export type MainTabParamList = {
    Home: { userId: number };
    Stats: { userId: number };
    Settings: { userId: number };
    CategoryCreate: undefined;
    GoalManage: undefined;

    RoutineManage: { userId: number };
    ReminderManage: { userId: number };

};