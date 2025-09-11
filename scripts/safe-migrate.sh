#!/bin/bash

# =============================================================================
# 안전한 프로덕션 마이그레이션 스크립트 - Bada Project
# 작성일: 2024년
# 용도: 데이터 손실 없이 안전한 스키마 변경 및 마이그레이션
# =============================================================================

set -e

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
LOG_DIR="./logs"
LOG_FILE="$LOG_DIR/safe_migrate_$TIMESTAMP.log"
BACKUP_DIR="./backups"

mkdir -p "$LOG_DIR"

# 로그 함수
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# 환경 변수 확인
if [ -z "$POSTGRES_PRISMA_URL" ] && [ -z "$POSTGRES_URL_NON_POOLING" ]; then
    log "❌ 오류: 데이터베이스 URL 환경변수가 설정되지 않았습니다."
    log "💡 POSTGRES_PRISMA_URL 또는 POSTGRES_URL_NON_POOLING을 설정해주세요."
    exit 1
fi

# NON_POOLING URL 우선 사용 (마이그레이션에 더 안전)
if [ -n "$POSTGRES_URL_NON_POOLING" ]; then
    DB_URL="$POSTGRES_URL_NON_POOLING"
else
    DB_URL="$POSTGRES_PRISMA_URL"
fi

log "🚀 안전한 마이그레이션 프로세스 시작"
log "📅 시작 시간: $TIMESTAMP"

# 1. 마이그레이션 전 자동 백업
log "📦 1/5 마이그레이션 전 백업 생성 중..."
PRE_MIGRATE_BACKUP="$BACKUP_DIR/pre_migrate_$TIMESTAMP.sql"

if POSTGRES_PRISMA_URL="$DB_URL" ./scripts/backup.sh; then
    # 백업 파일을 pre-migrate 이름으로 복사
    cp "$BACKUP_DIR/latest_full_backup.sql" "$PRE_MIGRATE_BACKUP"
    log "✅ 마이그레이션 전 백업 완료: $PRE_MIGRATE_BACKUP"
else
    log "❌ 백업 실패 - 마이그레이션 중단"
    exit 1
fi

# 2. 현재 데이터베이스 상태 확인
log "🔍 2/5 현재 데이터베이스 상태 확인 중..."
CURRENT_USERS=$(psql "$DB_URL" -t -c "SELECT COUNT(*) FROM users;" 2>/dev/null || echo "0")
CURRENT_POSTS=$(psql "$DB_URL" -t -c "SELECT COUNT(*) FROM posts;" 2>/dev/null || echo "0")

log "📊 마이그레이션 전 데이터 상태:"
log "   • 사용자 수: $(echo $CURRENT_USERS | xargs)"
log "   • 게시물 수: $(echo $CURRENT_POSTS | xargs)"

# 3. Prisma 스키마 검증
log "🔍 3/5 Prisma 스키마 검증 중..."
if npx prisma validate; then
    log "✅ Prisma 스키마 유효성 검증 통과"
else
    log "❌ Prisma 스키마 오류 - 마이그레이션 중단"
    exit 1
fi

# 4. 안전한 마이그레이션 실행 (프로덕션용)
log "⚡ 4/5 프로덕션 마이그레이션 실행 중..."
log "💡 migrate deploy 사용 - 데이터 보존 모드"

if npx prisma migrate deploy; then
    log "✅ 마이그레이션 성공"
else
    log "❌ 마이그레이션 실패"
    log "🔄 자동 롤백 시작..."
    
    # 자동 롤백
    if POSTGRES_PRISMA_URL="$DB_URL" ./scripts/restore.sh "$PRE_MIGRATE_BACKUP" --force; then
        log "✅ 자동 롤백 완료 - 이전 상태로 복구됨"
    else
        log "❌ 자동 롤백 실패 - 수동 복구 필요"
        log "💡 수동 복구: ./scripts/restore.sh $PRE_MIGRATE_BACKUP --force"
    fi
    exit 1
