export type RootStackParamList = { //초기설정
    Init: undefined;
    Username: { userId: number };
    GoalSetup: { userId: number };
    MainTabs: { userId: number };
};

export type MainTabParamList = { // 메인탭 으로 분리
    Home: { userId: number };
    Stats: { userId: number };
    Profile: { userId: number };
};