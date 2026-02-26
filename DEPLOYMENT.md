# 기후변화로부터 지구를 지켜라! - 배포 가이드

## 🚀 빠른 시작

### 1. 의존성 설치
```bash
npm install
```

### 2. 개발 서버 실행
```bash
npm run dev
```

브라우저에서 `http://localhost:5173` 접속

## 📦 프로젝트 구조

```
saveearth-main/
├── components/          # React 컴포넌트
│   ├── TemperatureGauge.tsx
│   ├── CountrySelection.tsx
│   ├── HostView.tsx
│   ├── GuestView.tsx
│   └── AbilityPanel.tsx
├── services/           # 실시간 동기화 서비스
│   └── syncService.ts
├── App.tsx            # 메인 앱
├── types.ts           # TypeScript 타입 정의
├── constants.ts       # 게임 상수 및 퀴즈 데이터
├── gameLogic.ts       # 게임 로직 (능력, UN 회의, 코인 배분)
├── index.css          # Tailwind CSS
└── index.tsx          # 엔트리 포인트
```

## 🎮 게임 플레이 방법

### 교사 (호스트)
1. 방 코드 입력 (예: ROOM1)
2. "교사" 버튼 클릭
3. 퀴즈 8개 선택 (퀴즈 뱅크 또는 커스텀)
4. "다음" 버튼으로 단계 진행

### 학생 (게스트)
1. 같은 방 코드 입력
2. 닉네임 입력
3. "학생" 버튼 클릭
4. 국가 선택 (선착순)
5. 각 단계에서 선택/응답

## 🌐 Vercel 배포

### 방법 1: GitHub 연동 (권장)

1. GitHub 저장소 생성 및 푸시
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/your-username/saveearth.git
git push -u origin main
```

2. [Vercel](https://vercel.com) 접속
3. "New Project" 클릭
4. GitHub 저장소 선택
5. 자동 배포 완료!

### 방법 2: Vercel CLI

```bash
npm install -g vercel
vercel login
vercel
```

## 🔧 실시간 동기화

현재 **kvdb.io** 무료 서비스를 사용합니다.

### 다른 서비스로 변경하려면:

#### Supabase Realtime
1. [Supabase](https://supabase.com) 프로젝트 생성
2. `services/syncService.ts` 수정
3. 환경변수 설정

#### Firebase Realtime Database
1. Firebase 프로젝트 생성
2. `services/syncService.ts` 수정
3. 환경변수 설정

## 🎯 게임 규칙 요약

- **8턴** 진행
- 시작 온도: **15.0°C**
- 20.0°C 이상 시 **게임 종료**
- 각 턴: 개발 선택 (30초) → 퀴즈 (60초) → 회의 (180초)
- 4턴 후 **UN 환경보전회의** 자동 계산
- 최종 GP 순위로 코인 배분

## 🛠️ 문제 해결

### 빌드 오류
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### 실시간 동기화 안됨
- 방 코드가 동일한지 확인
- 네트워크 연결 확인
- 브라우저 콘솔에서 에러 확인

### 타입 오류
```bash
npm run build
```
TypeScript 오류를 확인하고 수정

## 📝 커스터마이징

### 퀴즈 추가
`constants.ts`의 `QUIZ_POOL` 배열에 추가:
```typescript
{ 
  id: 31, 
  question: "질문", 
  options: ["1", "2", "3", "4"], 
  answer: 0, 
  explanation: "설명" 
}
```

### 국가 GP 조정
`constants.ts`의 `COUNTRIES` 객체에서 `gp` 값 수정

### 타이머 시간 변경
`App.tsx`의 각 phase 전환 시 `timer` 값 수정

## 🎨 스타일 커스터마이징

`tailwind.config.js`에서 색상 및 애니메이션 수정
`index.css`에서 글로벌 스타일 수정

## 📱 모바일 지원

반응형 디자인으로 모바일/태블릿 지원
권장: 태블릿 이상 화면 크기

## 🔐 보안

- 실시간 DB는 공개 키 사용 (교육용)
- 프로덕션 환경에서는 인증 추가 권장

## 📄 라이선스

교육용 프로젝트

## 🤝 기여

이슈 및 PR 환영합니다!
