# Moonclock

## Comments

Do not add code comments. This applies to every kind of file — TypeScript, shell
scripts, systemd units, config — and to every kind of comment, including block
comments above a function, inline notes explaining a line, and JSDoc.

Write the code so it reads on its own instead. If something genuinely needs
explaining — why an approach was chosen, what a non-obvious constraint is, what
was measured — that belongs in the commit message and the pull request
description, where it stays attached to the change that motivated it.

This is about new code. The existing codebase has plenty of comments; leave them
alone unless the code they describe is being changed anyway.

## Pull requests

A pull request that changes the UI shows the UI. Capture the affected screen and
put it in the description — a before/after pair when the change alters something
that already existed, a single shot when it's new. Check the change at a phone
viewport too, and include that shot whenever the layout differs there.

Drive the capture with Playwright against the dev server (`npm run app:test`,
seeded through `e2e/support/seedDatabase.ts`) rather than by hand, so the shot
shows the real app in a known state. Crop to the part that changed. Delete the
capture script afterwards — it is scaffolding, not something to commit.

Host the images on a throwaway `pr-screenshots/<branch>` branch pushed alongside
the PR branch, and link them from the description by their
`raw.githubusercontent.com` URLs. That keeps binaries out of the diff being
reviewed. Say in the description that the branch is disposable, so whoever
merges knows the images go with it.
