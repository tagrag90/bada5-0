#!/usr/bin/env python3
"""
스키마 호환 데이터 복구 도구 - Bada Project
기존 백업 데이터를 새로운 스키마에 맞게 변환하여 복구
"""

import sys
import re
import json
import argparse
from typing import Dict, List, Optional

def parse_backup_copy_statement(content: str, table_name: str) -> Optional[Dict]:
    """백업 파일에서 특정 테이블의 COPY 문과 데이터를 파싱"""
    
    # COPY 문 찾기
    copy_pattern = rf'COPY public\.{table_name} \((.*?)\) FROM stdin;'
    copy_match = re.search(copy_pattern, content, re.DOTALL)
    
    if not copy_match:
        return None
    
    # 컬럼 목록 추출
    columns_str = copy_match.group(1)
    columns = [col.strip().strip('"') for col in columns_str.split(',')]
    
    # COPY 문 이후 데이터 라인들 추출
    copy_start = copy_match.end()
    data_section = content[copy_start:]
    
    # \. 까지의 데이터 라인들 추출
    data_lines = []
    for line in data_section.split('\n'):
        if line.strip() == '\.':
            break
        if line.strip() and not line.startswith('--'):
            data_lines.append(line)
    
    return {
        'columns': columns,
        'data_lines': data_lines
    }

def get_current_schema(db_url: str, table_name: str) -> List[str]:
    """현재 데이터베이스에서 테이블 스키마 정보 가져오기"""
    import subprocess
    
    query = f"""
    SELECT column_name 
    FROM information_schema.columns 
    WHERE table_name = '{table_name}' 
    ORDER BY ordinal_position;
    """
    
    try:
        result = subprocess.run(
            ['psql', db_url, '-t', '-c', query],
            capture_output=True,
            text=True,
            check=True
        )
        
        columns = []
        for line in result.stdout.strip().split('\n'):
            col = line.strip()
            if col and col != '':
                columns.append(col)
        
        return columns
    except subprocess.CalledProcessError as e:
        print(f"❌ 스키마 조회 실패: {e}")
        return []

def transform_data_for_new_schema(backup_data: Dict, current_columns: List[str], table_name: str) -> str:
    """백업 데이터를 현재 스키마에 맞게 변환"""
    
    backup_columns = backup_data['columns']
    data_lines = backup_data['data_lines']
    
    # 새로운 COPY 문 생성
    quoted_columns = [f'"{col}"' for col in current_columns]
    new_copy_line = f'COPY public.{table_name} ({", ".join(quoted_columns)}) FROM stdin;'
    
    # 데이터 라인들 변환
    transformed_lines = []
    
    for line in data_lines:
        if not line.strip():
            continue
            
        values = line.split('\t')
        new_values = []
        
        for col in current_columns:
            if col in backup_columns:
                idx = backup_columns.index(col)
                if idx < len(values):
                    new_values.append(values[idx])
                else:
                    new_values.append('\\N')  # NULL
            else:
                # 새로 추가된 컬럼은 기본값 설정
                if col == 'linkPreviews':
                    new_values.append('\\N')  # JSON 필드는 NULL
                else:
                    new_values.append('\\N')  # 기본적으로 NULL
        
        transformed_lines.append('\t'.join(new_values))
    
    # 최종 SQL 생성
    result = new_copy_line + '\n'
    result += '\n'.join(transformed_lines) + '\n'
    result += '\\.\n'
    
    return result

def main():
    parser = argparse.ArgumentParser(description='스키마 호환 데이터 복구 도구')
    parser.add_argument('backup_file', help='백업 파일 경로')
    parser.add_argument('--table', help='복구할 테이블 명 (기본값: posts)')
    parser.add_argument('--db-url', help='데이터베이스 URL', required=True)
    parser.add_argument('--output', help='출력 파일 경로')
    
    args = parser.parse_args()
    
    table_name = args.table or 'posts'
    
    print(f"🔄 {table_name} 테이블 데이터 변환 시작...")
    
    # 백업 파일 읽기
    try:
        with open(args.backup_file, 'r', encoding='utf-8') as f:
            backup_content = f.read()
    except Exception as e:
        print(f"❌ 백업 파일 읽기 실패: {e}")
        sys.exit(1)
    
    # 백업 데이터 파싱
    backup_data = parse_backup_copy_statement(backup_content, table_name)
    if not backup_data:
        print(f"❌ {table_name} 테이블 데이터를 백업에서 찾을 수 없습니다")
        sys.exit(1)
    
    print(f"📋 백업 컬럼: {backup_data['columns']}")
    print(f"📊 백업 레코드 수: {len(backup_data['data_lines'])}")
    
    # 현재 스키마 조회
    current_columns = get_current_schema(args.db_url, table_name)
    if not current_columns:
        print(f"❌ {table_name} 테이블의 현재 스키마를 가져올 수 없습니다")
        sys.exit(1)
    
    print(f"📋 현재 컬럼: {current_columns}")
    
    # 데이터 변환
    transformed_sql = transform_data_for_new_schema(backup_data, current_columns, table_name)
    
    # 출력 파일에 저장
    output_file = args.output or f'./temp/{table_name}_transformed.sql'
    
    try:
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(transformed_sql)
        print(f"✅ 변환된 데이터 저장: {output_file}")
        print(f"💡 복구 명령: psql '$args.db_url' < {output_file}")
    except Exception as e:
        print(f"❌ 파일 저장 실패: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main()
