import { api } from './client';

import type {
    GuestUserResponse,
    NicknameCheckResponse,
    SaveUsernameRequest,
    SaveUsernameResponse,
    SetupRequest,
    SetupResponse,
} from '../types/onboarding';

export async function createGuestUser(): Promise<GuestUserResponse> {
    const response = await api.post('/users/guest');
    return response.data;
}

export async function checkNickname(username: string): Promise<NicknameCheckResponse> {
    const response = await api.get('/onboarding/check-nickname', {
        params: { username },
    });
    return response.data;
}

export async function saveUsername(
    payload: SaveUsernameRequest
): Promise<SaveUsernameResponse> {
    const response = await api.post('/onboarding/username', payload);
    return response.data;
}

export async function setupOnboarding(
    payload: SetupRequest
): Promise<SetupResponse> {
    const response = await api.post('/onboarding/setup', payload);
    return response.data;
}