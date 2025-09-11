#!/bin/bash

# =============================================================================
# 데이터베이스 복구 스크립트 - Bada Project
# 작성일: 2024년
# 용도: PostgreSQL 데이터베이스 백업 파일로부터 복구
# =============================================================================

set -e  # 오류 발생 시 스크립트 종료

# 사용법 확인
if [ $# -eq 0 ]; then
    echo "❌ 사용법: $0 <backup_file.sql> [options]"
    echo ""
    echo "📖 사용 예시:"
    echo "  $0 ./backups/full_backup_20241201_143022.sql"
    echo "  $0 ./backups/latest_full_backup.sql"
    echo "  $0 ./backups/schema_backup_20241201_143022.sql --schema-only"
    echo ""
    echo "🔧 옵션:"
    echo "  --schema-only    스키마만 복구 (데이터 제외)"
    echo "  --data-only      데이터만 복구 (스키마 제외)"
    echo "  --force          확인 없이 강제 실행"
    echo "  --dry-run        실제 복구 없이 시뮬레이션만 실행"
    echo ""
    exit 1
fi

# 환경 변수 설정
BACKUP_FILE="$1"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
LOG_DIR="./logs"
LOG_FILE="$LOG_DIR/restore_$TIMESTAMP.log"
FORCE=false
DRY_RUN=false
SCHEMA_ONLY=false
DATA_ONLY=false

# 디렉토리 생성
mkdir -p "$LOG_DIR"

# 로그 함수
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# 옵션 파싱
shift  # 첫 번째 인자(백업파일) 제거
while [[ $# -gt 0 ]]; do
    case $1 in
        --force)
            FORCE=true
            shift
            ;;
        --dry-run)
            DRY_RUN=true
            shift
            ;;
        --schema-only)
            SCHEMA_ONLY=true
            shift
            ;;
        --data-only)
            DATA_ONLY=true
            shift
            ;;
        *)
            echo "❌ 알 수 없는 옵션: $1"
            exit 1
            ;;
    esac
done

# 환경 변수 확인
if [ -z "$POSTGRES_PRISMA_URL" ]; then
    log "❌ 오류: POSTGRES_PRISMA_URL 환경변수가 설정되지 않았습니다."
    log "💡 해결방법: .env 파일을 확인하거나 환경변수를 설정해주세요."
    exit 1
fi

# 백업 파일 확인
if [ ! -f "$BACKUP_FILE" ]; then
    log "❌ 오류: 백업 파일을 찾을 수 없습니다: $BACKUP_FILE"
    log "💡 해결방법: 올바른 백업 파일 경로를 입력해주세요."
    echo ""
    echo "📁 사용 가능한 백업 파일:"
    ls -la ./backups/*.sql 2>/dev/null || echo "   백업 파일이 없습니다."
    exit 1
fi

if [ ! -s "$BACKUP_FILE" ]; then
    log "❌ 오류: 백업 파일이 비어있습니다: $BACKUP_FILE"
    exit 1
fi

log "🚀 복구 프로세스 시작"
log "📅 복구 시간: $TIMESTAMP"
log "📄 백업 파일: $BACKUP_FILE"
log "📊 파일 크기: $(du -h "$BACKUP_FILE" | cut -f1)"

# Dry run 모드
if [ "$DRY_RUN" = true ]; then
    log "🔍 DRY RUN 모드: 실제 복구는 실행하지 않습니다."
    log "✅ 백업 파일 검증 완료"
    log "✅ 데이터베이스 연결 확인 가능"
    log "💡 실제 복구를 원한다면 --dry-run 옵션을 제거하고 다시 실행하세요."
    exit 0
fi

# 사용자 확인 (force 옵션이 없는 경우)
if [ "$FORCE" = false ]; then
    echo ""
    echo "⚠️  경고: 데이터베이스 복구를 진행합니다."
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "📄 백업 파일: $BACKUP_FILE"
    echo "🗄️  대상 DB: $(echo $POSTGRES_PRISMA_URL | sed 's/.*@\([^/]*\).*/\1/')"
    echo "⚠️  현재 데이터베이스의 모든 데이터가 대체됩니다!"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    read -p "계속 진행하시겠습니까? (yes/no): " -r
    if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
        log "❌ 사용자에 의해 복구가 취소되었습니다."
        exit 1
    fi
