import {ATTRIBUTES,TEAM_DIRECTIONS,createLeague,scoutingReport,playerScoutExplanation,teamScoutingReport,simulateDays,advancePostseason,performanceSummary,seasonAverages,collegeAverages,setDeclaredDirection,setScoutingTarget,powerRankings,gameDate,inches} from "./engine.js";

const $=id=>document.getElementById(id);
const STORAGE_KEY="front-office-basketball-saves-v1";
let league,commissioner=false,activeScreen="roster-screen",rankingConference="All",standingsConference="All",controlledTeamId=4,saveId=null,leagueName="",toastTimer=null;
const grade=n=>n>=90?"A+":n>=86?"A":n>=82?"A-":n>=78?"B+":n>=74?"B":n>=70?"B-":n>=66?"C+":n>=62?"C":"C-";
function option(value,text){const o=document.createElement("option");o.value=value;o.textContent=text;return o;}

function init(seed=Date.now()){
  league=createLeague(seed);
  saveId=null;leagueName="";
  mountLeague();
}

function mountLeague(){
  for(const p of league.prospects){if(!p.collegeSeason){p.collegeSeason={gp:0,minutes:0,points:0,rebounds:0,assists:0,fgm:0,fga:0,threeM:0,threeA:0};p.history=[];}}
  league.seasonYear??=2026;league.phase??="Regular Season";league.postseason??=null;for(const p of league.players)p.contract??={years:1+((p.id+league.seed)%5),salary:+Math.max(1.2,(scoutingReport(league,p.teamId,p).perceived-55)*1.05).toFixed(1)};
  $("viewer-team").replaceChildren(...league.teams.map(t=>option(t.id,t.name)));
  $("viewer-team").value=controlledTeamId??4;
  $("setup-team").replaceChildren(...league.teams.map(t=>option(t.id,t.name)));$("setup-team").value=controlledTeamId??4;
  league.userTeamId=controlledTeamId;
  populateOpponentTeams();
  populateScoutingTeams();
  $("player-count").textContent=league.players.length;
  render();
}

function allSaves(){try{return JSON.parse(localStorage.getItem(STORAGE_KEY)||"[]");}catch{return [];}}
function saveDateText(){return gameDate(Math.min(81,Math.max(0,league.day)));}
function showSaveToast(){clearTimeout(toastTimer);$("save-toast").classList.add("show");toastTimer=setTimeout(()=>$("save-toast").classList.remove("show"),1800);}
function saveLeague(showFeedback=false){
  if(!league)return;saveId=saveId||`league-${Date.now()}`;leagueName=leagueName||$("league-name").value.trim()||"Basketball Universe";const saves=allSaves(),entry={id:saveId,name:leagueName,savedAt:Date.now(),date:saveDateText(),controlledTeamId,viewTeamId:Number($("viewer-team").value),league};const index=saves.findIndex(x=>x.id===saveId);if(index>=0)saves[index]=entry;else saves.unshift(entry);localStorage.setItem(STORAGE_KEY,JSON.stringify(saves));renderSavedLeagues();
  if(showFeedback)showSaveToast();
}
function renderSavedLeagues(){
  const saves=allSaves();$("saved-league-list").innerHTML=saves.length?saves.sort((a,b)=>b.savedAt-a.savedAt).map(s=>`<div class="save-card"><div><strong>${s.name}</strong><small>${s.date} · ${s.controlledTeamId===null?"Spectator league":s.league.teams[s.controlledTeamId]?.name||"Unknown team"}</small></div><button class="load-save" data-save-id="${s.id}">Continue</button></div>`).join(""):"<span>No saved leagues yet.</span>";
  document.querySelectorAll(".load-save").forEach(b=>b.addEventListener("click",()=>loadLeague(b.dataset.saveId)));
}
function loadLeague(id){const entry=allSaves().find(x=>x.id===id);if(!entry)return;league=entry.league;saveId=entry.id;leagueName=entry.name;controlledTeamId=entry.controlledTeamId;mountLeague();$("viewer-team").value=entry.viewTeamId??controlledTeamId??4;applyModeUi();$("setup-screen").classList.add("closed");document.body.classList.remove("menu-open");populateOpponentTeams();populateScoutingTeams();render();}
function applyModeUi(){const spectator=controlledTeamId===null;league.userTeamId=controlledTeamId;$("viewer-label").textContent=spectator?"Viewing organization":"Your organization";$("viewer-team").closest("label").classList.toggle("hidden",!spectator);document.querySelector('[data-screen="roster-screen"]').textContent=spectator?"Team Roster":"My Roster";}
function returnToMenu(){saveLeague();$("setup-screen").classList.remove("closed");document.body.classList.add("menu-open");renderSavedLeagues();}

