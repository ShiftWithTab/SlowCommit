export type Step = 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type CycleOption = '매일' | '주 3회' | '주 5회' | '평일';

export type GuestUserResponse = {
    id: number;
    username: string;
    message: string;
};

export type NicknameCheckResponse = {
    available: boolean;
    message: string;
};

export type SaveUsernameRequest = {
    userId: number;
    username: string;
};

export type SaveUsernameResponse = {
    userId?: number;
    id?: number;
    username: string;
    message: string;
};

export type SetupRequest = {
    userId: number;
    goalTitle: string;
    motto: string;
    characterId: number;
    startDate: string;
    endDate: string;
    alarmCycle: string;
    preferredEmoji: string;
};

export type SetupResponse = {
    goalDefinitionId?: number;
    goalPlanId?: number;
    message: string;
};