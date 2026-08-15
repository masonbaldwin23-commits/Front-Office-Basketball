# Front Office Basketball — Prototype 0.7.0-alpha

This test build covers the first playable regular-season loop, information asymmetry, persistent targeted scouting, saving, weekly league analysis, and a game-by-game postseason.

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
- Commissioner toggle for comparing estimates with hidden ratings
- Named compact saves with deletion and visible save feedback
- Pro and draft scouting assignments, including automatic prospect targeting
- 82-game simulation, calendar box scores, standings and weekly power rankings
- Dedicated playoff tab with a persistent bracket and league-wide next-game or full-round simulation
- Playoff scores, box scores, player postseason logs, and the championship series above the conference brackets
- Persistent scouting knowledge after an assignment ends, faster targeted scouting growth, and gold team markers in league tables
- The most recent box score on the roster screen after every simulated game

## Next milestone

Add roster construction: depth charts, minutes, lineup fit, positional needs and underused-asset detection. That becomes the input to the first AI GM trade planner and transaction system.