function populateScoutingTeams(){const viewer=Number($("viewer-team").value),old=Number($("scout-team-select")?.value),teams=league.teams.filter(t=>t.id!==viewer);$("scout-team-select").replaceChildren(...teams.map(t=>option(t.id,t.name)));if(teams.some(t=>t.id===old))$("scout-team-select").value=old;}

function populateOpponentTeams(){
  const viewer=Number($("viewer-team").value),old=Number($("target-team").value),teams=league.teams.filter(t=>t.id!==viewer);
  $("target-team").replaceChildren(...teams.map(t=>option(t.id,t.name)));
  if(teams.some(t=>t.id===old))$("target-team").value=old;
}

function reportHtml(r,internal=false){
  const direction=internal?`<select class="direction-select">${TEAM_DIRECTIONS.map(d=>`<option ${d===r.direction?"selected":""}>${d}</option>`).join("")}</select><small>You control this public trade signal; results do not change it automatically.</small>`:`<b>${r.direction}</b><small>Public declaration — no scouting required</small>`;
  return `<div><strong>${internal?"Management direction":"Declared direction"}</strong><span>${direction}</span></div><div><strong>Competitive assessment</strong><span><b>${r.competitiveAssessment}</b><small>Automatically updated from talent and results</small></span></div><div><strong>Basketball identity</strong><span>${r.style}</span></div><div class="wide"><strong>Trade signal</strong><span>${r.declaredSignal}</span></div><div class="wide"><strong>Cornerstone</strong><span>${r.cornerstoneReason}</span></div><div><strong>Roster priorities</strong><span>${r.needs.join(", ")}</span></div><div><strong>Front-office mindset</strong><span>${r.philosophy}</span></div><div class="wide"><strong>Season outlook</strong><span>${r.outlook}${internal?"":` Scouting confidence on the basketball assessment: ${r.confidence}%.`}</span></div>`;
}

function rosterRows(teamId,viewerId){return league.players.filter(p=>p.teamId===teamId).map(p=>({p,r:scoutingReport(league,viewerId,p)})).sort((a,b)=>b.r.perceived-a.r.perceived);}

function heat(p,r){if(p.season.gp<5)return "";const form=performanceSummary(p).currentForm,diff=form-r.perceived;return diff>=4?" 🔥":diff<=-4?" 🥶":"";}

function outlookText(p,r){const perf=performanceSummary(p);return p.age<=25?`Peak ${r.estimates.potential.low}–${r.estimates.potential.high}`:p.age<=29?`Ceiling ${r.estimates.potential.low}–${r.estimates.potential.high}`:`Peak ${r.estimates.potential.low}–${r.estimates.potential.high} · ${perf.trajectory}`;}

function rosterHtml(rows,internal,detail="trade"){
  return rows.map(({p,r})=>{
    const perf=performanceSummary(p),form=perf.currentForm===null?"—":`${perf.currentForm}${heat(p,r)}`,season=perf.seasonImpact===null?"—":perf.seasonImpact;
    return `<tr><td><button class="player-link" data-player-id="${p.id}"><strong>${p.name}${heat(p,r)}</strong><small>${inches(p.height)} · ${r.marketTier}</small></button></td><td>${p.position}/${p.secondary}</td><td>${p.age}</td><td>${internal?`${r.perceived} · ${grade(r.perceived)}`:`${r.overallLow}–${r.overallHigh} · ${grade(r.perceived)}`}</td><td>${form}</td>${detail==="roster"?`<td>${season}</td>`:""}<td>${outlookText(p,r)}</td><td>$${p.contract.salary}M · ${p.contract.years} yr</td></tr>`;
  }).join("");
}

function render(){
  const viewerId=Number($("viewer-team").value),targetId=Number($("target-team").value),viewer=league.teams[viewerId],target=league.teams[targetId],ownReport=teamScoutingReport(league,viewerId,viewerId),opponentReport=teamScoutingReport(league,viewerId,targetId),controlled=league.userTeamId===viewerId;
  $("own-name").textContent=viewer.name;$("opponent-name").textContent=target.name;$("own-trade-record").textContent=`${viewer.wins}-${viewer.losses} · ${viewer.conference}`;$("opponent-trade-record").textContent=`${target.wins}-${target.losses} · ${target.conference}`;$("opponent-confidence").textContent=`${opponentReport.confidence}% CONFIDENCE`;
  $("own-report").innerHTML=reportHtml(ownReport,controlled);$("opponent-report").innerHTML=reportHtml(opponentReport);
  $("own-roster").innerHTML=rosterHtml(rosterRows(viewerId,viewerId),controlled,"trade");$("opponent-roster").innerHTML=rosterHtml(rosterRows(targetId,viewerId),false,"trade");
  $("roster-screen-name").textContent=viewer.name;$("roster-screen-report").innerHTML=reportHtml(ownReport,controlled);$("roster-screen-players").innerHTML=rosterHtml(rosterRows(viewerId,viewerId),controlled,"roster");
  renderSeasonCenter(viewerId);renderCalendar(viewerId);renderScouting(viewerId);bindDynamicControls(viewerId);
}

