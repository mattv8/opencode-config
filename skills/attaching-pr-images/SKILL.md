---
name: attaching-pr-images
description: Use when adding screenshots or other images to a GitHub pull request description or comment.
---

# Attaching Images to GitHub Pull Requests

- Keep screenshots out of the feature branch. Upload them to a dedicated `pr-<number>-visual-evidence` branch.
- `gh pr edit` and `gh pr comment` cannot upload binaries directly. Use `gh api` Git Data endpoints:
  1. Upload each PNG with `POST repos/{owner}/{repo}/git/blobs` using `encoding=base64`.
  2. Create a tree with `POST repos/{owner}/{repo}/git/trees`.
  3. Create a commit with `POST repos/{owner}/{repo}/git/commits`.
  4. Create or update `refs/heads/pr-<number>-visual-evidence`.
- Embed commit-pinned images: `![Label](https://github.com/<owner>/<repo>/blob/<commit>/pr-<number>/<file>.png?raw=true)`.
- PR description: preserve the existing body, append the image Markdown, then run `gh pr edit <number> --body-file <file>`.
- PR comment: run `gh pr comment <number> --body-file <file>`.
- Verify the remote files exist and GitHub renders the expected number of `<img>` elements.
