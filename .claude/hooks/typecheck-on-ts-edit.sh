#!/usr/bin/env bash
# PostToolUse hook: typecheck after Claude edits TypeScript files under src/.
set -uo pipefail

input="$(cat)"

file_path="$(
  printf '%s' "$input" |
    jq -r '.tool_input.file_path // .tool_response.filePath // empty'
)"

[[ -z "$file_path" ]] && exit 0

case "$file_path" in
  *.ts|*.tsx) ;;
  *) exit 0 ;;
esac

case "$file_path" in
  */src/*|src/*) ;;
  *) exit 0 ;;
esac

project_dir="${CLAUDE_PROJECT_DIR:-$(pwd)}"
cd "$project_dir" || exit 0

if output="$(npm run typecheck 2>&1)"; then
  printf '%s\n' "TypeScript typecheck passed after editing ${file_path}." >&2
  exit 0
fi

printf '%s\n' \
  "TypeScript typecheck FAILED after editing ${file_path}:" \
  "$output" >&2

exit 2
