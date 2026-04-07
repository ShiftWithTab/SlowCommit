# 🌱 Slow Commit (슬로우 커밋)

> **"내 목표의 성장을 캐릭터와 함께, 꾸준함의 가치를 시각화하다."**

**Slow Commit**은 사용자의 목표 달성 과정을 귀여운 캐릭터의 성장과 결합한 **성장형 갓생 관리 앱**입니다. 텍스트를 배제한 미니멀한 캘린더와 직관적인 캐릭터 진화를 통해 자칫 지루할 수 있는 실천의 과정을 즐거운 여정으로 변화시킵니다.

-----

## 📅 프로젝트 개요

* **개발 기간**: 2026.04.01 \~ 2026.04.11 (11일 집중 스프린트)
* **핵심 컨셉**: 캐릭터 성장 엔진 + 주기적 체크리스트 + 미니멀 캘린더 UI
* **개발 인원**: 2인 (기능 중심 Full-stack 개발)

-----

## 🛠 Tech Stack

| 분류 | 기술 스택 |
| :--- | :--- |
| **Frontend** | React Native (Expo/CLI) |
| **Backend** | Spring Boot, Java |
| **Database** | MySQL (AWS RDS) |
| **Communication** | Slack, GitHub |

-----

## 🚀 Key Features

### 1\. One-by-One 온보딩 (목표 설정)

* 사용자가 목표에만 집중할 수 있도록 단계별 입력을 유도합니다.
* 최종 목표, D-Day, 다짐 문구, 알람 주기, 초기 캐릭터를 순차적으로 설정합니다.
* 목표 설정 전까지 앱 사용을 제한하여 강력한 동기부여를 제공합니다.

### 2\. 캐릭터 성장 엔진 (10단계 진화)

* 실천율에 따라 캐릭터가 최대 10단계까지 실시간 진화합니다.
* **최종 결과 분기**:
    * **성공(100%)**: 학사모를 쓴 대학생 캐릭터 졸업 🎓
    * **진행중**: 실천율에 따른 청소년/성인 캐릭터 🐣
    * **실패**: 캐릭터 사망 및 묘비 노출 🪦

### 3\. 미니멀 캘린더 & 스마트 리마인더

* 텍스트 없이 날짜와 **이모지**로만 구성된 직관적인 인터페이스를 제공합니다.
* 설정된 주기(`alarm_cycle`)에 맞춰 체크리스트를 자동 생성합니다.
* 매일 저녁 8시, 미달성 항목에 대한 **푸시 알림**을 통해 실천을 독려합니다.

-----

## 👥 역할 분담 (Full-stack Division)

| 개발자 | 담당 도메인 & 주요 업무 |
| :--- | :--- |
| **@june0e (A)** | **[입력 시스템 & 캘린더 엔진]** <br> • One-by-One 목표 설정 UI 및 저장 API <br> • 캘린더 라이브러리 커스텀 및 이모지 렌더링 <br> • 다크/라이트 모드 테마 및 내비게이션 설계 |
| **@seorivn (B)** | **[성장 시스템 & 리마인더]** <br> • 캐릭터 10단계 성장 알고리즘 및 상태 관리 <br> • 주기별 체크리스트 자동 생성 및 푸시 알림 로직 <br> • D-Day 최종 판정 및 애니메이션 효과 구현 |

<table> <tr> <th>구분</th> <th>개발자 A (구조 & 입력 & 캘린더)</th> <th>개발자 B (로직 & 체크 & 알림)</th> </tr> <tr> <td><strong>핵심 목표</strong></td> <td>목표(Task) 생성 및 시각적 배치</td> <td>주기 실행 관리 및 성장 피드백 처리</td> </tr> <tr> <td><strong>DB 설계</strong></td> <td> users, categories, tasks 생성<br> Task: title, category, startDate, repeatCycle 저장 </td> <td> daily_tasks, character_levels 생성<br> DailyTask: target_date, completed, completed_at 관리 </td> </tr> <tr> <td><strong>핵심 기능</strong></td> <td> 목표 설정 UI:<br> 제목, 주기(repeatCycle), 카테고리 선택 및 Task 저장 </td> <td> DailyTask 자동 생성 로직:<br> 주기(repeatCycle)에 따라 시작일 기준 생성 </td> </tr> <tr> <td><strong>화면 구현</strong></td> <td> 메인 캘린더:<br> Task 기반 날짜별 이모지 렌더링 </td> <td> 대시보드:<br> 오늘 활성 DailyTask 노출 및 체크 완료 처리 </td> </tr> <tr> <td><strong>시스템 연동</strong></td> <td> 공통 테마(Light/Dark) 및 내비게이션 구조 설계 </td> <td> Scheduler:<br> 매일 자정 DailyTask 생성<br> Push 알림 예정 </td> </tr> <tr> <td><strong>데이터 접점</strong></td> <td> task_id 기반 Task 원본 데이터 제공 </td> <td> task_id 기반 DailyTask 활성 row 반환<br> 성장 단계(level 1~10) 계산 연결 예정 </td> </tr> </table>
-----

## 🤝 데이터 인터페이스 (Data Contract)

* **Auth**: 로그인 기능을 대체하기 위해 `CURRENT_USER_ID = 1` 상수를 고정 사용합니다.
* **Issues** 참고해서 개발합니다.

-----

## 🗓️ 개발 로드맵

### 1단계: Build-up (4/1 \~ 4/3)

* DB 스키마 설계 및 AWS RDS 연동
* 목표 설정 UI 및 주기별 체크리스트 생성 로직 완성

### 2단계: Core Logic (4/4 \~ 4/7)

* 캘린더 데이터 바인딩 및 이모지 표시 기능
* 오늘 할 일 체크 시스템 및 저녁 8시 푸시 알람 연동

### 3단계: Polishing (4/8 \~ 4/10)

* 달성률 기반 캐릭터 진화 애니메이션 테스트
* 최종 성공/실패 시나리오(상장 vs 묘비) 분기 처리

### 4단계: Launch (4/11)

* 최종 QA 및 프로젝트 종료 팝업 구현
* 팀원 간 최종 결과 공유 및 성과 회고