function marketRead(row){const move=(row.preseasonRank||row.rank)-row.rank;if(row.preseasonRank<=6&&row.rank>=15)return "Disappointing contender — monitor as seller";if(row.team.declaredDirection==="Rebuilding")return "Likely seller; seek veterans or absorb salary";if(row.team.declaredDirection==="Contending")return "Likely buyer; core players difficult to acquire";if(move>=6)return "Rising team; may seek a finishing piece";if(move<=-6)return "Falling below expectations; direction may change";return "Market position currently stable";}

function teamFitScore(player,report,viewerId){
  const roster=league.players.filter(p=>p.teamId===viewerId),positionStrength=Object.fromEntries(["PG","SG","SF","PF","C"].map(pos=>[pos,Math.max(0,...roster.filter(p=>p.position===pos).map(p=>scoutingReport(league,viewerId,p).perceived))])),weakest=Math.min(...Object.values(positionStrength)),needBonus=positionStrength[player.position]===weakest?10:positionStrength[player.position]<=weakest+4?5:0;return report.perceived+needBonus+(report.perceivedPotential-report.perceived)*.25;
}

function sortScoutingRows(rows,sort,viewerId){return [...rows].sort((a,b)=>sort==="fit"?teamFitScore(b.p,b.r,viewerId)-teamFitScore(a.p,a.r,viewerId):sort==="position"?a.p.position.localeCompare(b.p.position)||b.r.perceived-a.r.perceived:b.r.perceived-a.r.perceived);}

function projectedDraftSlot(teamId){const inverse=[...league.teams].sort((a,b)=>a.wins/(a.wins+a.losses||1)-b.wins/(b.wins+b.losses||1)||(a.pointsFor-a.pointsAgainst)/(a.wins+a.losses||1)-(b.pointsFor-b.pointsAgainst)/(b.wins+b.losses||1));return inverse.findIndex(t=>t.id===teamId)+1;}

function autoAssignDraft(viewerId){
  const viewer=league.teams[viewerId],strategy=$("draft-auto-strategy").value,rows=league.prospects.map(p=>({p,r:scoutingReport(league,viewerId,p)})).sort((a,b)=>b.r.marketScore-a.r.marketScore),slot=projectedDraftSlot(viewerId);for(const p of league.prospects)delete viewer.scoutingTargets[p.id];let choices;if(strategy==="range")choices=rows.slice(Math.max(0,slot-5),Math.min(rows.length,slot+5));else if(strategy==="position")choices=sortScoutingRows(rows,"fit",viewerId).slice(0,10);else choices=rows.slice(0,10);for(const x of choices)setScoutingTarget(league,viewerId,x.p.id,true);render();saveLeague();
}

function hasDraftAssignments(viewerId){const targets=league.teams[viewerId].scoutingTargets||{};return league.prospects.some(p=>targets[p.id]!==undefined);}
function maybePromptScouting(beforeDay){if(controlledTeamId===null||league.scoutingReminderHandled||beforeDay>=10||league.day<10||hasDraftAssignments(controlledTeamId))return;league.scoutingReminderHandled=true;$("scouting-reminder").showModal();saveLeague();}
function simulateFromUi(count){const before=league.day;simulateDays(league,count);render();saveLeague();maybePromptScouting(before);}

