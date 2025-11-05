# Vercel 배포 도메인 수동 연결 가이드

## 문제 상황

GitHub에 푸시 후 Vercel 자동 배포가 성공적으로 완료되어도, `www.divetobada.com` 도메인에 변경사항이 자동으로 반영되지 않는 경우가 있습니다.

## 원인

- Vercel의 자동 배포는 새로운 배포를 생성하지만, 도메인 alias가 자동으로 업데이트되지 않을 수 있음
- 이전 배포에 연결된 도메인이 유지되어 최신 배포가 반영되지 않음

## 해결 방법

### 1. 최신 Production 배포 확인

```bash
npx vercel ls bada5-0 | grep "Production" | head -1
```

출력 예시:
```
10m     https://bada5-0-2vb8wuezw-tagrag90s-projects.vercel.app     ● Ready     Production
```

### 2. 최신 배포를 도메인에 수동 연결

```bash
# 최신 배포 URL 추출 및 연결
LATEST_DEPLOY=$(npx vercel ls bada5-0 | grep "Production" | head -1 | awk '{print $2}')
npx vercel alias set $LATEST_DEPLOY www.divetobada.com
npx vercel alias set $LATEST_DEPLOY divetobada.com
```

### 3. 연결 확인

```bash
npx vercel alias ls | grep -E "divetobada|bada5-0.*Production"
```

## 프로젝트 정보

- **프로젝트명**: `bada5-0`
- **도메인**: `www.divetobada.com`, `divetobada.com`
- **연결 방법**: Vercel alias 명령 사용

## 주의사항

- 배포 후 항상 도메인 연결 상태를 확인해야 함
- 최신 배포가 Production 환경인지 확인
- 여러 배포가 있을 경우 가장 최근(최상단) 배포를 사용

## 자동화 가능성

향후 GitHub Actions나 Vercel Webhook을 통해 자동화할 수 있으나, 현재는 수동 연결이 필요합니다.

---

**작성일**: 2025-01-00  
**작성자**: Studio_bada  
**Copyright**: © 2025 Studio_bada. All Rights Reserved.

