---
name: create-pr
description: Open or update a GitHub PR from the current branch using the repo template (gh CLI). Use on "create/open a PR", "update the PR". Side-effecting — invoke explicitly.
disable-model-invocation: true
---

# Create a Pull Request

Open a PR from the current branch using `gh` and the repo template. Keep descriptions truthful to the
diff and consistent in structure.

## Pre-check (always first)

```bash
gh auth status
```

If it fails, tell the user to run `gh auth login` and STOP. Do not work around it.

## Process

### 1. Resolve and verify branches

```bash
SOURCE=$(git rev-parse --abbrev-ref HEAD)   # current branch
TARGET=${1:-main}                            # default main
git fetch origin "$TARGET"
git rev-parse --verify "origin/$TARGET"      # verify the remote target exists
```

Never open a PR from `main` into `main`.

### 2. Analyze the diff (against the remote target)

```bash
git diff --name-only "origin/$TARGET"...HEAD   # files changed
git log "origin/$TARGET"..HEAD --oneline       # commits
git diff "origin/$TARGET"...HEAD               # full diff, to write the description
```

Push the branch if it isn't on the remote yet: `git push -u origin "$SOURCE"`.

### 3. Write the description from `.github/PULL_REQUEST_TEMPLATE.md`

Fill the template's sections in order: **Summary → Changes → Spec traceability → Screenshots/Demo →
Self-check → Architectural decisions**. Rules:

- Describe **only what the diff contains** — never invent changes.
- **Spec traceability**: tie the work to the README step spec / evaluation criteria; tick what this PR
  actually delivers, leave the rest unticked.
- **Screenshots/Demo**: required for any UI change; delete the section if there is none.
- **Self-check**: tick only checks you actually ran (`yarn dev`, `yarn build`, token/state checks,
  self-review). Don't fabricate.
- **Architectural decisions**: link the ADR(s) this PR follows, or state none was introduced.
- Delete empty sections rather than leaving "N/A".

### 4. Title — Conventional Commits

`<type>(<scope>): <subject>` — type ∈ `feat|fix|chore|refactor|docs|test|perf|build`;
scope is the step or area (`step2`, `pricing`, `wizard`, `repo`). Imperative, ≤ 72 chars.
Prefix `Draft:` (or pass `--draft`) for stacked/incomplete work.

### 5. Open (or update) the PR

Write the body to a temp file to avoid shell-quoting issues:

```bash
BODY_FILE=$(mktemp)
cat > "$BODY_FILE" <<'EOF'
## Summary
...
EOF

gh pr create --base "$TARGET" --head "$SOURCE" \
  --title "feat(step2): add session selection with conflict-free picking" \
  --body-file "$BODY_FILE"
```

To update an existing PR: `gh pr edit <num> --body-file "$BODY_FILE"`.

### 6. Output

Report the PR URL.

## Anti-patterns

- ❌ A one-line "fix bug" description — fill the template.
- ❌ Fabricated self-check output — it must be real.
- ❌ Spec items ticked that weren't delivered.
- ❌ `--body "$VAR"` with newlines/quotes — use `--body-file`.
- ❌ Opening a PR with a red `yarn build` — fix first.
