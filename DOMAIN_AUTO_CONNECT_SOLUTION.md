# Vercel 도메인 자동 연결 근본 해결 방안

**날짜**: 2025-11-02  
**문제**: Vercel 배포 후 커스텀 도메인이 자동으로 최신 배포에 연결되지 않음

---

## 문제 원인

Vercel은 기본적으로 프로덕션 배포가 완료되면 프로덕션 도메인에 자동 연결되어야 하나, 현재는 그렇지 않은 상황입니다. 이는 다음 중 하나일 수 있습니다:

1. **Vercel의 설정 문제**: 프로젝트 설정에서 도메인 자동 연결 옵션이 비활성화되어 있을 수 있음
2. **권한 문제**: 팀 계정에서 도메인 자동 연결 권한 문제
3. **Vercel 플랫폼 변경**: Vercel의 정책 변경으로 인한 동작 변화

---

## 해결 방안

### 방안 1: 자동화 스크립트 사용 (권장) ⭐

배포 후 자동으로 도메인을 연결하는 스크립트를 실행합니다.

**사용법:**
```bash
# npm 스크립트로 실행
npm run connect-domain

# 또는 직접 실행
./scripts/auto-connect-domain.sh
```

**작동 방식:**
1. 최신 Production 배포 찾기
2. 현재 도메인 연결 상태 확인
3. 최신 배포와 다르면 자동 연결
4. 이미 연결되어 있으면 스킵

**장점:**
- 즉시 사용 가능
- 중복 연결 방지
- 상태 확인 후 연결

---

### 방안 2: GitHub Actions 자동화

GitHub Actions를 통해 배포 후 자동으로 도메인을 연결합니다.

**필요한 설정:**
1. GitHub 저장소 → Settings → Secrets and variables → Actions
2. 다음 Secrets 추가:
   - `VERCEL_TOKEN`: Vercel CLI 토큰
   - `VERCEL_ORG_ID`: `team_iZrhMGkZBE4WQ7bSyAn7dCls`
   - `VERCEL_PROJECT_ID`: `prj_yixVLt9PaMPoqX5yNsJE0xF9kI7K`

**Vercel 토큰 생성 방법:**
1. Vercel 대시보드 → Settings → Tokens
2. 새 토큰 생성 (이름: GitHub Actions)
3. 생성된 토큰을 GitHub Secrets에 추가

**작동 방식:**
- main 브랜치에 푸시하면 자동 실행
- 배포 완료 대기 (60초)
- 최신 배포 확인 후 도메인 연결
- 결과 확인 및 로그 출력

**파일 위치:** `.github/workflows/auto-domain-alias.yml`

---

### 방안 3: Vercel 대시보드 설정 확인

**확인해야 할 설정:**
1. Vercel 대시보드 → 프로젝트 선택 → Settings → Domains
2. 각 도메인(`www.divetobada.com`, `divetobada.com`)의 설정 확인
3. "Auto-assign to Production Deployments" 옵션이 활성화되어 있는지 확인

**주의사항:**
- 이 옵션이 없거나 비활성화되어 있으면 자동 연결이 작동하지 않음
- 팀 계정 권한에 따라 이 옵션이 보이지 않을 수 있음

---

### 방안 4: 수동 연결 (임시 해결책)

매번 배포 후 수동으로 연결합니다.

```bash
# 최신 배포 확인
npx vercel ls --scope tagrag90s-projects bada5-0 | grep "Ready.*Production" | head -1

# 도메인 연결
npx vercel alias set [최신배포URL] www.divetobada.com
npx vercel alias set [최신배포URL] divetobada.com
```

---

## 권장 사용 흐름

### 즉시 해결 (현재)
```bash
npm run connect-domain
```

### 장기적 해결
1. GitHub Actions 설정 (방안 2)
2. Vercel 대시보드 설정 확인 (방안 3)
3. 필요 시 스크립트 수동 실행 (방안 1)

---

## 파일 구조

```
프로젝트/
├── .github/
│   └── workflows/
│       └── auto-domain-alias.yml  # GitHub Actions 워크플로우
├── scripts/
│   └── auto-connect-domain.sh        # 자동 연결 스크립트
└── package.json                      # connect-domain 스크립트 추가됨
```

---

## 추가 고려사항

### Vercel CLI 인증
로컬에서 스크립트를 실행하려면 Vercel CLI에 로그인되어 있어야 합니다:
```bash
npx vercel login
```

### 스크립트 실행 권한
```bash
chmod +x scripts/auto-connect-domain.sh
```

### 에러 처리
스크립트는 다음 상황에서 실패할 수 있습니다:
- Vercel CLI가 설치되지 않음
- Vercel에 로그인되지 않음
- 최신 배포를 찾을 수 없음
- 네트워크 오류

모든 경우에 명확한 에러 메시지를 출력합니다.

---

## 결론

**즉시 적용 가능한 해결책**: `npm run connect-domain` 스크립트 사용  
**장기적 해결책**: GitHub Actions 자동화 또는 Vercel 대시보드 설정 확인

이제 배포 후 도메인 연결 문제가 자동으로 해결됩니다.

---

**© 2025 Studio_bada. All Rights Reserved.**

