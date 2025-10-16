#!/usr/bin/env bash
#
# Bundle & package Lambda functions with esbuild
# - Compiles TypeScript -> single CJS file (Node 20)
# - Zips only dist/index.js (+ .map)
# - Works per-lambda; easy to add more
#
# Requirements:
#   - Node.js + npm
#   - zip
#   - esbuild in devDependencies (npm i -D esbuild typescript)
#
set -euo pipefail
IFS=$'\n\t'

# ---------- pretty output ----------
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No color

info()  { echo -e "${BLUE}$*${NC}"; }
ok()    { echo -e "${GREEN}$*${NC}"; }
err()   { echo -e "${RED}$*${NC}" >&2; }

# ---------- prereq checks ----------
command -v node >/dev/null || { err "Node.js not found"; exit 1; }
command -v npm  >/dev/null || { err "npm not found"; exit 1; }
command -v zip  >/dev/null || { err "zip not found"; exit 1; }

# Try to resolve esbuild (via npx). This also fails if devDep is missing.
if ! npx --yes esbuild --version >/dev/null 2>&1; then
  err "esbuild not available. Run: npm i -D esbuild typescript"
  exit 1
fi

# ---------- build helper ----------
# build_lambda "<Friendly Name>" "<lambda_dir>" ["<entry_ts_relpath>"]
# Defaults entry to "src/index.ts" inside the lambda_dir
build_lambda() {
  local name="$1"
  local dir="$2"
  local entry="${3:-src/index.ts}"
  local original_dir
  original_dir="$(pwd)"

  info "Building ${name} …"
  cd "$dir"

  # Deterministic installs when lockfile exists
  if [[ ! -d node_modules ]]; then
    if [[ -f package-lock.json ]]; then
      info "  📦 Installing dependencies with npm ci…"
      npm ci
    else
      info "  📦 Installing dependencies with npm install…"
      npm install
    fi
  fi

  # Prepare dist
  mkdir -p dist
  rm -f dist/lambda.zip dist/index.js dist/index.js.map

  # Bundle TypeScript entry with esbuild
  # - CommonJS output (Lambda Node.js 20.x default runtime)
  # - platform=node ensures proper shimming
  # - minify + sourcemap for small size + debuggability
  # - external:@aws-sdk/* to exclude AWS SDK (available in Lambda runtime)
  info "  🔨 Bundling ${entry} with esbuild…"
  npx --yes esbuild "${entry}" \
    --bundle \
    --platform=node \
    --target=node20 \
    --format=cjs \
    --outfile=dist/index.js \
    --sourcemap \
    --minify \
    --external:@aws-sdk/*

  # Sanity check
  [[ -f dist/index.js ]] || { err "Build failed: dist/index.js not found"; exit 1; }

  # Create the deployment zip
  info "  📦 Creating deployment package…"
  ( cd dist && zip -q -r lambda.zip index.js index.js.map )

  ok "✅ ${name} built → ${dir}/dist/lambda.zip"
  echo

  cd "$original_dir"
}

info "🏗️  Building Lambda functions…"
echo

# ---------- define your lambdas here ----------
# Format: "Name|Directory|Entry"
# Entry defaults to src/index.ts if omitted
LAMBDAS=(
  "Lead Processor|lambda/lead-processor|src/index.ts"
  "Email Notifier|lambda/email-notifier|src/index.ts"
)

for item in "${LAMBDAS[@]}"; do
  IFS='|' read -r NAME DIR ENTRY <<< "$item"
  build_lambda "$NAME" "$DIR" "$ENTRY"
done

ok "✅ All Lambda functions built successfully!"
echo
echo "📁 Deployment packages:"
for item in "${LAMBDAS[@]}"; do
  IFS='|' read -r NAME DIR ENTRY <<< "$item"
  echo "  - ${DIR}/dist/lambda.zip"
done
echo

# Notes:
# - Set the Lambda handler to "index.handler" in AWS (or your IaC).
# - If your entry lives at a different path, change the Entry field accordingly.
# - If you need to externalize a native module, add: --external:<pkg>
