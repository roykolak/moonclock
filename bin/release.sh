#!/bin/bash
set -e

usage() {
  cat >&2 <<'EOF'
Usage: bin/release.sh <prod|beta> [bump]

  prod [patch|minor|major|X.Y.Z]  Publish a stable release (bump defaults to patch).
                                  On a beta version, promotes the line to stable
                                  (0.92.0-beta.3 -> 0.92.0).
  beta [minor|major|patch]        Publish a GitHub prerelease. Starts a beta line
                                  from a stable base (default minor bump), or
                                  increments -beta.N on an existing line.

A channel is required — there is no default release.
EOF
  exit 1
}

CHANNEL="${1:-}"
BUMP="${2:-}"

case "$CHANNEL" in
  prod | beta) ;;
  *) usage ;;
esac

if [ -n "$(git status --porcelain)" ]; then
  echo "Working tree has uncommitted changes. Aborting." >&2
  exit 1
fi

BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$BRANCH" != "main" ]; then
  echo "Not on main (on $BRANCH). Aborting." >&2
  exit 1
fi

git pull --ff-only

CURRENT_VERSION=$(node -p "require('./package.json').version")

if [ "$CHANNEL" = "beta" ]; then
  if [[ "$CURRENT_VERSION" == *-beta.* ]]; then
    # already in a beta line: 0.92.0-beta.1 -> 0.92.0-beta.2
    NEW_VERSION=$(npm version prerelease --preid=beta)
  else
    # start a beta line from a stable base: 0.91.0 -> 0.92.0-beta.0
    NEW_VERSION=$(npm version "pre${BUMP:-minor}" --preid=beta)
  fi
  GH_RELEASE_FLAGS=(--prerelease)
else
  if [[ "$CURRENT_VERSION" == *-beta.* ]]; then
    echo "Note: this promotes $CURRENT_VERSION to a stable release."
  fi
  NEW_VERSION=$(npm version "${BUMP:-patch}")
  GH_RELEASE_FLAGS=()
fi
echo "Bumped to $NEW_VERSION"

rollback_local() {
  echo ""
  echo "Failed. Rolling back local commit and tag for $NEW_VERSION..." >&2
  git tag -d "$NEW_VERSION" >/dev/null 2>&1 || true
  git reset --hard HEAD~1 >/dev/null 2>&1 || true
}
trap rollback_local ERR

npm run build
git push --follow-tags

trap - ERR

if ! gh release create "$NEW_VERSION" release.tar.gz --generate-notes "${GH_RELEASE_FLAGS[@]}" --verify-tag; then
  echo "" >&2
  echo "Release creation failed but commit and tag were already pushed." >&2
  echo "To clean up the remote tag and commit:" >&2
  echo "  git push --delete origin $NEW_VERSION" >&2
  echo "  git tag -d $NEW_VERSION" >&2
  echo "  git reset --hard HEAD~1 && git push --force-with-lease origin main" >&2
  exit 1
fi

echo ""
echo "Released $NEW_VERSION"
