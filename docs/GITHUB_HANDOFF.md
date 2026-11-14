# GitHub repository handoff and CI

**Intended GitHub repository:** `Noetfield-Systems/Proofloom` (private or public at Founder choice).

As of 2026-11-14, the repository was verified **not to exist** via the connected GitHub repository lookup. The available GitHub connector has file/commit/PR write operations but does not expose repository creation. No code push is claimed.

The ready-to-upload source is included in the package under `proofloom/`. To publish to a new private repo from a machine with GitHub CLI rights:

```bash
gh repo create Noetfield-Systems/Proofloom --private --source=. --remote=origin --push
```

Alternatively create the empty repo in the GitHub web UI and push with regular `git init`, `git add`, `git commit`, `git remote add origin`, `git push -u origin main`.

The included `.github/workflows/ci.yml` runs all source/bridge tests on every push and PR. Once a repo exists, connect the existing Railway Function or migrate to a GitHub-sourced Bun service. The current live Function remains authoritative until the new deployment is verified; don't create duplicate production databases.

For a GitHub App, install it on the single intended repository. Map the installation to an explicitly authorized Proofloom project. Only then set `BRIDGE_REPOSITORY`, store the server-side app credentials, enable bounded worker leasing, and demonstrate the first real PR with checks.

Never push `DATABASE_URL`, reviewer/bridge/verifier keys, customer data, or production volume snapshots.
