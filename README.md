# 2025 부경대 자바개발자과정 MiniProject(2) - 부가세(?)

---

## 🔍 프로젝트 소개

> **이름 (설명)**  
> **Oracle DB, Spring Boot, React, Python(Pandas)**를 활용하여  
> **지도 기반 보안등 및 CCTV 위치 표시, 제보 기능, 히트맵 시각화**가 가능한  
> **커뮤니티 보안 플랫폼**입니다.

- 📅 **개발 기간**: `2025.06.13 ~ 2025.06.25`

---

## 👨‍👩‍👧‍👦 팀 구성

- 박수민 : DB 설계 및 생성
- 이동호 : 공공데이터 탐색 및 수집
- 정서영 : 데이터 전처리 (Pandas)
- 정희성 : UI/UX 디자인 (Figma)

---

## 🛠 기술 스택

![Oracle](https://img.shields.io/badge/Oracle-F80000?style=flat-square&logo=oracle&logoColor=white) ![Python](https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white) ![Pandas](https://img.shields.io/badge/Pandas-150458?style=flat-square&logo=pandas&logoColor=white) ![Spring Boot](https://img.shields.io/badge/SpringBoot-6DB33F?style=flat-square&logo=springboot&logoColor=white) ![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black)

---

## ✅ 주요 기능 요약

### 🔐 로그인

- 로그인
- 회원가입 이동
- **비밀번호 5회 오류 시 계정 잠금 처리**

### 🔐 회원가입

- 회원가입, 아이디 중복 확인

### 👤 마이페이지

- 회원정보 변경
- 탈퇴 기능

### 🗺 메인페이지 (지도 기반)

- **보안등**, **CCTV**, **시민 제보** 핀으로 시각화
- 위치 검색 기능
- 핀 클릭 시 상세 정보 및 제보 보기 가능

### 📢 제보 게시판

- 제보 게시글 등록 (사진/위치 포함 가능)
- 댓글 / 대댓글 기능
- 신고 및 관리자 삭제 기능

---

구현 이미지 첨부예정

---

## 🗓 개발 일정

| 날짜       | 작업 내용                                 |
| ---------- | ----------------------------------------- |
| 📅 6/13    | 주제 선정, 역할 분배, 데이터 수집 시작    |
| 📅 6/14    | Oracle DB 설계, ERD 작성, Figma로 UI 설계 |
| 📅 6/15    |                                           |
| 📅 6/16    |                                           |
| 📅 6/17    |                                           |
| 📅 6/24~25 | 통합 테스트 및 발표 자료 제작             |

---

#### 📊 데이터 시각화

| 항목           | 설명                           |
| -------------- | ------------------------------ |
| 🟡 보안등 위치 | 공공데이터 기반 지도 시각화    |
| 🔴 범죄 히트맵 | ?                              |
| 🟠 시민 제보   | 위치 + 사진 + 핀 + 게시글 연결 |

---

## 🌟 프로젝트 특징

- Oracle + Spring Boot 실시간 연동 (조작)
- 지도 기반 시각화 구현
- 제보 시스템, 댓글 기능 등 커뮤니티 플랫폼
- 공공데이터 기반 분석 (부산지역 가로등/범죄정보 활용)

---

## 📌 앞으로의 확장 방향

### 🌍 지역 확대

- [ ] 부산 → 전국 확대
<!-- - [ ] 구/동별 범죄 통계 및 분석   -->

### 📱 모바일 어플 구현

- [ ]

### 🧠 AI 기반 위험도 예측

- [ ] 시간대별 위험도 분석
- [ ] 혼잡도/조도 정보 기반 위험 경보
