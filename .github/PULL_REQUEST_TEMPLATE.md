# 아래 내용은 예시이니 해당하는 내용만 남긴 후 작성해주세요.

### 🚀 작업 요약
- 예: 주기별 체크리스트 자동 생성 로직 및 달성률 조회 API 구현

### 🛠️ 주요 변경 사항
#### 1. Backend (Spring Boot)
- [ ] **Entity/Repository**: (예: Checklist 엔티티 추가 및 QueryMethod 작성)
- [ ] **Service/Controller**: (예: 알람 주기에 따른 날짜 계산 로직 구현)
- [ ] **API Endpoint**: (예: GET /api/goals/{id}/progress 추가)

#### 2. Frontend (React Native)
- [ ] **Logic**: (예: 체크박스 클릭 시 서버 데이터 동기화 로직)
- [ ] **UI/UX**: (예: 오늘 할 일 목록 컴포넌트 구현)

#### 3. Database (MySQL / RDS)
- [ ] **Schema 변경**: (예: checklists 테이블에 target_date 인덱스 추가)
- [ ] **Data**: (예: 테스트용 캐릭터 레벨 데이터 10개 삽입)

### 🧪 테스트 및 검증 결과
- [ ] **Unit Test**: (예: 3일 주기 설정 시 11일간 4회 생성 확인)
- [ ] **API Test**: Postman을 통한 응답값(JSON) 검증 완료
- [ ] **UI Test**: 시뮬레이터에서 체크박스 토글 시 실시간 달성률 반영 확인

### 📸 스크린샷 (선택 사항)

### ⚠️ 리뷰어(@OOO) 전달 사항
- **주의**: DB 스키마가 변경되었으니 `git pull` 후 로컬 DB를 업데이트해 주세요.
- **연동 필요**: 목표 저장 시 제가 만든 `initChecklist()` API가 호출되도록 프론트 연결 부탁드립니다.
