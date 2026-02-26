# 🌍 기후변화로부터 지구를 지켜라!

<div align="center">
  <h3>실시간 멀티플레이어 교육용 기후 게임</h3>
  <p>React + TypeScript + Tailwind CSS + Framer Motion</p>
</div>

## 🎮 게임 소개

교실에서 여러 학생이 동시에 참여하는 실시간 기후 변화 시뮬레이션 게임입니다.
- 9개 국가 중 하나를 선택
- 경제 발전과 환경 보호 사이의 균형 찾기
- 국가별 특수 능력 활용
- 실시간 퀴즈 및 협상
- 최종 코인 획득 경쟁

## ✨ 주요 기능

### 🎯 게임 메커니즘
- **8턴** 진행 (각 턴: 개발 선택 → 퀴즈 → 회의)
- **실시간 동기화** (교사 1명 + 학생 최대 9명)
- **온도 관리** (15°C 시작, 20°C 이상 시 게임 오버)
- **GP(개발포인트) 시스템**
- **4턴 후 UN 환경보전회의** 자동 계산
- **최종 코인 배분** (온도 구간별 차등 지급)

### 🌏 9개 국가 & 특수 능력
1. **🇰🇷 대한민국** - 녹색성장 (가위바위보 대결)
2. **🇺🇸 미국** - CCS 기술 (퀴즈 정답 시 기온 -0.5°C)
3. **🇸🇪 스웨덴** - 인간 환경 선언 (전원 환경 우선 시 보너스)
4. **🇯🇵 일본** - 교토의정서 (경제 우선 국가 강제 환경 우선)
5. **🇹🇻 투발루** - 가라앉는 섬 (GP 기부 요청)
6. **🇩🇰 덴마크** - 코펜하겐 협약 (상위 3국 강제 환경 우선)
7. **🇫🇷 프랑스** - 파리협약 (전 국가 강제 환경 우선)
8. **🇧🇷 브라질** - 리우 회의 (경제/환경 선택 반전)
9. **🇰🇵 북한** - 핵 발사 (기온 +1.0°C)

### 📚 퀴즈 시스템
- **30개 기본 퀴즈** (기후 변화, 환경 보호 관련)
- **커스텀 퀴즈 추가** 기능
- 오답/미제출 시 기온 +0.1°C

## 🚀 빠른 시작

### 필수 요구사항
- Node.js 18+ 

### 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 프리뷰
npm run preview
```

브라우저에서 `http://localhost:5173` 접속

## 🎓 사용 방법

### 교사 (호스트)
1. 방 코드 입력 (예: `ROOM1`)
2. "교사" 버튼 클릭
3. **퀴즈 설정**: 8개 퀴즈 선택 (기본 퀴즈 또는 커스텀)
4. 각 단계에서 "다음" 버튼으로 진행
5. 국가 현황 모니터링
6. 특수 능력 발동 관리

### 학생 (게스트)
1. 교사와 같은 방 코드 입력
2. 닉네임 입력
3. "학생" 버튼 클릭
4. **국가 선택** (선착순, 중복 불가)
5. 각 단계에서 선택/응답:
   - **개발 단계**: 경제 우선 / 균형 개발 / 환경 우선
   - **퀴즈 단계**: 4지선다 문제 풀기
   - **회의 단계**: 대기 (교사가 진행)

## 📁 프로젝트 구조

```
saveearth-main/
├── components/              # React 컴포넌트
│   ├── TemperatureGauge.tsx    # 온도 게이지
│   ├── CountrySelection.tsx    # 국가 선택 화면
│   ├── HostView.tsx            # 교사 화면
│   ├── GuestView.tsx           # 학생 화면
│   └── AbilityPanel.tsx        # 능력 발동 패널
├── services/
│   └── syncService.ts       # 실시간 동기화 (kvdb.io)
├── App.tsx                  # 메인 앱
├── gameLogic.ts            # 게임 로직 (능력, UN, 코인)
├── types.ts                # TypeScript 타입
├── constants.ts            # 게임 상수 & 퀴즈
├── index.css               # Tailwind CSS
├── tailwind.config.js      # Tailwind 설정
└── vite.config.ts          # Vite 설정
```

## 🌐 배포

### Vercel (권장)

1. GitHub에 푸시
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/your-username/saveearth.git
git push -u origin main
```

2. [Vercel](https://vercel.com) 접속
3. "New Project" → GitHub 저장소 선택
4. 자동 배포 완료!

### Vercel CLI
```bash
npm install -g vercel
vercel login
vercel
```

## 🔧 기술 스택

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **Build Tool**: Vite
- **Realtime Sync**: kvdb.io (무료 key-value 스토어)
- **Deployment**: Vercel

## 🎨 커스터마이징

### 퀴즈 추가
`constants.ts` 파일의 `QUIZ_POOL` 배열에 추가:
```typescript
{
  id: 31,
  question: "새로운 질문?",
  options: ["선택1", "선택2", "선택3", "선택4"],
  answer: 0, // 정답 인덱스 (0-3)
  explanation: "설명"
}
```

### 국가 초기 GP 조정
`constants.ts`의 `COUNTRIES` 객체에서 `gp` 값 수정

### 타이머 시간 변경
`App.tsx`의 `handleNextPhase` 함수에서 각 phase의 `timer` 값 수정

### 색상 테마 변경
`tailwind.config.js`에서 색상 팔레트 수정

## 🎯 게임 규칙 상세

### 개발 선택
- **경제 우선**: +10 GP
- **균형 개발**: +8 GP
- **환경 우선**: +5 GP

### UN 환경보전회의 (4턴 후)
총 GP에 따른 기온 변화:
- 45 이하: -0.2°C
- 46-55: +0.1°C
- 56-65: +0.3°C
- 66-75: +0.6°C
- 76-85: +0.9°C
- 86 이상: +1.2°C

### 최종 코인 배분
온도 구간별 1~3위 코인:
- 15.0-15.9°C: 4500 / 4000 / 2500
- 16.0-16.9°C: 3600 / 3200 / 2000
- 17.0-17.9°C: 2700 / 2400 / 1500
- 18.0-18.9°C: 1700 / 1600 / 1000
- 19.0-19.9°C: 900 / 800 / 500
- 20.0°C 이상: 0 (게임 오버)

## 🐛 문제 해결

### 실시간 동기화 안됨
- 방 코드가 정확히 일치하는지 확인
- 인터넷 연결 확인
- 브라우저 콘솔에서 에러 확인

### 빌드 오류
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

## 📝 TODO

- [ ] 투발루 능력 투표 UI 완성
- [ ] 사운드 이펙트 추가
- [ ] 게임 리플레이 기능
- [ ] 통계 대시보드
- [ ] 다국어 지원

## 📄 라이선스

MIT License - 교육용 프로젝트

## 🤝 기여

이슈 및 PR을 환영합니다!

## 📧 문의

프로젝트 관련 문의사항은 이슈로 남겨주세요.

---

<div align="center">
  <p>Made with ❤️ for Climate Education</p>
  <p>🌱 지구를 지키는 것은 우리 모두의 책임입니다 🌍</p>
</div>
