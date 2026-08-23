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