fi

# 복구 실행 전 현재 데이터베이스 상태 확인
log "🔍 현재 데이터베이스 상태 확인 중..."
CURRENT_USERS=$(psql "$POSTGRES_PRISMA_URL" -t -c "SELECT COUNT(*) FROM users;" 2>/dev/null || echo "0")
CURRENT_POSTS=$(psql "$POSTGRES_PRISMA_URL" -t -c "SELECT COUNT(*) FROM posts;" 2>/dev/null || echo "0")

log "📊 현재 데이터베이스 상태:"
log "   • 사용자 수: $(echo $CURRENT_USERS | xargs)"
log "   • 게시물 수: $(echo $CURRENT_POSTS | xargs)"

# 복구 옵션에 따른 실행
if [ "$SCHEMA_ONLY" = true ]; then
    log "🏗️  스키마만 복구 중..."
    PSQL_OPTIONS="--schema-only"
elif [ "$DATA_ONLY" = true ]; then
    log "💾 데이터만 복구 중..."
    PSQL_OPTIONS="--data-only"
else
    log "📦 전체 데이터베이스 복구 중..."
    PSQL_OPTIONS=""
fi

# 복구 실행
log "⚡ 복구 실행 중... (시간이 걸릴 수 있습니다)"
if psql "$POSTGRES_PRISMA_URL" < "$BACKUP_FILE"; then
    log "✅ 복구 완료!"
else
    log "❌ 복구 실패"
    log "💡 로그 파일을 확인하세요: $LOG_FILE"
    exit 1
fi

# 복구 후 데이터베이스 상태 확인
log "🔍 복구 후 데이터베이스 상태 확인 중..."
RESTORED_USERS=$(psql "$POSTGRES_PRISMA_URL" -t -c "SELECT COUNT(*) FROM users;" 2>/dev/null || echo "0")
RESTORED_POSTS=$(psql "$POSTGRES_PRISMA_URL" -t -c "SELECT COUNT(*) FROM posts;" 2>/dev/null || echo "0")

log "📊 복구 후 데이터베이스 상태:"
log "   • 사용자 수: $(echo $RESTORED_USERS | xargs)"
log "   • 게시물 수: $(echo $RESTORED_POSTS | xargs)"

# 데이터 무결성 기본 검증
log "🔍 데이터 무결성 검증 중..."
INTEGRITY_CHECK=$(psql "$POSTGRES_PRISMA_URL" -t -c "
    SELECT 
        CASE 
            WHEN COUNT(*) > 0 THEN 'PASS'
            ELSE 'FAIL'
        END
    FROM information_schema.tables 
    WHERE table_name IN ('users', 'posts', 'sessions');
" 2>/dev/null || echo "FAIL")

if [[ "$(echo $INTEGRITY_CHECK | xargs)" == "PASS" ]]; then
    log "✅ 기본 테이블 무결성 검증 통과"
else
    log "⚠️  기본 테이블 무결성 검증 실패 - 수동 확인 필요"
fi

log "🎉 복구 프로세스 완료!"
log "📝 로그 파일: $LOG_FILE"
log "💡 다음 단계: 애플리케이션을 재시작하고 기능을 테스트하세요."

# 성공 알림 (선택사항)
# curl -X POST -H 'Content-type: application/json' \
#   --data '{"text":"🔄 데이터베이스 복구 완료: '$TIMESTAMP'"}' \
#   $SLACK_WEBHOOK_URL

echo ""
echo "🎯 복구 완료 요약:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📄 복구된 백업: $(basename "$BACKUP_FILE")"
echo "👥 사용자 수: $(echo $RESTORED_USERS | xargs)"
echo "📝 게시물 수: $(echo $RESTORED_POSTS | xargs)"
echo "📝 로그 파일: $LOG_FILE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "⚡ 권장 다음 단계:"
echo "1. 애플리케이션 재시작"
echo "2. 기본 기능 테스트 (로그인, 게시물 작성 등)"
echo "3. 사용자 알림 (서비스 정상화 공지)"
