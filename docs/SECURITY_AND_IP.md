# Security, Data and IP Baseline

**Implemented:** isolated Postgres; Argon2-style password hashing via Bun.password; HTTP-only Secure SameSite=Lax session cookie; SHA-256 hashed session tokens in DB; exact-origin checks on browser POST; parameterized SQL; mission+user uniqueness; one reward event per submission; restricted reviewer key held in Railway environment; request rate limiting; HTTPS-only evidence links; public proof excludes raw private submission text.

**Known shortcomings:** email identity unverified, rate limiting based on proxy headers is coarse, same-origin allows absent Origin (JSON-only cross-origin APIs should use explicit auth), no explicit password reset, no moderation queue for publicly published evidence links, no rate-limit cleanup policy, and no automated legal support/data deletion process. Large-scale public acquisition should address these promptly.

**Before GitHub App:** scope installation/repository rights; no arbitrary repository access; project authorization and tenant isolation; secrets never included in prompts; untrusted submissions are *data*, not agent instructions; enforce sandbox and budget caps. Apply branch protection and independently verified tests.

**Before paid bounties or tokens:** verify payment provider capabilities, customer permissions, consent/IP rights, accurate settlement and ledger reconciliation, applicable legal requirements and smart-contract correctness. Avoid inventing unrelated controls or blocking free onboarding.
