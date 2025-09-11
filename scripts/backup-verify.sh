#!/bin/bash

# =============================================================================
# 백업 파일 검증 스크립트 - Bada Project
# 작성일: 2024년
# 용도: 백업 파일의 무결성 및 복구 가능성 검증
# =============================================================================

set -e

# 사용법 확인
if [ $# -eq 0 ]; then
    echo "❌ 사용법: $0 <backup_file.sql>"
    echo ""
    echo "📖 사용 예시:"
    echo "  $0 ./backups/full_backup_20241201_143022.sql"
    echo "  $0 ./backups/latest_full_backup.sql"
    echo ""
    exit 1
fi

BACKUP_FILE="$1"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
LOG_DIR="./logs"
LOG_FILE="$LOG_DIR/verify_$TIMESTAMP.log"

mkdir -p "$LOG_DIR"

# 로그 함수
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

log "🔍 백업 파일 검증 시작"
log "📄 대상 파일: $BACKUP_FILE"

# 1. 파일 존재 확인
if [ ! -f "$BACKUP_FILE" ]; then
    log "❌ 파일이 존재하지 않습니다: $BACKUP_FILE"
    exit 1
fi

log "✅ 파일 존재 확인 완료"

# 2. 파일 크기 확인
FILE_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
FILE_SIZE_BYTES=$(stat -f%z "$BACKUP_FILE" 2>/dev/null || stat -c%s "$BACKUP_FILE" 2>/dev/null)

if [ "$FILE_SIZE_BYTES" -eq 0 ]; then
    log "❌ 파일이 비어있습니다"
    exit 1
fi

log "✅ 파일 크기: $FILE_SIZE ($FILE_SIZE_BYTES bytes)"

# 3. 파일 형식 확인
log "🔍 파일 형식 검증 중..."

# SQL 덤프 파일의 기본 구조 확인
if head -n 10 "$BACKUP_FILE" | grep -q "PostgreSQL database dump"; then
    log "✅ PostgreSQL 덤프 파일 형식 확인"
else
    log "⚠️  표준 PostgreSQL 덤프 헤더가 없습니다"
fi

# 4. 주요 테이블 존재 확인
log "🔍 주요 테이블 구조 검증 중..."

REQUIRED_TABLES=("users" "posts" "sessions" "follows" "likes" "comments")
MISSING_TABLES=()

for table in "${REQUIRED_TABLES[@]}"; do
    if grep -q "CREATE TABLE.*$table" "$BACKUP_FILE"; then
        log "✅ 테이블 발견: $table"
    else
        log "⚠️  테이블 누락: $table"
        MISSING_TABLES+=("$table")
    fi
done

if [ ${#MISSING_TABLES[@]} -gt 0 ]; then
    log "⚠️  누락된 테이블: ${MISSING_TABLES[*]}"
    log "💡 이는 백업이 부분적이거나 손상되었을 가능성을 의미합니다"
fi

# 5. 데이터 존재 확인
log "🔍 데이터 존재 여부 확인 중..."

USER_DATA_COUNT=$(grep -c "INSERT INTO.*users" "$BACKUP_FILE" || echo "0")
POST_DATA_COUNT=$(grep -c "INSERT INTO.*posts" "$BACKUP_FILE" || echo "0")

log "📊 데이터 통계:"
log "   • 사용자 INSERT 문: $USER_DATA_COUNT"
log "   • 게시물 INSERT 문: $POST_DATA_COUNT"

if [ "$USER_DATA_COUNT" -eq 0 ] && [ "$POST_DATA_COUNT" -eq 0 ]; then
    log "⚠️  데이터 INSERT 문이 발견되지 않았습니다 (스키마 전용 백업일 가능성)"
fi

# 6. 문법 오류 확인 (기본적인 SQL 구문 검사)
log "🔍 기본 SQL 구문 검증 중..."

# 괄호 균형 확인
OPEN_PARENS=$(grep -o "(" "$BACKUP_FILE" | wc -l)
CLOSE_PARENS=$(grep -o ")" "$BACKUP_FILE" | wc -l)

if [ "$OPEN_PARENS" -eq "$CLOSE_PARENS" ]; then
    log "✅ 괄호 균형 확인 완료"
else
    log "⚠️  괄호 불균형 감지 (열림: $OPEN_PARENS, 닫힘: $CLOSE_PARENS)"
fi

# 7. 백업 생성 시간 확인
log "🔍 백업 메타데이터 확인 중..."

DUMP_STARTED=$(grep "Started on" "$BACKUP_FILE" | head -1 || echo "정보 없음")
DUMP_COMPLETED=$(grep "Completed on" "$BACKUP_FILE" | head -1 || echo "정보 없음")

if [[ "$DUMP_STARTED" != "정보 없음" ]]; then
    log "📅 백업 시작: $DUMP_STARTED"
fi

if [[ "$DUMP_COMPLETED" != "정보 없음" ]]; then
    log "📅 백업 완료: $DUMP_COMPLETED"
fi

# 8. 인코딩 확인
log "🔍 파일 인코딩 확인 중..."
ENCODING=$(file -b --mime-encoding "$BACKUP_FILE")
log "📝 파일 인코딩: $ENCODING"

if [[ "$ENCODING" == "utf-8" ]] || [[ "$ENCODING" == "us-ascii" ]]; then
    log "✅ 적절한 인코딩 확인"
else
    log "⚠️  예상치 못한 인코딩: $ENCODING"
fi

# 9. 검증 요약
log "📊 검증 요약 생성 중..."

TOTAL_LINES=$(wc -l < "$BACKUP_FILE")
CREATE_TABLE_COUNT=$(grep -c "CREATE TABLE" "$BACKUP_FILE" || echo "0")
INSERT_COUNT=$(grep -c "INSERT INTO" "$BACKUP_FILE" || echo "0")

echo ""
echo "🎯 백업 파일 검증 결과:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📄 파일: $(basename "$BACKUP_FILE")"
echo "📊 크기: $FILE_SIZE"
echo "📝 총 라인 수: $TOTAL_LINES"
echo "🏗️  CREATE TABLE 문: $CREATE_TABLE_COUNT"
echo "💾 INSERT INTO 문: $INSERT_COUNT"
echo "📝 로그 파일: $LOG_FILE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# 10. 전체 상태 판정
WARNINGS=0

if [ ${#MISSING_TABLES[@]} -gt 0 ]; then
    ((WARNINGS++))
fi

if [ "$USER_DATA_COUNT" -eq 0 ] && [ "$POST_DATA_COUNT" -eq 0 ]; then
    ((WARNINGS++))
fi

if [ "$OPEN_PARENS" -ne "$CLOSE_PARENS" ]; then
    ((WARNINGS++))
fi

if [ "$WARNINGS" -eq 0 ]; then
    log "🎉 백업 파일 검증 완료 - 문제 없음"
    echo "✅ 상태: 양호 - 복구 가능한 백업 파일입니다"
elif [ "$WARNINGS" -le 2 ]; then
    log "⚠️  백업 파일 검증 완료 - 경미한 경고 $WARNINGS개"
    echo "⚠️  상태: 주의 - 복구 전 경고사항을 검토하세요"
else
    log "❌ 백업 파일 검증 완료 - 심각한 문제 $WARNINGS개"
    echo "❌ 상태: 위험 - 복구하기 전 백업 파일을 재생성하는 것을 권장합니다"
fi

echo ""
echo "💡 권장사항:"
echo "• 정기적으로 백업 파일을 검증하세요"
echo "• 테스트 환경에서 복구 테스트를 진행하세요"
echo "• 중요한 마이그레이션 전에는 여러 개의 백업을 생성하세요"
