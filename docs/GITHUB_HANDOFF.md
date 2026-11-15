# Proofloom GitHub source, CI and next integration

**Live GitHub repository:** https://github.com/Noetfield-Systems/Proofloom-Genesis — `main` branch. The repository is populated with complete application source, Dockerfile, database migrations, localization dictionaries, tests, and `.github/workflows/ci.yml`.

**Railway source-linked deployment:** `proofloom-global-web` in the existing `proofloom` Railway project. Pushing to `main` triggers a Docker build and deploy. Last verified source-linked release: ten-language v0.3. The original Railway Function `proofloom-web` is preserved as a fallback; both use the same existing PostgreSQL service, not duplicate databases.

**Continuous integration:** the GitHub Actions workflow exists in the repository and runs Node source/contract tests on push and pull requests. Separately verify the actual GitHub Actions result; a successful Railway build is not proof of a successful Actions workflow. The latest source was locally tested 45/45, then the Railway deploy and live 60-locale smoke passed.

## Remaining agent source integration (not done)

Install an authorized GitHub App for this one repository, map the installation to a permitted Proofloom tenant/project, and authorize a bounded runner. Preserve branch protection, review policies, and the independent verifier. The `BRIDGE_REPOSITORY` variable identifies a repository but is **not** by itself an authorization grant. `BRIDGE_ENABLED=false` until a real runner is connected and checked.

Prove: accepted user submission → persisted WorkPacket → assigned execution → GitHub issue/PR → tests → merge → independently verified release → original user revalidation. No completed PR/release or financial result should be claimed until independently evidenced.

Never commit DATABASE_URL, reviewer/bridge/verifier secrets, user data, or production DB snapshots.

## v0.4 bounded execution update

The repo now contains bridge-runner.yml and release-verify.yml, with a dedicated q13 translation pilot, structured WorkPacket lease recovery and user-visible timeline. Both schedules are gated by separate repository variables. They do not prove a GitHub App is installed or a real issue/PR/release was produced. The acceptance and setup checklist is in BRIDGE_PILOT_OPERATIONS.md.