function rankingExplanation(row,viewerId){
  const snapshotDay=row.snapshotDay||0,games=league.results.filter(g=>g.day<=snapshotDay&&g.day>snapshotDay-7&&(g.homeId===row.team.id||g.awayId===row.team.id)),wins=games.filter(g=>(g.homeId===row.team.id&&g.homeScore>g.awayScore)||(g.awayId===row.team.id&&g.awayScore>g.homeScore)).length,losses=games.length-wins;
  if(!games.length)return `Preseason rank #${row.preseasonRank} is based on roster talent, depth and projected fit.`;
  const margins=games.map(g=>g.homeId===row.team.id?g.homeScore-g.awayScore:g.awayScore-g.homeScore),margin=(margins.reduce((a,b)=>a+b,0)/margins.length).toFixed(1),roster=league.players.filter(p=>p.teamId===row.team.id&&p.season.performances.length).map(p=>{const recent=p.season.performances.slice(Math.max(0,snapshotDay-7),snapshotDay);return {p,form:recent.reduce((a,b)=>a+b,0)/Math.max(1,recent.length),r:scoutingReport(league,viewerId,p)};}).sort((a,b)=>(b.form-b.r.perceived)-(a.form-a.r.perceived)),hot=roster[0],cold=roster.at(-1),move=(row.preseasonRank||row.rank)-row.rank;
  let reason=`Went ${wins}-${losses} over the latest ranking period with an average margin of ${Number(margin)>=0?"+":""}${margin}. `;
  if(losses>=5&&row.preseasonRank>20)reason+="The roster has performed like a rebuilding team and currently lacks enough high-end production. ";
  else if(losses>=4)reason+=cold&&cold.form<cold.r.perceived-3?`${cold.p.name} struggled while the team played below its expected level. `:"Several losses came from the roster collectively underperforming expectations. ";
  else if(wins>=5)reason+=hot&&hot.form>hot.r.perceived+3?`${hot.p.name}'s strong week helped drive the rise. `:"Strong team-wide execution drove the week. ";
  if(move>=5)reason+=`That pushed them ${move} spots above their preseason projection.`;else if(move<=-5)reason+=`They remain ${Math.abs(move)} spots below their preseason projection.`;else reason+="Their position remains reasonably close to preseason expectations.";
  reason+=` Season overview: ${row.team.wins}-${row.team.losses}, ${(row.net>=0?"+":"")+row.net.toFixed(1)} net rating, currently assessed as ${row.team.declaredDirection.toLowerCase()}.`;
  return reason;
}

function renderScouting(viewerId){
  const standingsPool=standingsConference==="All"?league.teams:league.teams.filter(t=>t.conference===standingsConference);
  const standings=[...standingsPool].sort((a,b)=>{const ag=a.wins+a.losses,bg=b.wins+b.losses,ap=ag?a.wins/ag:.5,bp=bg?b.wins/bg:.5,anet=ag?(a.pointsFor-a.pointsAgainst)/ag:0,bnet=bg?(b.pointsFor-b.pointsAgainst)/bg:0;return bp-ap||bnet-anet||b.wins-a.wins;});
  $("standings-body").innerHTML=standings.map((t,i)=>{const games=t.wins+t.losses,net=games?(t.pointsFor-t.pointsAgainst)/games:0,pct=games?(t.wins/games).toFixed(3).replace(/^0/,""):"—";return `<tr><td><strong>#${i+1}</strong></td><td>${t.name}</td><td>${t.conference}</td><td>${t.wins}-${t.losses}</td><td>${pct}</td><td>${games?(net>=0?"+":"")+net.toFixed(1):"—"}</td><td>${t.declaredDirection}</td></tr>`;}).join("");
  const rankings=powerRankings(league,viewerId,rankingConference,false);
  const snapshotDay=rankings[0]?.snapshotDay||0;$("ranking-update-note").textContent=snapshotDay?`Official week ${Math.ceil(snapshotDay/7)} snapshot · records and net ratings are current`:`Preseason snapshot · first update after game date 7`;
  $("power-rankings-body").innerHTML=rankings.map(r=>{const move=r.preseasonRank?r.preseasonRank-r.rank:0,arrow=move>0?`▲${move}`:move<0?`▼${Math.abs(move)}`:"—",games=r.team.wins+r.team.losses;return `<tr><td><strong>#${r.rank}</strong> <small class="${move>0?"up":move<0?"down":""}">${arrow}</small></td><td>#${r.preseasonRank||"—"}</td><td>${r.team.name}</td><td>${r.team.conference}</td><td>${r.team.wins}-${r.team.losses}</td><td>${games?(r.net>=0?"+":"")+r.net.toFixed(1):"—"}</td><td>${r.team.declaredDirection}</td><td>${rankingExplanation(r,viewerId)}</td></tr>`;}).join("");
  const teamId=Number($("scout-team-select").value),proPosition=$("pro-position").value,proSort=$("pro-sort").value,proRows=sortScoutingRows(rosterRows(teamId,viewerId).filter(x=>proPosition==="All"||x.p.position===proPosition),proSort,viewerId);
  $("pro-scouting-body").innerHTML=proRows.map(({p,r})=>`<tr><td><button class="player-link" data-player-id="${p.id}"><strong>${p.name}</strong><small>${r.marketTier}</small></button><button class="scout-target inline-target" data-player-id="${p.id}" data-targeted="${r.targeted}">${r.targeted?"Stop scouting":"Target player"}</button></td><td>${p.position}/${p.secondary}</td><td>${p.age}</td><td>${r.overallLow}–${r.overallHigh}</td><td>${r.confidence}%${r.targeted?` · ${r.targetDays} days targeted`:""}</td></tr>`).join("");
  const draftPosition=$("draft-position").value,draftSort=$("draft-sort").value,prospects=sortScoutingRows(league.prospects.map(p=>({p,r:scoutingReport(league,viewerId,p)})).filter(x=>draftPosition==="All"||x.p.position===draftPosition),draftSort,viewerId),slot=projectedDraftSlot(viewerId);$("draft-range-note").textContent=`Current record projects near draft slot ${slot} before the lottery. Range mode targets prospects around that portion of your board.`;
  $("draft-board-body").innerHTML=prospects.map(({p,r},i)=>{const c=collegeAverages(p);return `<tr><td>#${i+1}</td><td><button class="player-link" data-player-id="${p.id}"><strong>${p.name}</strong><small>${p.college} · ${c.gp?`${c.ppg} PPG in ${c.gp} GP`:"No college games yet"}</small></button><button class="scout-target inline-target" data-player-id="${p.id}" data-targeted="${r.targeted}">${r.targeted?"Stop scouting":"Target prospect"}</button></td><td>${p.position}/${p.secondary}</td><td>${p.age}</td><td>${r.overallLow}–${r.overallHigh}</td><td>${r.estimates.potential.low}–${r.estimates.potential.high}</td><td>${r.confidence}%${r.targeted?` · ${r.targetDays} days targeted`:""}</td></tr>`;}).join("");
}