fi

# 5. 마이그레이션 후 데이터 검증
log "🔍 5/5 마이그레이션 후 데이터 검증 중..."
AFTER_USERS=$(psql "$DB_URL" -t -c "SELECT COUNT(*) FROM users;" 2>/dev/null || echo "0")
AFTER_POSTS=$(psql "$DB_URL" -t -c "SELECT COUNT(*) FROM posts;" 2>/dev/null || echo "0")

log "📊 마이그레이션 후 데이터 상태:"
log "   • 사용자 수: $(echo $AFTER_USERS | xargs)"
log "   • 게시물 수: $(echo $AFTER_POSTS | xargs)"

# 데이터 손실 검증
USERS_BEFORE=$(echo $CURRENT_USERS | xargs)
USERS_AFTER=$(echo $AFTER_USERS | xargs)
POSTS_BEFORE=$(echo $CURRENT_POSTS | xargs)
POSTS_AFTER=$(echo $AFTER_POSTS | xargs)

if [ "$USERS_BEFORE" -eq "$USERS_AFTER" ] && [ "$POSTS_BEFORE" -eq "$POSTS_AFTER" ]; then
    log "✅ 데이터 무결성 검증 통과 - 데이터 손실 없음"
else
    log "⚠️ 데이터 변화 감지:"
    log "   • 사용자: $USERS_BEFORE → $USERS_AFTER"
    log "   • 게시물: $POSTS_BEFORE → $POSTS_AFTER"
    log "💡 의도된 변화인지 확인이 필요합니다."
fi

# 6. 새 필드 검증 (linkPreviews)
log "🔍 새로 추가된 필드 검증 중..."
NEW_FIELD_CHECK=$(psql "$DB_URL" -t -c "SELECT column_name FROM information_schema.columns WHERE table_name = 'posts' AND column_name = 'linkPreviews';" 2>/dev/null || echo "")

if [[ "$(echo $NEW_FIELD_CHECK | xargs)" == "linkPreviews" ]]; then
    log "✅ linkPreviews 필드 정상 추가됨"
else
    log "❌ linkPreviews 필드 추가 실패"
fi

# 7. 마이그레이션 후 백업 생성
log "📦 마이그레이션 후 백업 생성 중..."
POST_MIGRATE_BACKUP="$BACKUP_DIR/post_migrate_$TIMESTAMP.sql"

if POSTGRES_PRISMA_URL="$DB_URL" ./scripts/backup.sh; then
    cp "$BACKUP_DIR/latest_full_backup.sql" "$POST_MIGRATE_BACKUP"
    log "✅ 마이그레이션 후 백업 완료: $POST_MIGRATE_BACKUP"
else
    log "⚠️ 마이그레이션 후 백업 실패 - 수동으로 백업을 생성하세요"
fi

log "🎉 안전한 마이그레이션 완료!"
log "📝 로그 파일: $LOG_FILE"

echo ""
echo "🎯 마이그레이션 완료 요약:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📄 마이그레이션 전 백업: $(basename "$PRE_MIGRATE_BACKUP")"
echo "📄 마이그레이션 후 백업: $(basename "$POST_MIGRATE_BACKUP")"
echo "👥 사용자 데이터: $USERS_BEFORE → $USERS_AFTER"
echo "📝 게시물 데이터: $POSTS_BEFORE → $POSTS_AFTER"
echo "🆕 새 필드: linkPreviews $([ -n "$NEW_FIELD_CHECK" ] && echo "✅" || echo "❌")"
echo "📝 로그 파일: $LOG_FILE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# 성공 알림
echo "✅ 프로덕션 마이그레이션이 안전하게 완료되었습니다!"
echo "💡 문제 발생 시 롤백: ./scripts/restore.sh $PRE_MIGRATE_BACKUP --force"
