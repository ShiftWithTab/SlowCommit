import { API_BASE_URL } from '../constants/api';
import type {
    GuestUserResponse,
    NicknameCheckResponse,
    SaveUsernameRequest,
    SaveUsernameResponse,
    SetupRequest,
    SetupResponse,
} from '../types/onboarding';

export async function createGuestUser(): Promise<GuestUserResponse> {
    const response = await fetch(`${API_BASE_URL}/api/users/guest`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error(`게스트 생성 실패: ${response.status}`);
    }

    return response.json();
}

export async function checkNickname(username: string): Promise<NicknameCheckResponse> {
    const response = await fetch(
        `${API_BASE_URL}/api/onboarding/check-nickname?username=${encodeURIComponent(username)}`
    );

    if (!response.ok) {
        throw new Error(`닉네임 확인 실패: ${response.status}`);
    }

    return response.json();
}

export async function saveUsername(payload: SaveUsernameRequest): Promise<SaveUsernameResponse> {
    const response = await fetch(`${API_BASE_URL}/api/onboarding/username`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error(`별명 저장 실패: ${response.status}`);
    }

    return response.json();
}

export async function setupOnboarding(payload: SetupRequest): Promise<SetupResponse> {
    const response = await fetch(`${API_BASE_URL}/api/onboarding/setup`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error(`초기 설정 실패: ${response.status}`);
    }

    return response.json();
}