function bindDynamicControls(viewerId){
  document.querySelectorAll(".player-link").forEach(b=>b.addEventListener("click",()=>openPlayer(Number(b.dataset.playerId),viewerId)));
  document.querySelectorAll(".direction-select").forEach(s=>s.addEventListener("change",()=>{setDeclaredDirection(league,viewerId,s.value,true);render();saveLeague();}));
  document.querySelectorAll(".sim-to-game").forEach(b=>b.addEventListener("click",()=>simulateFromUi(Math.max(0,Number(b.dataset.day)-1-league.day))));
  document.querySelectorAll(".box-score").forEach(b=>b.addEventListener("click",()=>openBoxScore(Number(b.dataset.day),viewerId)));
  document.querySelectorAll(".scout-target").forEach(b=>b.addEventListener("click",()=>{setScoutingTarget(league,viewerId,Number(b.dataset.playerId),b.dataset.targeted!=="true");render();saveLeague();}));
  $("advance-playoffs")?.addEventListener("click",()=>{advancePostseason(league);render();saveLeague();});
}

function renderSeasonCenter(viewerId){
  const team=league.teams[viewerId],sorted=[...league.teams].sort((a,b)=>(b.wins/(b.wins+b.losses||1))-(a.wins/(a.wins+a.losses||1))||b.wins-a.wins),rank=sorted.findIndex(t=>t.id===viewerId)+1,recent=league.results.filter(g=>g.homeId===viewerId||g.awayId===viewerId).slice(-5).reverse();
  $("season-label").textContent=league.phase==="Offseason"?"2027 OFFSEASON":league.phase==="Postseason"?"2027 POSTSEASON":"2026–27 REGULAR SEASON";$("season-status").textContent=league.phase==="Offseason"?"Season complete":league.phase==="Postseason"?(league.postseason?.stage||"Play-in tournament"):league.day>=82?"Regular season complete":league.day===0?"Opening night":`Game date ${league.day} of 82`;
  $("team-record").textContent=`${team.wins}–${team.losses}`;$("record-team").textContent=team.name;$("conference-rank").textContent=league.day?`#${rank}`:"—";
  $("recent-results").innerHTML=recent.length?recent.map(g=>{const home=g.homeId===viewerId,won=(home?g.homeScore:g.awayScore)>(home?g.awayScore:g.homeScore),opp=league.teams[home?g.awayId:g.homeId];return `<b class="${won?"win":"loss"}">${won?"W":"L"}</b> ${home?g.homeScore:g.awayScore}–${home?g.awayScore:g.homeScore} vs ${opp.name}`;}).join("<br>"):"No games played";
  $("sim-day").disabled=league.day>=82;$("sim-ten").disabled=league.day>=82;renderPostseason();
}

