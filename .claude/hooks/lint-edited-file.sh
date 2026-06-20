#!/usr/bin/env bash
# PostToolUse: lint the file Claude just edited, so mistakes surface immediately.
# Only lints .vue / .ts / .js. Output is truncated to keep context clean (article §6).
# Non-blocking: always exit 0 — this is a fast feedback signal, not a gate (CI is the gate).
set -uo pipefail

path=$(cat | python3 -c "import sys,json;print(json.load(sys.stdin).get('tool_input',{}).get('file_path',''))" 2>/dev/null || true)

case "$path" in
  *.vue|*.ts|*.js)
    # Skip files outside this project's lint scope.
    case "$path" in
      */src/mocks/*|*/src/unocss/*|*/node_modules/*|*/.quasar/*) exit 0 ;;
    esac
    cd "${CLAUDE_PROJECT_DIR:-.}" || exit 0
    yarn eslint "$path" 2>&1 | head -30 || true
    ;;
esac
exit 0
