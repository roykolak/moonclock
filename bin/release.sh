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

NEW_VERSION=$(npm version "$BUMP")
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

if ! gh release create "$NEW_VERSION" release.tar.gz --generate-notes --verify-tag; then
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