function seriesHtml(s){const a=league.teams[s.a.teamId],b=league.teams[s.b.teamId],winner=league.teams[s.winner.teamId];return `<div class="series-card"><span>#${s.a.seed} ${a.name}</span><strong>${s.aWins}–${s.bWins}</strong><span>#${s.b.seed} ${b.name}</span><small>${winner.name} advances</small></div>`;}
function renderPostseason(){const box=$("postseason-center");if(league.day<82){box.classList.add("hidden");return;}box.classList.remove("hidden");if(!league.postseason){box.innerHTML=`<div><p class="eyebrow">POSTSEASON</p><h2>Play-in tournament ready</h2><p class="subtitle">Seeds 7–10 in each conference enter the play-in. Seeds 1–6 qualified directly.</p></div><button id="advance-playoffs">Begin play-in</button>`;return;}const p=league.postseason;if(p.stage==="Season Complete"){box.innerHTML=`<div><p class="eyebrow">2027 CHAMPION</p><h2>${league.teams[p.champion].name}</h2><p class="subtitle">The league has entered the offseason.</p></div>`;return;}const groups=Object.entries(p.current).map(([name,series])=>`<section><h3>${name}</h3>${series.map(seriesHtml).join("")}</section>`).join("");box.innerHTML=`<div class="postseason-title"><div><p class="eyebrow">${p.stage.toUpperCase()}</p><h2>Postseason bracket</h2></div><button id="advance-playoffs">Advance round</button></div><div class="series-grid">${groups}</div>`;}

function renderCalendar(viewerId){
  $("calendar-team-name").textContent=league.teams[viewerId].name;
  const entries=league.schedule.map((games,day)=>{
    const g=games.find(x=>x.homeId===viewerId||x.awayId===viewerId),home=g.homeId===viewerId,opp=league.teams[home?g.awayId:g.homeId],result=league.results.find(x=>x.day===day+1&&(x.homeId===viewerId||x.awayId===viewerId));
    const date=new Date(Date.UTC(2026,9,20+day*2));let status="Upcoming";if(result){const our=home?result.homeScore:result.awayScore,their=home?result.awayScore:result.homeScore;status=`${our>their?"W":"L"} ${our}–${their}`;}return {day,date,home,opp,result,status};
  });
  const months=new Map();for(const e of entries){const key=`${e.date.getUTCFullYear()}-${e.date.getUTCMonth()}`;if(!months.has(key))months.set(key,[]);months.get(key).push(e);}
  $("calendar-body").innerHTML=[...months.values()].map(monthGames=>{const first=monthGames[0].date,year=first.getUTCFullYear(),month=first.getUTCMonth(),days=new Date(Date.UTC(year,month+1,0)).getUTCDate(),byDate=new Map(monthGames.map(e=>[e.date.getUTCDate(),e]));let cells="";for(let i=0;i<new Date(Date.UTC(year,month,1)).getUTCDay();i++)cells+='<div class="calendar-day empty"></div>';for(let d=1;d<=days;d++){const e=byDate.get(d);if(!e){cells+=`<div class="calendar-day"><span class="calendar-date">${d}</span></div>`;continue;}const action=e.result?`<button class="box-score" data-day="${e.day+1}">Box score</button>`:e.day>=league.day?`<button class="sim-to-game" data-day="${e.day+1}">Sim to</button>`:"";cells+=`<div class="calendar-day has-game ${e.day===league.day?"next-game":""}"><span class="calendar-date">${d}</span><strong>${e.home?"vs":"@"} ${e.opp.name}</strong><span class="calendar-result">${e.status}</span>${action}</div>`;}return `<section class="calendar-month"><h3>${first.toLocaleDateString("en-US",{month:"long",year:"numeric",timeZone:"UTC"})}</h3><div class="calendar-grid"><span class="weekday">Sun</span><span class="weekday">Mon</span><span class="weekday">Tue</span><span class="weekday">Wed</span><span class="weekday">Thu</span><span class="weekday">Fri</span><span class="weekday">Sat</span>${cells}</div></section>`;}).join("");
}

function openBoxScore(day,viewerId){
  const g=league.results.find(x=>x.day===day&&(x.homeId===viewerId||x.awayId===viewerId));
  if(!g)return;
  const table=(teamId,box,score)=>`<section class="box-team"><h3>${league.teams[teamId].name} <span>${score}</span></h3><div class="table-wrap"><table><thead><tr><th>Player</th><th>MIN</th><th>PTS</th><th>REB</th><th>AST</th><th>Game rating</th></tr></thead><tbody>${box.map(x=>{const p=league.players.find(y=>y.id===x.playerId);return `<tr><td>${p.name}</td><td>${x.minutes}</td><td>${x.points}</td><td>${x.rebounds}</td><td>${x.assists}</td><td>${x.performance}</td></tr>`;}).join("")}</tbody></table></div></section>`;
  $("dialog-content").innerHTML=`<p class="eyebrow">FINAL · ${gameDate(day-1)}</p><div class="box-score-title"><h2>${league.teams[g.awayId].name} ${g.awayScore}</h2><strong>at</strong><h2>${league.teams[g.homeId].name} ${g.homeScore}</h2></div>${table(g.awayId,g.awayBox,g.awayScore)}${table(g.homeId,g.homeBox,g.homeScore)}`;
  $("player-dialog").showModal();
}

