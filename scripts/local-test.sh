#!/bin/bash
# scripts/test-local.sh

echo "🧪 Testing security news fetcher locally..."

# 環境変数チェック
if [ -z "$ANTHROPIC_API_KEY" ]; then
  echo "❌ Error: ANTHROPIC_API_KEY is not set"
  echo "Run: export ANTHROPIC_API_KEY='your-api-key'"
  exit 1
fi

# 依存関係インストール
echo "📦 Installing dependencies..."
npm install --no-save rss-parser node-fetch

# スクリプト実行
echo "🚀 Running fetch script..."
node scripts/fetch-security-news.mjs

# 結果確認
echo ""
echo "📄 Generated files:"
ls -lh app/routes/posts/*.mdx | tail -5

echo ""
echo "✅ Test complete!"
echo "To preview: npm run dev"
