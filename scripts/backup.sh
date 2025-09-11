#!/bin/bash

# =============================================================================
# 데이터베이스 백업 스크립트 - Bada Project
# 작성일: 2024년
# 용도: PostgreSQL 데이터베이스 백업 자동화
# =============================================================================

set -e  # 오류 발생 시 스크립트 종료

# 환경 변수 설정
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="./backups"
LOG_DIR="./logs"
LOG_FILE="$LOG_DIR/backup_$TIMESTAMP.log"

# 디렉토리 생성
mkdir -p "$BACKUP_DIR"
mkdir -p "$LOG_DIR"

# 로그 함수
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# 백업 파일명 설정
FULL_BACKUP="$BACKUP_DIR/full_backup_$TIMESTAMP.sql"
SCHEMA_BACKUP="$BACKUP_DIR/schema_backup_$TIMESTAMP.sql"
DATA_BACKUP="$BACKUP_DIR/data_backup_$TIMESTAMP.sql"

# 환경 변수 확인
if [ -z "$POSTGRES_PRISMA_URL" ]; then
    log "❌ 오류: POSTGRES_PRISMA_URL 환경변수가 설정되지 않았습니다."
    log "💡 해결방법: .env 파일을 확인하거나 환경변수를 설정해주세요."
    exit 1
fi

log "🚀 백업 프로세스 시작"
log "📅 백업 시간: $TIMESTAMP"
log "📁 백업 디렉토리: $BACKUP_DIR"

# 1. 전체 데이터베이스 백업
log "📦 1/3 전체 데이터베이스 백업 중..."
if pg_dump "$POSTGRES_PRISMA_URL" > "$FULL_BACKUP"; then
    FULL_SIZE=$(du -h "$FULL_BACKUP" | cut -f1)
    log "✅ 전체 백업 완료: $FULL_BACKUP ($FULL_SIZE)"
else
    log "❌ 전체 백업 실패"
    exit 1
fi

# 2. 스키마만 백업
log "🏗️  2/3 스키마 백업 중..."
if pg_dump --schema-only "$POSTGRES_PRISMA_URL" > "$SCHEMA_BACKUP"; then
    SCHEMA_SIZE=$(du -h "$SCHEMA_BACKUP" | cut -f1)
    log "✅ 스키마 백업 완료: $SCHEMA_BACKUP ($SCHEMA_SIZE)"
else
    log "❌ 스키마 백업 실패"
    exit 1
fi

# 3. 데이터만 백업
log "💾 3/3 데이터 백업 중..."
if pg_dump --data-only "$POSTGRES_PRISMA_URL" > "$DATA_BACKUP"; then
    DATA_SIZE=$(du -h "$DATA_BACKUP" | cut -f1)
    log "✅ 데이터 백업 완료: $DATA_BACKUP ($DATA_SIZE)"
else
    log "❌ 데이터 백업 실패"
    exit 1
fi

# 4. 백업 파일 검증
log "🔍 백업 파일 검증 중..."
for backup_file in "$FULL_BACKUP" "$SCHEMA_BACKUP" "$DATA_BACKUP"; do
    if [ -f "$backup_file" ] && [ -s "$backup_file" ]; then
        log "✅ 검증 통과: $(basename "$backup_file")"
    else
        log "❌ 검증 실패: $(basename "$backup_file") - 파일이 없거나 비어있음"
        exit 1
    fi
done

# 5. 백업 요약 정보
log "📊 백업 요약:"
log "   • 전체 백업: $FULL_SIZE"
log "   • 스키마 백업: $SCHEMA_SIZE"  
log "   • 데이터 백업: $DATA_SIZE"
log "   • 총 파일 수: 3개"

# 6. 오래된 백업 파일 정리 (7일 이상된 파일 삭제)
log "🧹 오래된 백업 파일 정리 중..."
OLD_BACKUPS=$(find "$BACKUP_DIR" -name "*.sql" -type f -mtime +7 | wc -l)
if [ "$OLD_BACKUPS" -gt 0 ]; then
    find "$BACKUP_DIR" -name "*.sql" -type f -mtime +7 -delete
    log "🗑️  $OLD_BACKUPS 개의 오래된 백업 파일을 삭제했습니다."
else
    log "✨ 삭제할 오래된 백업 파일이 없습니다."
fi

# 7. 최신 백업 심볼릭 링크 생성
log "🔗 최신 백업 링크 생성 중..."
ln -sf "$(basename "$FULL_BACKUP")" "$BACKUP_DIR/latest_full_backup.sql"
ln -sf "$(basename "$SCHEMA_BACKUP")" "$BACKUP_DIR/latest_schema_backup.sql"
ln -sf "$(basename "$DATA_BACKUP")" "$BACKUP_DIR/latest_data_backup.sql"

log "🎉 백업 프로세스 완료!"
log "📝 로그 파일: $LOG_FILE"
log "💡 복구 방법: ./scripts/restore.sh $FULL_BACKUP"

# 성공 알림 (선택사항 - 슬랙, 디스코드 등)
# curl -X POST -H 'Content-type: application/json' \
#   --data '{"text":"✅ 데이터베이스 백업 완료: '$TIMESTAMP'"}' \
#   $SLACK_WEBHOOK_URL

echo ""
echo "🎯 백업 완료 요약:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📁 백업 위치: $BACKUP_DIR"
echo "📄 전체 백업: $(basename "$FULL_BACKUP")"
echo "🏗️  스키마 백업: $(basename "$SCHEMA_BACKUP")"
echo "💾 데이터 백업: $(basename "$DATA_BACKUP")"
echo "📝 로그 파일: $LOG_FILE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
