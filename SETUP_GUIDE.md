# 찬이 (Chan-i) 설치 및 실행 가이드

## 📋 사전 준비사항

이 프로젝트를 실행하기 위해서는 다음이 필요합니다:

- **Node.js** (버전 16 이상)
- **npm** (Node Package Manager)

### Node.js 설치 확인

터미널에서 다음 명령어를 실행하여 설치 여부를 확인하세요:

```bash
node --version
npm --version
```

설치되어 있지 않다면, [Node.js 공식 웹사이트](https://nodejs.org/)에서 다운로드하세요.

---

## 🚀 설치 및 실행

### 1단계: 의존성 설치

프로젝트 폴더에서 다음 명령어를 실행하세요:

```bash
cd C:\Users\user\Desktop\Chanii
npm install
```

이 명령어는 다음을 설치합니다:
- React 18
- Vite (빌드 도구)
- Tailwind CSS (스타일링)
- Framer Motion (애니메이션)
- Lucide React (아이콘)

### 2단계: 개발 서버 실행

```bash
npm run dev
```

성공적으로 실행되면 다음과 같은 메시지가 표시됩니다:

```
  VITE v5.0.8  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### 3단계: 브라우저에서 접속

웹 브라우저를 열고 다음 주소로 이동하세요:

```
http://localhost:5173
```

---

## 🎮 앱 사용 방법

### 메인 화면
- **찬이 캐릭터**가 현재 냉장고 상태를 알려줍니다
- 레벨, 경험치, 코인을 확인할 수 있습니다
- "냉장고 문 열기" 버튼을 클릭하여 인벤토리로 이동

### 인벤토리 관리
- **냉장**, **냉동**, **실온** 탭을 전환하며 식재료를 확인
- 카드를 클릭하면 냉장 ↔ 냉동 전환 가능
- **+ 추가** 버튼으로 새 식재료 등록
- 신선도 바로 유통기한 확인 (초록/노랑/빨강)

### 레시피 탐색
- 카테고리로 레시피 필터링
- 조리 도구로 추가 필터링
- 레시피 클릭하여 상세 정보 확인
- **재료 대체** 버튼을 눌러 RAG 기능 체험
- "요리 완료" 버튼으로 경험치와 코인 획득

---

## 📦 프로젝트 구조

```
Chanii/
├── src/
│   ├── components/     # 재사용 컴포넌트
│   ├── pages/          # 페이지 컴포넌트
│   ├── data/           # Mock 데이터
│   ├── App.jsx         # 메인 앱
│   ├── main.jsx        # 진입점
│   └── index.css       # 전역 스타일
├── index.html          # HTML 템플릿
├── package.json        # 의존성 목록
├── tailwind.config.js  # Tailwind 설정
└── vite.config.js      # Vite 설정
```

---

## 🛠️ 유용한 명령어

### 개발 서버 실행
```bash
npm run dev
```

### 프로덕션 빌드
```bash
npm run build
```
빌드된 파일은 `dist/` 폴더에 생성됩니다.

### 프로덕션 빌드 미리보기
```bash
npm run preview
```

---

## ⚠️ 문제 해결

### 포트가 이미 사용 중인 경우

다른 포트에서 실행하려면:
```bash
npm run dev -- --port 3000
```

### 의존성 설치 오류

캐시를 삭제하고 재설치:
```bash
rm -rf node_modules package-lock.json
npm install
```

### 화면이 제대로 표시되지 않는 경우

1. 브라우저 캐시를 삭제하세요 (Ctrl + Shift + Delete)
2. 개발 서버를 재시작하세요
3. 다른 모던 브라우저를 시도하세요 (Chrome, Firefox, Edge)

---

## 💡 기술 스택

- **React 18**: UI 라이브러리
- **Vite**: 빠른 개발 서버 및 빌드 도구
- **Tailwind CSS**: 유틸리티 기반 CSS 프레임워크
- **Framer Motion**: 애니메이션 라이브러리
- **Lucide React**: 아이콘 라이브러리

---

## 📱 권장 환경

- **브라우저**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **화면**: 최소 1024x768 해상도 (모바일 대응)
- **인터넷**: 필요 없음 (로컬 실행)

---

## 🎯 주요 기능

✨ 귀여운 찬이 캐릭터가 냉장고 상태에 반응  
🎮 레벨, 경험치, 코인 시스템  
📊 신선도 신호등 표시  
🔄 냉장 ↔ 냉동 전환  
🍳 RAG 기반 레시피 대체 재료 추천  
🎨 따뜻한 파스텔 톤 UI  
✨ 부드러운 Framer Motion 애니메이션

---

즐거운 요리 되세요! 🍳✨
