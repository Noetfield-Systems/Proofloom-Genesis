# Quest Engine and Reward Accounting

## Current mechanics
12 project-specific Genesis tasks spanning Feedback, Testing, Design, Bug Hunter, Learning and Vibe Coding. Levels: Beginner/Intermediate/Advanced. Each mission includes expected deliverable and an XP value awarded **only after acceptance**.

## Database invariants
Unique `(mission_id,user_id)` prevents infinite repeat submits; unique `reward_events.submission_id` prevents a second reward for the same submission; operator state transition checks `pending` before awarding; referral qualification occurs only on first accepted contribution and awards 30 XP once.

## Planned mechanics
Daily/weekly quests with cooldowns, seasonal missions, collaboration, reviewed bounties, proof-based ranking, anti-Sybil controls, weighted economic epochs. Anti-farm checks may use project-specific duplicate hashes and suspicious review graph detection; ordinary free entry should stay low-friction.

## Reward separation
`XP` = off-chain, nontransferable, no economic claim. `Contribution reputation` = evidence-based professional reputation. `Reward allocation` = conditional entitlement only after pool rules and funding. `Token claim` = actual verifiable contract transaction. `Bounty` = actual externally funded cash settlement.