function historyHtml(player){
  if(player.teamId===null){const c=collegeAverages(player),row=c.gp?`<tr class="current-season"><td>2026-27</td><td>College · Current · ${player.college}</td><td>${player.age}</td><td>${c.gp}</td><td>${c.mpg}</td><td>${c.ppg}</td><td>${c.rpg}</td><td>${c.apg}</td><td>${c.fg}</td><td>${c.three}</td></tr>`:`<tr><td colspan="10">The current college season has not begun; no production has been recorded.</td></tr>`;return `<div class="history"><p class="eyebrow">BASKETBALL HISTORY</p><div class="table-wrap"><table><thead><tr><th>Season</th><th>Level</th><th>Age</th><th>GP</th><th>MIN</th><th>PTS</th><th>REB</th><th>AST</th><th>FG%</th><th>3P%</th></tr></thead><tbody>${row}</tbody></table></div></div>`;}
  const current=seasonAverages(player),currentRow=current.gp?`<tr class="current-season"><td>2026-27</td><td>Pro · Current</td><td>${player.age}</td><td>${current.gp}</td><td>${current.mpg}</td><td>${current.ppg}</td><td>${current.rpg}</td><td>${current.apg}</td><td>${current.fg}</td><td>${current.three}</td></tr>`:"";
  return `<div class="history"><p class="eyebrow">BASKETBALL HISTORY</p><div class="table-wrap"><table><thead><tr><th>Season</th><th>Level</th><th>Age</th><th>GP</th><th>MIN</th><th>PTS</th><th>REB</th><th>AST</th><th>FG%</th><th>3P%</th></tr></thead><tbody>${currentRow}${player.history.map(s=>`<tr><td>${s.season}</td><td>${s.level}${s.team?` · ${s.team}`:""}</td><td>${s.age}</td><td>${s.games}</td><td>${s.mpg}</td><td>${s.ppg}</td><td>${s.rpg}</td><td>${s.apg}</td><td>${s.fg}</td><td>${s.three}</td></tr>`).join("")}</tbody></table></div></div>`;
}

function openPlayer(playerId,viewerId){
  const p=league.players.find(x=>x.id===playerId)||league.prospects.find(x=>x.id===playerId),r=scoutingReport(league,viewerId,p),viewer=league.teams[viewerId],why=playerScoutExplanation(r,p,viewer),teamName=p.teamId===null?p.college:league.teams[p.teamId].name,perf=performanceSummary(p),overallDisplay=r.own?`${r.perceived} OVR`:`Estimated OVR ${r.overallLow}–${r.overallHigh}`,development=p.age<=25?`Projected peak ${r.estimates.potential.low}–${r.estimates.potential.high}`:p.age<=29?`Current ceiling ${r.estimates.potential.low}–${r.estimates.potential.high}`:`Career peak ${perf.careerPeak} · ${perf.trajectory}`,form=perf.currentForm===null?"No current-season games":`Playing like ${perf.currentForm} over the last ${Math.min(10,p.season.gp)} games`,seasonImpact=perf.seasonImpact===null?"Not established":`Playing like ${perf.seasonImpact} across the season`;
  $("dialog-content").innerHTML=`<p class="eyebrow">${r.isProspect?"DRAFT SCOUTING REPORT":r.own?"INTERNAL PLAYER CARD":"PRO SCOUTING REPORT"}</p><div class="player-heading"><div class="avatar">${p.name.split(" ").map(x=>x[0]).join("")}</div><div><h2>${p.name}${heat(p,r)}</h2><p class="dialog-meta">Age ${p.age} · ${p.position}/${p.secondary} · ${inches(p.height)} · ${teamName}</p><p class="dialog-meta">${r.isProspect?`2027 prospect · Projected pick No. ${p.draftPick}`:p.experience===0?`Rookie · Pick No. ${p.draftPick} · ${p.college}`:`${p.experience} years pro`} · ${r.marketTier}</p></div></div><div class="form-grid"><div><span>Current talent</span><strong>${overallDisplay} (${grade(r.perceived)})</strong></div><div><span>Current form</span><strong>${r.isProspect?"College production shown below":form}</strong></div><div><span>Season impact</span><strong>${r.isProspect?"Not yet an NBA player":seasonImpact}</strong></div><div><span>Development outlook</span><strong>${development}</strong></div></div><div class="scout-reasons"><div><strong>Projected role</strong><span>${why.projection}</span></div><div><strong>Attribute case</strong><span>Best traits: ${why.strengths.join(", ")}. Concerns: ${why.concerns.join(", ")}.</span></div><div><strong>Production evidence</strong><span>${why.evidence}</span></div><div><strong>Scouting context</strong><span>${why.staffNote}</span></div></div><div class="ratings dialog-ratings">${ATTRIBUTES.map(([key,label])=>{const e=r.estimates[key],displayLabel=key==="potential"?(p.age<=25?"Projected Peak":p.age<=29?"Current Ceiling":"Peak Estimate"):label;return `<div class="rating"><span>${displayLabel}</span><strong>${e.low}–${e.high}${commissioner?` <em class="true">(${e.true})</em>`:""}</strong></div>`}).join("")}</div>${historyHtml(p)}`;
  $("player-dialog").showModal();
}

