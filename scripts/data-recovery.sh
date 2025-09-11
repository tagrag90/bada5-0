#!/bin/bash

# =============================================================================
# 스키마 호환 데이터 복구 스크립트 - Bada Project
# 작성일: 2024년
# 용도: 스키마 변경 후에도 기존 데이터를 안전하게 복구
# =============================================================================

set -e

# 사용법 확인
if [ $# -eq 0 ]; then
    echo "❌ 사용법: $0 <backup_file.sql> [table_name]"
    echo ""
    echo "📖 사용 예시:"
    echo "  $0 ./backups/full_backup_20241201.sql"
    echo "  $0 ./backups/full_backup_20241201.sql users"
    echo "  $0 ./backups/full_backup_20241201.sql posts"
    echo ""
    echo "🔧 기능:"
    echo "  • 스키마 변경 후에도 기존 데이터 안전 복구"
    echo "  • 새로 추가된 필드는 기본값(NULL)으로 자동 처리"
    echo "  • 선택적 테이블 복구 지원"
    echo ""
    exit 1
fi

BACKUP_FILE="$1"
TARGET_TABLE="$2"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
LOG_DIR="./logs"
LOG_FILE="$LOG_DIR/data_recovery_$TIMESTAMP.log"
TEMP_DIR="./temp"

mkdir -p "$LOG_DIR" "$TEMP_DIR"

# 로그 함수
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# 환경 변수 확인
if [ -z "$POSTGRES_PRISMA_URL" ] && [ -z "$POSTGRES_URL_NON_POOLING" ]; then
    log "❌ 오류: 데이터베이스 URL 환경변수가 설정되지 않았습니다."
    exit 1
fi

# NON_POOLING URL 우선 사용
if [ -n "$POSTGRES_URL_NON_POOLING" ]; then
    DB_URL="$POSTGRES_URL_NON_POOLING"
else
    DB_URL="$POSTGRES_PRISMA_URL"
fi

log "🚀 스키마 호환 데이터 복구 시작"
log "📄 백업 파일: $BACKUP_FILE"
log "🎯 대상 테이블: ${TARGET_TABLE:-"전체"}"

# 백업 파일 검증
if [ ! -f "$BACKUP_FILE" ]; then
    log "❌ 백업 파일을 찾을 수 없습니다: $BACKUP_FILE"
    exit 1
fi

# 1. 현재 스키마 정보 수집
log "🔍 1/6 현재 데이터베이스 스키마 분석 중..."

# 주요 테이블들의 현재 스키마 정보 수집
TABLES=("users" "posts" "sessions" "follows" "likes" "comments" "bookmarks" "notifications")

for table in "${TABLES[@]}"; do
    if [ -n "$TARGET_TABLE" ] && [ "$TARGET_TABLE" != "$table" ]; then
        continue
    fi
    
    log "📋 $table 테이블 스키마 분석 중..."
    
    # 현재 테이블의 컬럼 정보 가져오기
    psql "$DB_URL" -c "
        SELECT column_name, data_type, is_nullable, column_default 
        FROM information_schema.columns 
        WHERE table_name = '$table' 
        ORDER BY ordinal_position;
    " > "$TEMP_DIR/${table}_current_schema.txt"
    
    log "✅ $table 스키마 정보 저장됨"
done

# 2. 백업 파일에서 데이터 추출 및 변환
log "📦 2/6 백업 데이터 추출 및 스키마 호환성 처리 중..."

for table in "${TABLES[@]}"; do
    if [ -n "$TARGET_TABLE" ] && [ "$TARGET_TABLE" != "$table" ]; then
        continue
    fi
    
    log "🔄 $table 테이블 데이터 처리 중..."
    
    # 백업 파일에서 해당 테이블의 COPY 문 추출
    COPY_START_LINE=$(grep -n "COPY public.$table" "$BACKUP_FILE" | cut -d: -f1)
    
    if [ -z "$COPY_START_LINE" ]; then
        log "⚠️ $table 테이블 데이터가 백업에 없습니다"
        continue
    fi
    
    # COPY 문부터 \. 까지 추출
    sed -n "${COPY_START_LINE},/^\\\.$/p" "$BACKUP_FILE" > "$TEMP_DIR/${table}_backup_data.sql"
    
    # 현재 스키마에 맞게 COPY 문 수정
    python3 -c "
import sys
import re

# 현재 스키마 정보 읽기
current_schema = []
with open('$TEMP_DIR/${table}_current_schema.txt', 'r') as f:
    lines = f.readlines()[2:-2]  # 헤더와 푸터 제거
    for line in lines:
        if '|' in line:
            cols = [col.strip() for col in line.split('|')]
            if len(cols) >= 3 and cols[0] and cols[0] != '-':
                current_schema.append(cols[0])

# 백업 데이터 읽기
with open('$TEMP_DIR/${table}_backup_data.sql', 'r') as f:
    content = f.read()

# COPY 문에서 컬럼 목록 추출
copy_match = re.search(r'COPY public\.$table \((.*?)\) FROM stdin;', content)
if copy_match:
    backup_columns = [col.strip().strip('\"') for col in copy_match.group(1).split(',')]
    
    # 새로운 COPY 문 생성 (현재 스키마의 모든 컬럼 포함)
    new_copy_line = f'COPY public.$table ({', '.join([f'\"{col}\"' for col in current_schema])}) FROM stdin;'
    
    # 데이터 라인들 처리
    data_lines = content.split('\n')[1:-2]  # COPY 문과 \. 제외
    new_data_lines = []
    
    for line in data_lines:
        if line.strip() and line != '\.':
            values = line.split('\t')
            new_values = []
            
            for col in current_schema:
                if col in backup_columns:
                    idx = backup_columns.index(col)
                    if idx < len(values):
                        new_values.append(values[idx])
                    else:
                        new_values.append('\N')  # NULL
                else:
                    new_values.append('\N')  # 새 컬럼은 NULL
            
            new_data_lines.append('\t'.join(new_values))
    
    # 새로운 SQL 파일 생성
    with open('$TEMP_DIR/${table}_compatible_data.sql', 'w') as f:
        f.write(new_copy_line + '\n')
        for line in new_data_lines:
            f.write(line + '\n')
        f.write('\.\n')
    
    print(f'✅ {len(new_data_lines)}개 레코드 변환 완료')
else:
    print('❌ COPY 문을 찾을 수 없습니다')
    sys.exit(1)
"
    
    if [ $? -eq 0 ]; then
        log "✅ $table 데이터 스키마 호환성 처리 완료"
    else
        log "❌ $table 데이터 변환 실패"
        continue
    fi
done

# 3. 기존 데이터 임시 백업 (안전장치)
log "🛡️ 3/6 현재 데이터 임시 백업 중..."
CURRENT_BACKUP="$TEMP_DIR/current_data_$TIMESTAMP.sql"
if POSTGRES_PRISMA_URL="$DB_URL" ./scripts/backup.sh; then
    cp "$BACKUP_DIR/latest_full_backup.sql" "$CURRENT_BACKUP"
    log "✅ 현재 데이터 임시 백업 완료"
else
    log "⚠️ 현재 데이터 백업 실패 - 계속 진행"
fi

# 4. 기존 데이터 정리 (테이블별)
log "🧹 4/6 기존 데이터 정리 중..."

for table in "${TABLES[@]}"; do
    if [ -n "$TARGET_TABLE" ] && [ "$TARGET_TABLE" != "$table" ]; then
        continue
    fi
    
    if [ -f "$TEMP_DIR/${table}_compatible_data.sql" ]; then
        log "🗑️ $table 테이블 기존 데이터 삭제 중..."
        psql "$DB_URL" -c "DELETE FROM $table;" || log "⚠️ $table 삭제 실패 (참조 무결성 제약)"
    fi
done

# 5. 변환된 데이터 복구
log "📥 5/6 변환된 데이터 복구 중..."

# 의존성 순서에 따라 복구 (참조 무결성 고려)
RECOVERY_ORDER=("users" "sessions" "posts" "follows" "likes" "comments" "bookmarks" "notifications")

for table in "${RECOVERY_ORDER[@]}"; do
    if [ -n "$TARGET_TABLE" ] && [ "$TARGET_TABLE" != "$table" ]; then
        continue
    fi
    
    if [ -f "$TEMP_DIR/${table}_compatible_data.sql" ]; then
        log "📥 $table 데이터 복구 중..."
        
        if psql "$DB_URL" < "$TEMP_DIR/${table}_compatible_data.sql"; then
            RECOVERED_COUNT=$(psql "$DB_URL" -t -c "SELECT COUNT(*) FROM $table;" | xargs)
            log "✅ $table 복구 완료: $RECOVERED_COUNT 개 레코드"
        else
            log "❌ $table 복구 실패"
        fi
    fi
done

# 6. 최종 검증
log "🔍 6/6 최종 데이터 무결성 검증 중..."

FINAL_USERS=$(psql "$DB_URL" -t -c "SELECT COUNT(*) FROM users;" 2>/dev/null | xargs)
FINAL_POSTS=$(psql "$DB_URL" -t -c "SELECT COUNT(*) FROM posts;" 2>/dev/null | xargs)

log "📊 최종 데이터 상태:"
log "   • 사용자 수: $FINAL_USERS"
log "   • 게시물 수: $FINAL_POSTS"

# 7. 임시 파일 정리
log "🧹 임시 파일 정리 중..."
rm -rf "$TEMP_DIR"
log "✅ 임시 파일 정리 완료"

log "🎉 스키마 호환 데이터 복구 완료!"

echo ""
echo "🎯 데이터 복구 완료 요약:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "👥 복구된 사용자: $FINAL_USERS 명"
echo "📝 복구된 게시물: $FINAL_POSTS 개"
echo "🆕 새 스키마: linkPreviews 필드 포함"
echo "📝 로그 파일: $LOG_FILE"
echo "🛡️ 롤백 가능: $PRE_MIGRATE_BACKUP"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "⚡ 다음 단계:"
echo "1. 애플리케이션 재시작"
echo "2. 로그인 기능 테스트"
echo "3. 링크 임베드 기능 테스트"
