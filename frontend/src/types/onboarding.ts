export type Step = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export type CycleOption = '매일' | '주 3회' | '주 5회' | '평일';

export type GuestUserResponse = {
    userId: number;
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
    userId: number;
    username: string;
    message: string;
};

export type SetupRequest = {
    userId: number;
    goalTitle: string;
    motto: string;
    characterId: number;
    characterName : string;
    startDate: string;
    endDate: string;
    alarmCycle: number;
    preferredEmoji: string;
};

export type SetupResponse = {
    goalDefinitionId?: number;
    goalPlanId?: number;
    message: string;
};