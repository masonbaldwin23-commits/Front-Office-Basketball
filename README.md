# Front Office Basketball — Prototype 0.20.0-alpha

This test build now supports a complete multi-season loop: regular season, playoffs, lottery, draft, contract decisions, free agency and the transition into the next year.

## Run it on Windows

1. Install the current Node.js LTS version.
2. Open this folder in Visual Studio Code.
3. Open **Terminal → New Terminal**.
4. Run `npm start`.
5. Open `http://localhost:4173` in Edge or Chrome.

Run the automated checks with `npm test`.

## Included

- 30 fictional teams and 450 generated players
- Hidden true ratings
- Different perceived rating ranges for every organization
- Stronger information for players on your own roster
- Staff quality, familiarity and potential uncertainty
- A unified My Organization screen with Roster, Front Office, and Rotation & Health views
- User-controlled 240-minute rotations with automatic depth charts, injury-aware minute redistribution, and offensive/defensive scheme choices
- Persistent fatigue and deterministic injuries that affect player availability and effective game ratings
- Five persistent staff roles for all 30 teams: head coach, player development director, head scout, pro scout and college scout
- A balanced staff hiring market with multi-year contracts, role replacement, specialties and a separate basketball-operations budget; elite candidates are usually employed by AI organizations
- Clickable staff cards with role-colored skill profiles, contract guarantees, transaction history and in-season firing with ownership-funded buyouts outside the player salary cap
- Staff development and decline between seasons, including contract expirations and AI staff replacement
- Head coaches influence game execution while player-development staff influence offseason player progression and veteran decline
- Pro and college scout ratings, speed and specialties directly control report accuracy, assignment progress and active coverage limits
- Commissioner toggle for comparing estimates with hidden ratings
- Named compact saves with deletion and visible save feedback
- Pro and draft scouting assignments, including automatic prospect targeting
- 82-game simulation, calendar box scores, standings and weekly power rankings
- Dedicated playoff tab with a persistent bracket and league-wide next-game or full-round simulation
- Playoff scores, box scores, player postseason logs, and the championship series above the conference brackets
- Persistent scouting knowledge after an assignment ends, faster targeted scouting growth, and gold team markers in league tables
- The most recent box score on the roster screen after every simulated game
- A box-score button on every played playoff series result, with clickable player cards for both teams
- Player cards opened from a box score include a back control that returns to that same box score
- Playoff matchup cards combine the series score and latest-game box-score control without repeating team names
- Two-sided trade construction with multi-player packages from both rosters
- Three seasons of tradable first- and second-round picks, with projected pick value in the AI GM's model
- Opponent-specific trade labels showing how the other front office values incoming players and protects its own assets
- AI GM trade responses that explain acceptance, rejection, roster fit, contracts, uncertainty, team direction and cornerstone protection
- Accepted trades immediately update both rosters and persist in league saves
- Changing the opposing team clears and revalidates the offer so stale assets cannot be submitted against the wrong roster
- Prototype roster-limit protection for unbalanced multi-player packages
- Save isolation: trades in one league cannot change another save or a newly created league
- Rejected offers can produce a concrete AI counteroffer that loads into the builder for review, editing and resubmission
- Persistent menu display setting with dark navy, brighter slate and light high-contrast backgrounds
- Bright themes use coordinated blue/teal accents instead of the dark orange treatment
- Blockbuster-only cornerstone protection: quantity packages cannot substitute for a premium headliner
- The AI refuses to counter non-credible lowballs and only negotiates from serious opening offers
- Counteroffer cards show the revised package valuation separately from the original rejected proposal
- Completed-trade history below the Trade Center with outgoing and incoming players, picks, salary and valuation
- Completed-trade player names remain clickable, and the history persists after saving and reopening
- Every submitted offer builds the other team's projected starting five and 10-man rotation before and after the trade
- AI GMs identify incoming starters, displaced starters, bench changes and new positional holes
- Rotation impact changes the internal trade value, with contenders protecting present-day lineup quality more aggressively than rebuilders
- Trade responses display the projected post-trade starting five and before/after rotation score
- Completed-trade history preserves the accepting GM's rotation snapshot
- Trade intelligence is identified as your staff's estimate of the opposing GM rather than private numbers shared by that team
- Rejected offers remain editable and can be resubmitted even when the other GM declines to generate a counteroffer
- Player ID zero is handled correctly in projected lineups, preventing a valid Atlanta point guard from appearing as an open roster spot
- Separate negotiation-gap and rotation-outlook panels prevent a small lineup change from being mistaken for a nearly accepted trade
- Credible cornerstone offers can receive a counteroffer even when the two teams remain far apart
- Cornerstone counteroffers keep the requested star in the deal and name the additional price instead of substituting a different outgoing player
- Official 2026–27 cap, tax, first-apron and second-apron thresholds
- Team cap sheets showing payroll, cap position and apron room in the Trade Center
- NBA-style trade salary matching, including cap-room absorption, expanded matching below the first apron and 100% matching above it
- Second-apron aggregation protection for high-payroll teams
- Detailed contract schedules on player cards with every remaining season's salary, guarantees, options and free-agency status
- NBA contract labels including Rookie Scale, Rookie Max Extension, Maximum, Supermax, Veteran Minimum and Standard contracts
- Dedicated Finances tab with the current cap, tax and apron position, a five-season payroll outlook and a complete contract ledger
- Upcoming free agents, team/player options and non-guaranteed salary decisions collected in one contract calendar
- In-season extension offers with player salary demands, eligibility windows, multi-year raises and future cap-sheet impact
- Waivers and releases that move guaranteed salary into a persistent dead-money ledger
- Up to three two-way contracts per organization, excluded from standard team payroll and available from the regular-season unsigned-player pool
- Player transaction logs covering extensions, waivers and two-way signings
- Pre-league rule selection with persistent Modern NBA and Simplified Salary Cap presets
- Clickable in-game financial rules guide for cap, tax and apron terminology
- Compressed, backward-compatible browser saves with a safe unsaved-exit recovery prompt
- Five visible save slots; existing saves are never deleted automatically
- Returning to the home menu clears the new-league name and restores the default starting organization while preserving the browser-wide display theme
- Simplified leagues retain a soft cap and luxury tax while removing aprons and using universal 125% trade matching
- Older saves automatically receive isolated, detailed contract and cap data when loaded
- NBA-style 14-team draft lottery with weighted top-four drawings and postseason-aware picks 15–30
- Lottery night is now a distinct offseason event: reveal the results, review the official order and make trades before advancing to draft night
- Complete two-round draft room with live pick ownership, lottery movement and selection history
- Traded draft picks remain with their current owner when the official order is created
- The Trade Center reopens after the lottery and remains active through the final selection, with official pick numbers and live order updates
- User-controlled teams receive credible AI trade calls while on the clock and can accept or decline pick packages directly in the draft room
- User-controlled teams make their own selections; AI teams draft from their scouting, direction and positional needs
- League creation includes Weak, Realistic, Strong and Historic draft-class settings; Realistic is the default
- Realistic classes use a grounded rookie distribution with scarce elite prospects, while Historic intentionally enables loaded all-time classes
- Older oversized prospect classes are normalized once when loaded without changing player identities, college production, selection history or pick ownership
- First-round selections receive four-year rookie-scale contracts with two guaranteed seasons and two team options
- Second-round selections use the Second-Round Pick Exception, and future rookie salaries appear in the cap outlook without affecting the completed season's payroll
- Post-draft contract-option stage with user-controlled team-option decisions and automatic player/AI decisions
- Expiring contracts enter a live free-agent pool with restricted/unrestricted status, Bird-rights labels and cap holds
- Cap-room, Bird-rights, mid-level and minimum-exception paths for legal signings
- User and AI offers remain pending while players compare competing money, term, interest and roster-fit options; restricted offer sheets can still be matched by the prior team
- Player-interest meters reflect winning, role opportunity, prior-team familiarity and career timeline, and low-interest players may require a premium offer
- Front-office team grades weigh last season's offense and defense, current positional depth, skill needs and roster redundancy instead of simply repeating overall
- The free-agent market keeps simple name, position and affordability filters, with lowest-to-highest or highest-to-lowest ordering for fit, talent, interest, salary and age
- A league-wide free-agency recap groups every signing by organization, shows the viewing team's estimated overall range, contract terms and first-year money, and remains available before the next season begins
- Free agency now has separate Unsigned Players and Team Signings views, and a permanent regular-season tab keeps every unsigned veteran searchable afterward
- Completing free agency simulates the remaining AI market instead of skipping directly to minimum-roster cleanup; AI clubs build toward 16-player offseason rosters
- Wide free-agent tables stay contained inside the offseason panel and scroll internally instead of stretching past the background
- Cap holds can be renounced to create room, and the result now explains both the amount removed and any remaining distance above the cap
- Committed salary, cap holds, usable room, Bird rights, the mid-level exception and roster limits are clickable explanations in the offseason financial guide
- AI front offices submit competing offers across a 12-day market while the user retains control of their own roster
- Roster-floor completion and a final readiness check before opening night
- Starting the next season archives results and player production, advances contracts and ages, resets the schedule, adds future draft picks and generates a new 60-player class
- Season rollover now selects MVP, Defensive Player of the Year, Rookie of the Year, Sixth Man and Finals MVP winners
- Age- and ability-based retirements preserve complete career totals, awards and season history while AI roster cleanup maintains legal minimum rosters
- A permanent League History tab tracks champions, award winners, recent retirements and career points, rebounds and assists leaders
- Calendar, season, playoff, draft and player-history labels now follow the active season instead of remaining locked to 2026–27

## Next milestone

Deepen on-court management with lineup combinations and situational rotations, add training and rehabilitation priorities, improve AI contract negotiations and waiver claims, expand historical records, and complete the remaining second-apron penalties.
