<h1>🌱 Slow Commit (슬로우 커밋)</h1>

<p><strong>"내 목표의 성장을 캐릭터와 함께, 꾸준함의 가치를 시각화하다."</strong></p>

<p>
<strong>Slow Commit</strong>은 사용자의 목표 달성 과정을 캐릭터 성장과 연결해,
반복적인 목표 실천을 시각적으로 동기부여하는 <strong>성장형 루틴 관리 앱</strong>입니다.
목표 설정부터 DailyTask 생성, 완료율 기반 성장 단계 변화까지 하나의 흐름으로 연결되며,
사용자가 자신의 꾸준함을 직관적으로 확인할 수 있도록 설계했습니다.
</p>

<hr>

<h2>📅 프로젝트 개요</h2>

<ul>
  <li><strong>개발 기간</strong>: 2026.04.01 ~ 2026.04.11 (11일 집중 스프린트)</li>
  <li><strong>핵심 컨셉</strong>: 캐릭터 성장 + 주기적 체크리스트 + 미니멀 루틴 UI</li>
  <li><strong>개발 인원</strong>: 2인 (Full-stack 협업 프로젝트)</li>
</ul>

<hr>

<h2>🛠 Tech Stack</h2>

<table>
  <tr>
    <th>분류</th>
    <th>기술 스택</th>
  </tr>
  <tr>
    <td><strong>Frontend</strong></td>
    <td>React Native</td>
  </tr>
  <tr>
    <td><strong>Backend</strong></td>
    <td>Spring Boot, Java</td>
  </tr>
  <tr>
    <td><strong>Database</strong></td>
    <td>MySQL (AWS RDS)</td>
  </tr>
  <tr>
    <td><strong>Communication</strong></td>
    <td>Slack, GitHub</td>
  </tr>
</table>

<hr>

<h2>🚀 Key Features</h2>

<h3>1. One-by-One 온보딩 (목표 설정)</h3>
<ul>
  <li>단계별 입력 방식으로 목표 설정 진행</li>
  <li>목표명, 기간, 다짐 문구, 반복 주기(alarmCycle), 캐릭터 선택 저장</li>
  <li>GoalPlan / GoalConfig 생성 후 앱 메인 기능 연결</li>
</ul>

<h3>2. DailyTask 자동 생성 시스템</h3>
<ul>
  <li>설정된 반복 주기(alarmCycle)를 기준으로 DailyTask 자동 생성</li>
  <li>목표 기간(startDate ~ endDate)에 맞춰 targetDate 생성</li>
  <li>중복 생성 방지를 위한 unique 조건 적용</li>
</ul>

<h3>3. 성장 단계 시스템 (Level 1 ~ 10)</h3>
<ul>
  <li>DailyTask 완료 비율 기반 currentLevel 계산</li>
  <li>체크 완료 시 GoalPlan level 즉시 갱신</li>
  <li>메인 화면과 통계 화면에서 현재 성장 단계 표시</li>
</ul>

<h3>4. 미니멀 루틴 UI</h3>
<ul>
  <li>오늘의 활성 DailyTask 노출</li>
  <li>완료 체크 즉시 반영</li>
  <li>진행률 / streak / level 시각화</li>
</ul>

<hr>

<h2>👥 역할 분담 (Feature-based Full-stack Division)</h2>

<table>
  <tr>
    <th>개발자</th>
    <th>담당 도메인 & 주요 업무</th>
  </tr>

  <tr>
    <td><strong>@june0e (A)</strong></td>
    <td>
      <strong>목표 설정 & 캘린더 시스템 (로직 + UI)</strong><br>
      • 목표 설정(Onboarding) 흐름 및 API 연동<br>
      • 목표 생성(GoalDefinition / GoalPlan) 로직 처리<br>
      • 온보딩 및 입력 화면(UI) 구현<br>
      • 캘린더 컴포넌트 및 화면 UI 설계<br>
      • AsyncStorage 및 navigation 구조 관리<br>
      • 공통 테마(Light/Dark) 및 전체 UI 구조 관리
    </td>
  </tr>

  <tr>
    <td><strong>@seorivn (B)</strong></td>
    <td>
      <strong>DailyTask & 캐릭터 성장 시스템 (로직 + UI)</strong><br>
      • DailyTask 자동 생성 및 주기 관리 로직 구현<br>
      • DailyTask 완료(toggle) 및 수정 기능 구현<br>
      • 캐릭터 성장(level) 계산 및 상태 관리<br>
      • 레벨업 조건 및 성장 피드백(메시지) 로직 구현<br>
      • Scheduler 기반 자동 실행 처리<br>
      • Stats API 및 데이터 집계 로직 구현<br>
      • DailyTask / Stats / 캐릭터 관련 화면(UI) 구현
    </td>
  </tr>
</table>

<hr>

<h2>🤝 데이터 인터페이스 (Data Contract)</h2>

<ul>
  <li>사용자 식별값은 AsyncStorage 기반 USER_ID, GOAL_PLAN_ID로 관리</li>
  <li>GoalPlan 생성 이후 goalPlanId 기준으로 DailyTask 조회</li>
  <li>Frontend / Backend 간 currentLevel 동기화</li>
</ul>

<hr>

<h2>🗓️ 개발 로드맵</h2>

<h3>1단계: Build-up</h3>
<ul>
  <li>DB 스키마 설계</li>
  <li>GoalPlan / GoalConfig 저장 구조 완성</li>
</ul>

<h3>2단계: Core Logic</h3>
<ul>
  <li>DailyTask 생성 및 toggle 처리</li>
  <li>currentLevel 계산 연결</li>
</ul>

<h3>3단계: UI Binding</h3>
<ul>
  <li>Home / Stats / Dashboard 화면 연동</li>
  <li>AsyncStorage 데이터 연결</li>
</ul>

<h3>4단계: Final QA</h3>
<ul>
  <li>테스트 계정 기반 시나리오 검증</li>
  <li>DailyTask 생성 주기 및 level 반영 확인</li>
</ul>

<hr>

<h2>📌 현재 구현 완료 상태</h2>

<ul>
  <li>✅ GoalPlan 생성</li>
  <li>✅ GoalConfig 저장</li>
  <li>✅ DailyTask 자동 생성</li>
  <li>✅ DailyTask toggle</li>
  <li>✅ currentLevel 반영</li>
  <li>✅ Stats 조회</li>
  <li>⏳ Push 알림 예정</li>
</ul>
