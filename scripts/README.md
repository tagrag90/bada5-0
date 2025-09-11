# 🛡️ 데이터베이스 백업 시스템

Bada 프로젝트의 PostgreSQL 데이터베이스 백업 및 복구 시스템입니다.

## 📋 목차

- [🚀 빠른 시작](#-빠른-시작)
- [📄 스크립트 목록](#-스크립트-목록)
- [⚙️ 환경 설정](#️-환경-설정)
- [📖 사용법](#-사용법)
- [🔒 보안 주의사항](#-보안-주의사항)
- [🆘 문제 해결](#-문제-해결)

## 🚀 빠른 시작

### 1. 환경 변수 설정
```bash
# .env 파일에 다음 변수가 있는지 확인
POSTGRES_PRISMA_URL=postgresql://username:password@host:port/database
```

### 2. 백업 실행
```bash
# 전체 백업 (스키마 + 데이터)
./scripts/backup.sh

# 백업 파일 검증
./scripts/backup-verify.sh ./backups/latest_full_backup.sql
```

### 3. 복구 실행 (필요시)
```bash
# 복구 전 시뮬레이션
./scripts/restore.sh ./backups/latest_full_backup.sql --dry-run

# 실제 복구 (주의!)
./scripts/restore.sh ./backups/latest_full_backup.sql
```

## 📄 스크립트 목록

### 🔄 `backup.sh`
**기능**: 데이터베이스 전체 백업 생성
- 전체 백업 (스키마 + 데이터)
- 스키마만 백업
- 데이터만 백업
- 자동 파일 검증
- 오래된 백업 정리 (7일)

**사용법**:
```bash
./scripts/backup.sh
```

**출력 파일**:
- `backups/full_backup_YYYYMMDD_HHMMSS.sql`
- `backups/schema_backup_YYYYMMDD_HHMMSS.sql`  
- `backups/data_backup_YYYYMMDD_HHMMSS.sql`
- `backups/latest_*_backup.sql` (심볼릭 링크)

### 🔄 `restore.sh`
**기능**: 백업 파일로부터 데이터베이스 복구
- 전체 복구
- 스키마만 복구
- 데이터만 복구
- 안전 확인 프롬프트
- 복구 후 검증

**사용법**:
```bash
# 기본 복구 (확인 프롬프트 포함)
./scripts/restore.sh ./backups/full_backup_20241201_143022.sql

# 강제 복구 (확인 없이)
./scripts/restore.sh ./backups/latest_full_backup.sql --force

# 시뮬레이션 (실제 복구 없이)
./scripts/restore.sh ./backups/latest_full_backup.sql --dry-run

# 스키마만 복구
./scripts/restore.sh ./backups/schema_backup_20241201_143022.sql --schema-only
```

### 🔍 `backup-verify.sh`
**기능**: 백업 파일의 무결성 검증
- 파일 존재 및 크기 확인
- SQL 구문 기본 검증
- 주요 테이블 존재 확인
- 데이터 통계 분석

**사용법**:
```bash
./scripts/backup-verify.sh ./backups/latest_full_backup.sql
```

## ⚙️ 환경 설정

### 필수 환경 변수
```bash
# PostgreSQL 연결 URL
POSTGRES_PRISMA_URL=postgresql://username:password@host:port/database

# 선택사항: 알림 웹훅 (슬랙, 디스코드 등)
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...
```

### 필수 도구 설치
```bash
# macOS
brew install postgresql

# Ubuntu/Debian
sudo apt-get install postgresql-client

# 권한 설정 (최초 1회)
chmod +x scripts/*.sh
```

## 📖 사용법

### 🔄 정기 백업 설정

#### Cron을 이용한 자동 백업
```bash
# crontab 편집
crontab -e

# 매일 새벽 2시에 백업 실행
0 2 * * * cd /path/to/bada-project && ./scripts/backup.sh

# 매주 일요일 새벽 1시에 백업 검증
0 1 * * 0 cd /path/to/bada-project && ./scripts/backup-verify.sh ./backups/latest_full_backup.sql
```

### 🚨 응급 복구 절차

#### 1. 상황 평가
```bash
# 현재 데이터베이스 상태 확인
psql $POSTGRES_PRISMA_URL -c "SELECT COUNT(*) FROM users;"
psql $POSTGRES_PRISMA_URL -c "SELECT COUNT(*) FROM posts;"
```

#### 2. 최신 백업 확인
```bash
# 사용 가능한 백업 파일 확인
ls -la ./backups/

# 백업 파일 검증
./scripts/backup-verify.sh ./backups/latest_full_backup.sql
```

#### 3. 복구 실행
```bash
# 시뮬레이션으로 먼저 테스트
./scripts/restore.sh ./backups/latest_full_backup.sql --dry-run

# 실제 복구 실행
./scripts/restore.sh ./backups/latest_full_backup.sql
```

### 📊 마이그레이션 전 백업

#### 안전한 마이그레이션 절차
```bash
# 1. 마이그레이션 전 백업 생성
./scripts/backup.sh

# 2. 백업 파일 검증
./scripts/backup-verify.sh ./backups/latest_full_backup.sql

# 3. 마이그레이션 실행
npx prisma migrate deploy

# 4. 문제 발생 시 롤백
./scripts/restore.sh ./backups/latest_full_backup.sql
```

## 🔒 보안 주의사항

### ⚠️ 중요한 보안 지침

1. **백업 파일 보안**
   - 백업 파일에는 모든 사용자 데이터가 포함됩니다
   - `backups/` 디렉토리를 `.gitignore`에 추가하세요
   - 백업 파일은 안전한 위치에 별도 저장하세요

2. **환경 변수 보안**
   - `.env` 파일을 버전 관리에 포함하지 마세요
   - 데이터베이스 URL에 민감한 정보가 포함됩니다

3. **스크립트 권한**
   - 스크립트 파일의 권한을 적절히 설정하세요
   - 필요한 사용자만 실행할 수 있도록 제한하세요

### 🔐 권장 보안 설정
```bash
# 백업 디렉토리 권한 설정
chmod 700 backups/
chmod 600 backups/*.sql

# 스크립트 권한 설정
chmod 750 scripts/*.sh
```

## 🆘 문제 해결

### ❌ 일반적인 오류

#### "POSTGRES_PRISMA_URL 환경변수가 설정되지 않았습니다"
```bash
# 해결방법 1: .env 파일 확인
cat .env | grep POSTGRES

# 해결방법 2: 환경변수 직접 설정
export POSTGRES_PRISMA_URL="postgresql://..."
```

#### "백업 파일을 찾을 수 없습니다"
```bash
# 해결방법: 백업 파일 경로 확인
ls -la ./backups/
./scripts/backup.sh  # 새 백업 생성
```

#### "pg_dump: command not found"
```bash
# 해결방법: PostgreSQL 클라이언트 설치
# macOS
brew install postgresql

# Ubuntu/Debian  
sudo apt-get install postgresql-client
```

### 🔍 로그 파일 확인

모든 스크립트는 `logs/` 디렉토리에 상세한 로그를 생성합니다:

```bash
# 최근 백업 로그 확인
ls -la logs/backup_*.log | tail -1 | xargs cat

# 최근 복구 로그 확인  
ls -la logs/restore_*.log | tail -1 | xargs cat

# 최근 검증 로그 확인
ls -la logs/verify_*.log | tail -1 | xargs cat
```

### 📞 지원 및 문의

백업 시스템 관련 문제가 발생하면:

1. **로그 파일 확인** (`logs/` 디렉토리)
2. **백업 파일 검증** 실행
3. **환경 변수 설정** 재확인
4. **권한 설정** 확인

---

## 📝 변경 이력

- **v1.0.0** (2024-12-01): 초기 백업 시스템 구축
  - 기본 백업/복구 기능
  - 백업 파일 검증 시스템
  - 자동화 스크립트 및 문서화

---

**⚠️ 주의**: 프로덕션 환경에서 복구 작업을 수행하기 전에는 반드시 테스트 환경에서 먼저 검증하세요!
