# Vercel 도메인 연결 문제 해결 기록

**날짜**: 2025-11-02  
**작성자**: AI Assistant  
**프로젝트**: junseo-bada / divetobada.com  
**상태**: ✅ 해결 완료

---

## 문제 상황

### 증상
- Vercel 기본 URL (`https://bada5-0-f0vrw988f-tagrag90s-projects.vercel.app`)에는 최신 변경사항이 반영됨
- 커스텀 도메인 (`www.divetobada.com`, `divetobada.com`)에는 변경사항이 전혀 반영되지 않음
- 8일 전 마지막 배포 이후의 모든 배포가 도메인에 연결되지 않은 상태

### 배경
- GitHub와 Vercel에 공동 작업자로 초대되어 있음
- 메인 브랜치에 연결되어 있으며, 거의 1년간 정상 배포 진행 중
- 8일 전까지는 같은 방식으로 정상 작동했음

---

## 진단 과정

### 1. 프로젝트 및 배포 상태 확인

**확인된 정보:**
- 프로젝트: `bada5-0` (Vercel)
- 최신 Production 배포: `bada5-0-ji3z70b3g-tagrag90s-projects.vercel.app` (3일 전, 2025-10-30)
- 현재 도메인이 가리키는 배포: `bada5-0-1hjzllklm-tagrag90s-projects.vercel.app` (8일 전, 2025-10-25)

### 2. 도메인 별칭 상태 확인

**8일 전 배포 (구 연결):**
```
✅ https://bada5-0.vercel.app
✅ https://www.divetobada.com
✅ https://bada5-0-tagrag90s-projects.vercel.app
✅ https://bada5-0-git-main-tagrag90s-projects.vercel.app
✅ https://divetobada.com
```

**최신 배포 (3일 전):**
```
❌ www.divetobada.com - 연결 없음
❌ divetobada.com - 연결 없음
✅ https://bada5-0-tagrag90s-projects.vercel.app
✅ https://bada5-0-git-main-tagrag90s-projects.vercel.app
```

### 3. 원인 분석

**결론:**
- Vercel에서 Production 배포가 자동으로 프로덕션 도메인에 연결되지 않았음
- 최신 배포(`bada5-0-ji3z70b3g`)는 Production으로 배포되었으나, 커스텀 도메인 별칭이 자동 연결되지 않음
- 8일 전 배포는 정상적으로 도메인에 연결되어 있었으나, 이후 배포들에서 연결이 누락됨

---

## 해결 방법

### 사용된 방법: Vercel CLI를 통한 수동 별칭 연결

**실행 명령:**

```bash
# 1. 최신 Production 배포 확인
npx vercel ls --scope tagrag90s-projects bada5-0 | grep "Ready.*Production" | head -1

# 2. www.divetobada.com 별칭 연결
npx vercel alias set https://bada5-0-ji3z70b3g-tagrag90s-projects.vercel.app www.divetobada.com

# 3. divetobada.com 별칭 연결
npx vercel alias set https://bada5-0-ji3z70b3g-tagrag90s-projects.vercel.app divetobada.com
```

**실행 결과:**
```
✅ Success! https://www.divetobada.com now points to https://bada5-0-ji3z70b3g-tagrag90s-projects.vercel.app
✅ Success! https://divetobada.com now points to https://bada5-0-ji3z70b3g-tagrag90s-projects.vercel.app
```

---

## 확인 사항

### 로컬 환경 변수
- `.env`: `NEXT_PUBLIC_BASE_URL=http://localhost:3000` (로컬 개발용)
- `.env.local`: Vercel Blob 토큰 등

### Vercel 프로젝트 정보
- 프로젝트 ID: `prj_yixVLt9PaMPoqX5yNsJE0xF9kI7K`
- 프로젝트명: `bada5-0`
- Node.js 버전: 20.x
- 프레임워크: Next.js

---

## 해결 결과

✅ **성공**: `www.divetobada.com`과 `divetobada.com`이 최신 배포에 정상 연결됨

**변경사항 반영:**
- DNS 캐시로 인해 즉시 반영되거나 최대 5-10분 소요 가능
- 브라우저 캐시 클리어 시 즉시 확인 가능

---

## 향후 예방 방안

### 1. 자동 연결 설정 확인
- Vercel 대시보드 → Settings → Domains에서 자동 연결 설정 확인
- 프로덕션 배포 시 자동으로 도메인에 연결되도록 설정되어 있는지 확인

### 2. 배포 후 확인 절차
배포 완료 후 다음 명령으로 도메인 연결 상태 확인:
```bash
npx vercel inspect www.divetobada.com | grep -A 10 "Aliases"
```

### 3. 문제 재발 시 해결 방법
최신 배포에 도메인 별칭을 수동으로 연결:
```bash
# 최신 Production 배포 URL 확인
LATEST_DEPLOY=$(npx vercel ls --scope tagrag90s-projects bada5-0 | grep "Ready.*Production" | head -1 | awk '{print $2}')

# 별칭 연결
npx vercel alias set $LATEST_DEPLOY www.divetobada.com
npx vercel alias set $LATEST_DEPLOY divetobada.com
```

---

## 참고 자료

- [Vercel CLI Documentation](https://vercel.com/docs/cli)
- [Vercel Alias Commands](https://vercel.com/docs/cli/alias)

---

## 기타 참고사항

- GitHub와 Vercel 연동은 정상 작동 중
- 메인 브랜치 푸시 시 자동 배포는 정상 작동
- 도메인 연결만 자동화되지 않았던 것으로 확인
- 향후 배포에서 동일 문제 발생 가능성 있음

---

**© 2025 Studio_bada. All Rights Reserved.**

