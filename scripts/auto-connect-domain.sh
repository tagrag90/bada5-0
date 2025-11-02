#!/bin/bash

# Vercel 배포 후 도메인 자동 연결 스크립트
# 사용법: npm run connect-domain 또는 ./scripts/auto-connect-domain.sh

set -e

echo "🔍 최신 Production 배포 찾는 중..."

# 최신 Production 배포 URL 가져오기
LATEST_DEPLOY=$(npx vercel ls --scope tagrag90s-projects bada5-0 2>&1 | grep "Ready.*Production" | head -1 | awk '{print $2}')

if [ -z "$LATEST_DEPLOY" ]; then
  echo "❌ 최신 Production 배포를 찾을 수 없습니다."
  exit 1
fi

echo "✅ 최신 배포 발견: $LATEST_DEPLOY"

# 현재 도메인이 가리키는 배포 확인
CURRENT_WWW=$(npx vercel inspect www.divetobada.com 2>&1 | grep -E "url" | head -1 | awk '{print $2}')
CURRENT_ROOT=$(npx vercel inspect divetobada.com 2>&1 | grep -E "url" | head -1 | awk '{print $2}')

echo "현재 www.divetobada.com → $CURRENT_WWW"
echo "현재 divetobada.com → $CURRENT_ROOT"

# 이미 최신 배포에 연결되어 있으면 스킵
if [ "$CURRENT_WWW" = "$LATEST_DEPLOY" ] && [ "$CURRENT_ROOT" = "$LATEST_DEPLOY" ]; then
  echo "✅ 도메인이 이미 최신 배포에 연결되어 있습니다."
  exit 0
fi

echo ""
echo "🔗 도메인 연결 중..."

# www.divetobada.com 연결
if [ "$CURRENT_WWW" != "$LATEST_DEPLOY" ]; then
  echo "  → www.divetobada.com 연결 중..."
  npx vercel alias set "$LATEST_DEPLOY" www.divetobada.com
  echo "  ✅ www.divetobada.com 연결 완료"
else
  echo "  ⏭️  www.divetobada.com은 이미 최신 배포를 가리키고 있습니다."
fi

# divetobada.com 연결
if [ "$CURRENT_ROOT" != "$LATEST_DEPLOY" ]; then
  echo "  → divetobada.com 연결 중..."
  npx vercel alias set "$LATEST_DEPLOY" divetobada.com
  echo "  ✅ divetobada.com 연결 완료"
else
  echo "  ⏭️  divetobada.com은 이미 최신 배포를 가리키고 있습니다."
fi

echo ""
echo "✅ 모든 도메인이 최신 배포에 연결되었습니다!"
echo "   최신 배포: $LATEST_DEPLOY"

