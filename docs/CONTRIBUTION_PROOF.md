# Contribution Proof and Review

Evidence is more valuable than activity volume. A good bug report can be more useful than 10 incomplete code proposals.

## Evidence rubric proposal
- **Relevance (20%)**: tied to the actual mission and product behavior.
- **Specificity & reproducibility (25%)**: exact steps, environment, expected vs actual.
- **Functional/design quality (25%)**: correctness and expected user impact.
- **Originality & evidence (15%)**: no duplicate spam, verifiable artifacts.
- **Collaboration and review acceptance (15%)**: actionable feedback and reviewer decision.

These weights are a **future scoring specification**, not automated scoring in the live beta. Today, operator manually accepts or rejects each submission with an explicit note.

## Live proof claims
Only status=`accepted` exposes `/proof/:id`, showing mission, project, contributor handle, category, timestamp, reviewer note and optional evidence link. It does NOT assert merged code, verified test, production impact or financial rewards. Full private submission text is not public.

## State machine
New → pending → accepted | changes_requested | rejected. Current schema enforces one submission per mission/user, so 'changes requested' requires a future resubmit/iteration flow. An accepted contribution creates `triage_ready` workpacket reference and one XP ledger record; do not infer downstream agent execution.
