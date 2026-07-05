#!/bin/bash
set -e

BUMP="${1:-patch}"

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

# Beta releases: `bin/release.sh beta` starts or continues a beta line,
# published as a GitHub prerelease. `bin/release.sh beta major|patch` picks
# the base bump when starting a new line (default minor).
# Promoting a beta to stable needs no special mode: a plain
# `bin/release.sh patch` on 0.92.0-beta.N yields 0.92.0.
if [ "$BUMP" = "beta" ]; then
  CURRENT_VERSION=$(node -p "require('./package.json').version")
  if [[ "$CURRENT_VERSION" == *-beta.* ]]; then
    # already in a beta line: 0.92.0-beta.1 -> 0.92.0-beta.2
    NEW_VERSION=$(npm version prerelease --preid=beta)
  else
    # start a beta line from a stable base: 0.91.0 -> 0.92.0-beta.0
    NEW_VERSION=$(npm version "pre${2:-minor}" --preid=beta)
  fi
  GH_RELEASE_FLAGS=(--prerelease)
else
  NEW_VERSION=$(npm version "$BUMP")
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
