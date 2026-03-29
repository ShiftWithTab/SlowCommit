# Focus Pixel App Starter

스크린샷 느낌을 참고해서 만든 **React Native + Spring Boot** 스타터 프로젝트입니다.

구성:
- `frontend/`: React Native (Expo + TypeScript)
- `backend/`: Spring Boot 3 + JPA + H2

## 주요 MVP 기능
- 홈 화면
  - 목표 카테고리 칩
  - 픽셀 캐릭터 + 한마디
  - 월간 출석 캘린더
  - 목표별 할 일 리스트
- 통계 화면
  - 완료율 / 연속 달성일 / 카테고리별 완료 건수
- 프로필 화면
  - 닉네임, 한 줄 소개, 진행 중 목표
- 백엔드 REST API
  - 카테고리 조회/생성
  - 할 일 조회/생성/완료 처리
  - 대시보드 요약 조회

## 실행 방법

### 1) Backend
```bash
cd backend
./gradlew bootRun
```
- 서버: `http://localhost:8080`
- H2 콘솔: `http://localhost:8080/h2-console`

### 2) Frontend
```bash
cd frontend
npm install
npx expo start
```

## 추천 다음 단계
- JWT 로그인 / 소셜 로그인
- 푸시 알림
- 실제 월별 출석 로직 강화
- 픽셀 캐릭터 성장 시스템
- 배지/레벨 시스템
- PostgreSQL 전환
- Docker / 배포 구성
