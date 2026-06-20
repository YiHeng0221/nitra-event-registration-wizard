#!/usr/bin/env bash
# PreToolUse guard: block edits to assignment-provided files.
# The mock data and the design-token system are given — build on top, don't mutate them.
# Exit 2 tells Claude Code to block the tool call and surface stderr to the model.
set -euo pipefail

path=$(cat | python3 -c "import sys,json;print(json.load(sys.stdin).get('tool_input',{}).get('file_path',''))" 2>/dev/null || true)

case "$path" in
  */src/mocks/*|*/src/unocss/*|*/src/css/colors.scss|*/src/css/typography.scss|*/yarn.lock)
    echo "BLOCKED: $path is a provided/generated file (mock data, design tokens, or lockfile). Do not modify it — build on top instead. Override only with the user's explicit go-ahead." >&2
    exit 2
    ;;
esac
exit 0