function switchScreen(screen){activeScreen=screen;document.querySelectorAll(".app-screen").forEach(x=>x.classList.toggle("hidden",x.id!==screen));document.querySelectorAll(".nav-tab").forEach(x=>x.classList.toggle("active",x.dataset.screen===screen));document.querySelectorAll(".trade-control").forEach(x=>x.classList.toggle("hidden",screen!=="trade-screen"));document.querySelector(".controls").classList.toggle("non-trade",screen!=="trade-screen");}

function startMode(spectator){
  controlledTeamId=spectator?null:Number($("setup-team").value);leagueName=$("league-name").value.trim()||"Basketball Universe";$("viewer-team").value=Number($("setup-team").value);applyModeUi();$("setup-screen").classList.add("closed");document.body.classList.remove("menu-open");populateOpponentTeams();populateScoutingTeams();render();saveLeague();
}

document.querySelectorAll(".nav-tab").forEach(b=>b.addEventListener("click",()=>switchScreen(b.dataset.screen)));
document.querySelectorAll(".rank-filter").forEach(b=>b.addEventListener("click",()=>{rankingConference=b.dataset.conference;document.querySelectorAll(".rank-filter").forEach(x=>x.classList.toggle("active",x===b));render();}));
document.querySelectorAll(".standings-filter").forEach(b=>b.addEventListener("click",()=>{standingsConference=b.dataset.conference;document.querySelectorAll(".standings-filter").forEach(x=>x.classList.toggle("active",x===b));render();}));
document.querySelectorAll(".scouting-subtab").forEach(b=>b.addEventListener("click",()=>{document.querySelectorAll(".scouting-subtab").forEach(x=>x.classList.toggle("active",x===b));document.querySelectorAll(".scouting-section").forEach(x=>x.classList.toggle("hidden",x.id!==b.dataset.scoutingSection));}));
$("start-gm").addEventListener("click",()=>startMode(false));$("start-spectator").addEventListener("click",()=>startMode(true));
$("viewer-team").addEventListener("change",()=>{populateOpponentTeams();populateScoutingTeams();render();saveLeague();});$("target-team").addEventListener("change",render);$("scout-team-select").addEventListener("change",render);$("pro-sort").addEventListener("change",render);$("pro-position").addEventListener("change",render);$("draft-sort").addEventListener("change",render);$("draft-position").addEventListener("change",render);$("auto-assign-draft").addEventListener("click",()=>autoAssignDraft(Number($("viewer-team").value)));$("save-league").addEventListener("click",()=>saveLeague(true));$("return-menu").addEventListener("click",returnToMenu);$("sim-day").addEventListener("click",()=>simulateFromUi(1));$("sim-ten").addEventListener("click",()=>simulateFromUi(10));$("commissioner-toggle").addEventListener("click",()=>{commissioner=!commissioner;$("commissioner-toggle").textContent=`Commissioner view: ${commissioner?"on":"off"}`;render();});$("dialog-close").addEventListener("click",()=>$("player-dialog").close());$("player-dialog").addEventListener("click",e=>{if(e.target===$("player-dialog"))$("player-dialog").close();});
$("reminder-auto").addEventListener("click",()=>{$("draft-auto-strategy").value="range";autoAssignDraft(controlledTeamId);$("scouting-reminder").close();});$("reminder-review").addEventListener("click",()=>{$("scouting-reminder").close();switchScreen("scouting-screen");const tab=document.querySelector('[data-scouting-section="players-section"]');tab.click();});$("reminder-manual").addEventListener("click",()=>$("scouting-reminder").close());
init(8242026);switchScreen(activeScreen);
renderSavedLeagues();
