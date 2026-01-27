# My Portfolio Project
> "React와 Node.js로 구축한 풀스택 개인 포트폴리오 사이트입니다."

![Project Thumbnail](./client/public/logo192.png) *<!-- 로고나 대표 이미지가 있다면 교체해주세요 -->*

## 📖 Introduction
비전공자로서 국비지원 과정을 통해 Spring Boot를 학습한 후, 웹 개발의 또 다른 주축인 **React**와 **Node.js** 생태계를 직접 경험해보고자 시작한 프로젝트입니다.
단순히 보여주기식 페이지가 아니라, **Admin 대시보드**를 통해 프로젝트, 이력, 프로필 등을 직접 관리할 수 있는 **동적 CMS(Content Management System)** 형태로 개발했습니다.

## 🛠 Tech Stack

### Frontend
- **Framework**: React 18, Vite
- **Language**: TypeScript
- **State Management**: TanStack Query (React Query)
- **Styling**: CSS Modules, Vanilla CSS (Variables)
- **Deployment**: Vercel

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js (Layered Architecture 적용)
- **Database**: PostgreSQL (Supabase)
- **ORM**: Prisma
- **Storage**: Supabase Storage
- **Deployment**: Fly.io (Docker)

---

## ✨ Key Features

### 1. 🎨 User Interface (Client)
- **반응형 디자인**: PC, 태블릿, 모바일 등 다양한 디바이스 지원
- **동적 라우팅**: `react-router-dom` v6 사용
- **포트폴리오 쇼케이스**: 프로젝트 필터링 및 상세 보기
- **Contact**: 방문자가 메시지를 남길 수 있는 문의 폼

### 2. 🔐 Admin Dashboard
- **보안**: JWT 기반의 Access/Refresh Token 인증 및 HttpOnly Cookie 사용
- **콘텐츠 관리**: 
    - 프로젝트 생성/수정/삭제 (이미지 업로드 포함)
    - 이력서(Resume) 섹션 항목 관리
    - 기술 스택 및 프로필 정보 수정
- **대시보드 통계**: 방문자 수, 최근 활동 로그 확인
- **메시지 관리**: 방문자가 남긴 문의 확인 및 답장 기능

---

## 📂 Project Structure

```bash
📦 real-portfolio
 ┣ 📂 client              # Frontend (React + Vite)
 ┃ ┣ 📂 src
 ┃ ┃ ┣ 📂 api           # API 통신 로직 분리
 ┃ ┃ ┣ 📂 components    # 재사용 가능한 UI 컴포넌트
 ┃ ┃ ┣ 📂 hooks         # Custom Hooks
 ┃ ┃ ┣ 📂 pages         # 라우팅 페이지
 ┃ ┃ ┗ ...
 ┗ 📂 server              # Backend (Node.js + Express)
   ┣ 📂 prisma            # DB 스키마 및 마이그레이션
   ┣ 📂 src
   ┃ ┣ 📂 controllers   # 요청 처리 및 응답 반환
   ┃ ┣ 📂 services      # 비즈니스 로직
   ┃ ┣ 📂 middlewares   # 인증, 에러 핸들링, 로깅
   ┃ ┣ 📂 routes        # URL 라우팅 정의
   ┃ ┗ ...
```

---

## 💾 Database Design (ERD)

**Prisma**를 사용하여 다음과 같은 모델을 설계했습니다.

*   `Project`: 프로젝트 정보 (제목, 설명, 썸네일, 데모 링크 등)
*   `Profile`: 관리자 프로필 정보 (자기소개, 기술스택)
*   `Resume`: 학력 및 경력 사항 타임라인
*   `Admin / RefreshToken`: 관리자 계정 및 보안 토큰 관리
*   `VisitorLog / ActivityLog`: 방문자 및 관리자 활동 로깅
*   `ContactMessage`: 문의 및 답장 내역

---

## 이미지
<div style="display: flex; flex-wrap: wrap; align-items: flex-start; gap: 10px;">
<img width="48%" alt="스크린샷 2026-01-27 215139" src="https://github.com/user-attachments/assets/d295516b-5de3-467f-bdfb-22631818d3b6" />
<img width="48%" alt="스크린샷 2026-01-27 215157" src="https://github.com/user-attachments/assets/ffb9e093-e8a9-4eff-b88a-3398c81ac8aa" />
<img width="48%" alt="스크린샷 2026-01-27 215220" src="https://github.com/user-attachments/assets/f7469db1-4363-4cbd-a6c9-8c4ce52580ea" />
<img width="48%" alt="스크린샷 2026-01-27 215238" src="https://github.com/user-attachments/assets/5b2ad64b-8d12-46e6-9e8a-d5631cc28eaf" />
<img width="48%" alt="스크린샷 2026-01-27 215335" src="https://github.com/user-attachments/assets/06ae7e23-5587-48b3-a8a2-2760c44138a8" />
<img width="48%" alt="스크린샷 2026-01-27 215349" src="https://github.com/user-attachments/assets/206ac62d-f88d-40cc-970c-9457e95eb7d2" />
<img width="48%" alt="스크린샷 2026-01-27 215404" src="https://github.com/user-attachments/assets/f6f98bce-9c3b-4a35-a192-6d2cfa783350" />
<img width="48%" alt="스크린샷 2026-01-27 215420" src="https://github.com/user-attachments/assets/966aaf66-519e-43bf-af7c-67c77e03ea5f" />
</div>

## 🚀 Getting Started

### Prerequisites
*   Node.js (v18.x 이상)
*   PostgreSQL (Local 또는 Supabase)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/your-username/real-portfolio.git
    cd real-portfolio
    ```

2.  **Install dependencies**
    ```bash
    # Root 경로에서 한 번에 설치 (스크립트 활용)
    npm run install-all
    ```

3.  **Environment Setup (.env)**
    *   `client/.env`
        ```env
        VITE_API_URL=http://localhost:5000
        ```
    *   `server/.env`
        ```env
        DATABASE_URL="postgresql://..."
        JWT_SECRET="your_secret_key"
        SUPABASE_URL="..."
        SUPABASE_KEY="..."
        ```

4.  **Run Development Server**
    ```bash
    # Root 경로에서 실행 (Concurrently 사용)
    npm run dev
    ```
    *   Frontend: `http://localhost:5173`
    *   Backend: `http://localhost:5000`

---

## 💡 Learning Points
이 프로젝트를 통해 학습한 내용입니다.

*   **Layered Architecture**: Controller와 Service를 분리하여 유지보수성을 높였습니다.
*   **Global Error Handling**: 커스텀 에러 클래스와 미들웨어를 통해 일관된 에러 처리를 구현했습니다.
*   **React Query**: 서버 상태(Server State)를 효율적으로 관리하고 캐싱 전략을 학습했습니다.
*   **Authentication**: JWT와 Refresh Token Rotation 방식을 구현하여 보안 개념을 익혔습니다.

---
© 2024 Your Name. All rights reserved.
