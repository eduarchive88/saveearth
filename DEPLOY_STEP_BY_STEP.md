# 🚀 배포 가이드 (단계별)

## 📋 사전 준비

1. **Git 설치 확인**
```bash
git --version
```
설치 안되어 있으면: https://git-scm.com/downloads

2. **GitHub 계정 생성**
https://github.com 에서 무료 계정 생성

3. **Vercel 계정 생성**
https://vercel.com 에서 GitHub 계정으로 로그인

---

## 🔥 1단계: GitHub에 업로드

### 1-1. GitHub 저장소 생성
1. https://github.com 접속 및 로그인
2. 우측 상단 `+` 버튼 → `New repository` 클릭
3. Repository name: `saveearth` (또는 원하는 이름)
4. Public 선택
5. `Create repository` 클릭

### 1-2. 로컬 프로젝트를 GitHub에 푸시

프로젝트 폴더에서 터미널 열고:

```bash
# Git 초기화
git init

# 모든 파일 추가
git add .

# 첫 커밋
git commit -m "Initial commit: Climate War Game"

# 기본 브랜치를 main으로 설정
git branch -M main

# GitHub 저장소 연결 (YOUR_USERNAME을 본인 GitHub 아이디로 변경)
git remote add origin https://github.com/YOUR_USERNAME/saveearth.git

# 푸시
git push -u origin main
```

**예시:**
```bash
git remote add origin https://github.com/eduar/saveearth.git
```

### 1-3. GitHub에서 확인
브라우저에서 `https://github.com/YOUR_USERNAME/saveearth` 접속하여 파일이 업로드되었는지 확인

---

## 🌐 2단계: Vercel에 배포

### 2-1. Vercel에서 프로젝트 가져오기
1. https://vercel.com 접속 및 로그인
2. `Add New...` → `Project` 클릭
3. GitHub 저장소 목록에서 `saveearth` 찾기
4. `Import` 클릭

### 2-2. 프로젝트 설정
- **Framework Preset**: Vite (자동 감지됨)
- **Root Directory**: `./` (기본값)
- **Build Command**: `npm run build` (자동 설정됨)
- **Output Directory**: `dist` (자동 설정됨)

### 2-3. 배포 시작
1. `Deploy` 버튼 클릭
2. 1-2분 대기 (빌드 진행)
3. 배포 완료! 🎉

### 2-4. 배포된 URL 확인
- 배포 완료 후 `https://saveearth-xxx.vercel.app` 형태의 URL 생성
- 이 URL을 학생들과 공유하면 됩니다!

---

## 🔄 3단계: 코드 수정 후 재배포

코드를 수정한 후:

```bash
# 변경사항 추가
git add .

# 커밋
git commit -m "Update: 설명"

# 푸시
git push
```

**자동으로 Vercel이 감지하여 재배포됩니다!**

---

## 🎯 빠른 테스트 방법

### 로컬에서 테스트
```bash
npm run dev
```
→ `http://localhost:5173` 접속

### 프로덕션 빌드 테스트
```bash
npm run build
npm run preview
```
→ `http://localhost:4173` 접속

---

## 🛠️ 문제 해결

### Git 푸시 오류
```bash
# 인증 오류 시 Personal Access Token 사용
# GitHub → Settings → Developer settings → Personal access tokens → Generate new token
# repo 권한 체크 후 생성
# 비밀번호 대신 토큰 입력
```

### Vercel 빌드 실패
1. 로컬에서 `npm run build` 실행하여 오류 확인
2. Vercel 대시보드에서 빌드 로그 확인
3. `node_modules` 삭제 후 재설치:
```bash
rm -rf node_modules package-lock.json
npm install
```

### 실시간 동기화 안됨
- kvdb.io 서비스가 정상인지 확인
- 브라우저 콘솔에서 네트워크 오류 확인
- 방 코드가 정확히 일치하는지 확인

---

## 📱 커스텀 도메인 설정 (선택사항)

1. Vercel 프로젝트 → Settings → Domains
2. 본인 도메인 입력 (예: `climatewar.com`)
3. DNS 설정 안내에 따라 도메인 제공업체에서 설정
4. 완료!

---

## 🎓 교실에서 사용하기

### 준비물
- 교사용 기기 1대 (PC/태블릿)
- 학생용 기기 9대 (스마트폰/태블릿/PC)
- 인터넷 연결

### 진행 방법
1. 교사가 배포된 URL 접속
2. 방 코드 생성 (예: `CLASS1`)
3. 학생들에게 URL과 방 코드 공유
4. 학생들이 접속하여 국가 선택
5. 게임 시작!

---

## 📊 성능 최적화 (선택사항)

### 이미지 최적화
- 배경 이미지를 WebP 형식으로 변환
- 이미지 크기 최적화 (1920x1080 이하)

### 번들 크기 줄이기
```bash
npm run build
# dist 폴더 크기 확인
```

---

## 🔒 보안 고려사항

현재 구현은 **교육용**으로 설계되었습니다.

프로덕션 환경에서는:
- 실시간 DB에 인증 추가
- Rate limiting 구현
- 방 코드 암호화
- 사용자 입력 검증 강화

---

## 📞 지원

문제가 발생하면:
1. GitHub Issues에 문의
2. Vercel 대시보드에서 로그 확인
3. 브라우저 개발자 도구 콘솔 확인

---

<div align="center">
  <h3>🎉 배포 완료! 이제 게임을 즐기세요! 🌍</h3>
</div>
