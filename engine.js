export const ATTRIBUTES = [
  ["threePoint","3-Point"],["midrange","Midrange"],["freeThrow","Free Throw"],["finishing","Finishing"],
  ["playmaking","Playmaking"],["ballHandle","Ball Handle"],["perimeterDefense","Perimeter Defense"],
  ["postDefense","Post Defense"],["blocks","Blocks"],["steals","Steals"],["offRebound","Off. Rebounding"],
  ["defRebound","Def. Rebounding"],["speed","Speed"],["strength","Strength"],["stamina","Stamina"],["potential","Potential"]
];

const cities=["Atlanta","Baltimore","Boston","Brooklyn","Charlotte","Chicago","Cincinnati","Cleveland","Dallas","Denver","Detroit","Houston","Indianapolis","Kansas City","Las Vegas","Los Angeles","Louisville","Memphis","Miami","Milwaukee","Minneapolis","Nashville","New Orleans","New York","Orlando","Philadelphia","Phoenix","Portland","San Antonio","Seattle"];
const mascots=["Flight","Forge","Harbor","Kingsmen","Copperheads","Blues","Royals","Rock","Stampede","Summit","Motors","Comets","Racers","Bison","Neon","Stars","Colonels","Sound","Tide","Hounds","Northstars","Rhythm","Krewe","Empire","Solar","Liberty","Firebirds","Pines","Outlaws","Rain"];
const first=["Andre","Cameron","Darius","Eli","Isaiah","Jalen","Jordan","Malik","Marcus","Miles","Noah","Owen","Quentin","Terrance","Tyler","Xavier"];
const last=["Bennett","Brooks","Carter","Daniels","Ellis","Foster","Grant","Hayes","Irving","Johnson","Lewis","Mitchell","Owens","Price","Reed","Simmons","Turner","Walker"];
const positions=["PG","SG","SF","PF","C"];
const colleges=["Carolina State","Great Lakes","Pacific Tech","Blue Ridge","Metro University","Lone Star A&M","Central Ohio","Coastal Florida","Western Nevada","St. Louis College"];
const westernTeamIds=new Set([8,9,11,13,14,15,16,17,20,21,22,26,27,28,29]);
const clamp=(n,min=25,max=99)=>Math.max(min,Math.min(max,Math.round(n)));
export function mulberry32(seed){return()=>{let t=seed+=0x6D2B79F5;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296;};}
const pick=(a,r)=>a[Math.floor(r()*a.length)];
const normal=r=>Math.sqrt(-2*Math.log(Math.max(r(),1e-9)))*Math.cos(2*Math.PI*r());

function makePlayer(id,teamId,r){
  const pos=positions[id%5], age=19+Math.floor(r()*17), base=58+r()*28;
  const mod={PG:{ballHandle:9,playmaking:10,speed:8,postDefense:-15,blocks:-18,strength:-8,defRebound:-12,offRebound:-15},SG:{threePoint:7,midrange:5,perimeterDefense:3,blocks:-10,offRebound:-10},SF:{perimeterDefense:5,finishing:4},PF:{strength:8,postDefense:8,defRebound:7,ballHandle:-8,speed:-5},C:{strength:13,postDefense:13,blocks:14,defRebound:13,offRebound:11,ballHandle:-18,threePoint:-8,speed:-12,perimeterDefense:-6}}[pos];
  const ratings={};
  for(const [key] of ATTRIBUTES) ratings[key]=clamp(base+(mod[key]||0)+(r()-.5)*18);
  const player={id,teamId,name:`${pick(first,r)} ${pick(last,r)}`,position:pos,secondary:positions[Math.max(0,Math.min(4,positions.indexOf(pos)+(r()>.5?1:-1)))],age,height:pos==="C"?81+Math.floor(r()*5):pos==="PG"?72+Math.floor(r()*5):76+Math.floor(r()*7),experience:Math.max(0,age-19-Math.floor(r()*3)),ratings};
  // Potential represents a projected peak overall, so it cannot be below current ability.
  const growthRoom=Math.max(0,27-age)*(.45+r()*.65);
  ratings.potential=clamp(Math.max(overall(player),overall(player)+growthRoom+(r()-.5)*5));
  player.college=pick(colleges,r);
  player.draftPick=clamp(Math.round(61-((ratings.potential-55)*1.35)+(r()-.5)*12),1,60);
  player.history=createHistory(player,r);
  player.season={gp:0,minutes:0,points:0,rebounds:0,assists:0,fgm:0,fga:0,threeM:0,threeA:0,performances:[]};
  const value=overall(player);player.contract={years:1+Math.floor(r()*5),salary:+Math.max(1.2,(value-55)*1.05+(r()-.5)*6).toFixed(1)};
  return player;
}

function createHistory(player,r){
  const seasons=[];
  const rookie=player.experience===0;
  const count=rookie?Math.max(1,Math.min(4,player.age-18)):Math.min(4,player.experience);
  const current=overall(player);
  for(let i=count-1;i>=0;i--){
    const yearsAgo=i+1;
    const seasonEnd=2026-yearsAgo+1;
    const isCollege=rookie;
    const age=player.age-yearsAgo;
    const development=age<25?-(yearsAgo*1.8):age>31?yearsAgo*.9:-(yearsAgo*.35);
    const level=clamp(current+development+(r()-.5)*3);
    const games=isCollege?27+Math.floor(r()*9):52+Math.floor(r()*31);
    const mpg=isCollege?Math.min(37,21+(level-60)*.42+r()*4):Math.min(38,8+(level-55)*.58+r()*4);
    const usage=.17+(level-60)/180+(player.position==="PG"||player.position==="SG"?.025:0);
    const ppg=Math.max(2,mpg*usage*(1.75+r()*.16));
    const rebounds=mpg*((player.ratings.offRebound+player.ratings.defRebound)/2)/430*(player.position==="C"?1.35:player.position==="PF"?1.15:.78);
    const assists=mpg*(player.ratings.playmaking/99)*(player.position==="PG"?.245:player.position==="SG"?.16:.105);
    const fg=Math.min(.66,.31+(player.ratings.finishing+player.ratings.midrange)/800+(r()-.5)*.025);
    const three=Math.min(.48,.22+player.ratings.threePoint/650+(r()-.5)*.035);
    seasons.push({season:`${seasonEnd-1}-${String(seasonEnd).slice(-2)}`,level:isCollege?"College":"Pro",team:isCollege?player.college:null,age,games,mpg:+mpg.toFixed(1),ppg:+ppg.toFixed(1),rpg:+rebounds.toFixed(1),apg:+assists.toFixed(1),fg:+(fg*100).toFixed(1),three:+(three*100).toFixed(1),performanceOvr:level});
  }
  return seasons;
}

export function createLeague(seed=Date.now(),simulationSeedOverride=null){
  const r=mulberry32(seed>>>0);
  const teams=cities.map((city,id)=>({id,name:`${city} ${mascots[id]}`,conference:westernTeamIds.has(id)?"West":"East",wins:0,losses:0,pointsFor:0,pointsAgainst:0,scoutingTargets:{},proScout:45+Math.floor(r()*51),collegeScout:45+Math.floor(r()*51),analytics:45+Math.floor(r()*51),potentialEval:45+Math.floor(r()*51),risk:r()>.5?"Aggressive":"Cautious",philosophy:pick(["Build through the draft","Prioritize two-way players","Value shooting and spacing","Protect long-term flexibility","Pursue proven veterans"],r)}));
  const players=[];let id=0; for(const team of teams) for(let n=0;n<15;n++) players.push(makePlayer(id++,team.id,r));
  const prospects=[];for(let n=0;n<60;n++)prospects.push(makeProspect(1000+n,r));
  const randomRun=simulationSeedOverride??(globalThis.crypto?.getRandomValues?globalThis.crypto.getRandomValues(new Uint32Array(1))[0]:((Date.now()^Math.floor(Math.random()*0xffffffff))>>>0));
  const seasonR=mulberry32(randomRun>>>0);
  // Each new run gets a temporary chemistry/health environment independent of roster generation.
  // This prevents the same roster seed from collapsing toward the same record every season.
  for(const team of teams)team.seasonModifier=Math.max(-8,Math.min(8,normal(seasonR)*4));
  const league={seed,simulationSeed:randomRun,userTeamId:null,seasonYear:2026,phase:"Regular Season",teams,players,prospects,day:0,schedule:createSchedule(),results:[],postseason:null,preseasonRankingsByViewer:{},powerRankingSnapshotsByViewer:{}};
  for(const team of teams){team.declaredDirection=evaluateTeamDirection(league,team.id);team.manualDirection=false;}
  for(const viewer of teams){
    const ids=calculatePowerRankings(league,viewer.id,"All",true).map(x=>x.team.id);
    league.preseasonRankingsByViewer[viewer.id]=ids;
    league.powerRankingSnapshotsByViewer[viewer.id]={day:0,ids:[...ids]};
  }
  return league;
}

function makeProspect(id,r){
  const p=makePlayer(id,null,r);p.age=18+Math.floor(r()*5);p.experience=0;p.teamId=null;
  const growth=Math.max(3,(23-p.age)*(.8+r()*.8));p.ratings.potential=clamp(Math.max(overall(p),overall(p)+growth));p.history=[];p.collegeSeason=emptyStatLine();p.draftPick=clamp(Math.round(61-((p.ratings.potential-55)*1.35)+(r()-.5)*14),1,60);p.season={...emptyStatLine(),performances:[]};return p;
}

function emptyStatLine(){return {gp:0,minutes:0,points:0,rebounds:0,assists:0,fgm:0,fga:0,threeM:0,threeA:0};}

export const TEAM_DIRECTIONS=["Contending","Playoff push","Evaluating","Rebuilding"];

export function evaluateTeamDirection(league,teamId){
  const team=league.teams[teamId],roster=league.players.filter(p=>p.teamId===teamId).sort((a,b)=>overall(b)-overall(a)),top3=average(roster.slice(0,3),overall),depth=average(roster.slice(3,8),overall),games=team.wins+team.losses,winPct=games?team.wins/games:null;
  if(games>=12){
    if(winPct>=.58&&top3>=80)return "Contending";
    if(winPct>=.44)return "Playoff push";
    if(winPct<.34&&games>=15)return "Rebuilding";
    return "Evaluating";
  }
  if(top3>=86&&depth>=72)return "Contending";
  if(top3>=81&&depth>=68)return "Playoff push";
  return roster.filter(p=>p.age<=24&&p.ratings.potential>=82).length>=3?"Rebuilding":"Evaluating";
}

export function setDeclaredDirection(league,teamId,direction,manual=true){const team=league.teams[teamId];if(!TEAM_DIRECTIONS.includes(direction))return;team.declaredDirection=direction;team.manualDirection=manual;}

function updateAiDirections(league){for(const team of league.teams){if(team.id!==league.userTeamId&&!team.manualDirection)team.declaredDirection=evaluateTeamDirection(league,team.id);}}

function refreshPowerRankingSnapshots(league){for(const viewer of league.teams)league.powerRankingSnapshotsByViewer[viewer.id]={day:league.day,ids:calculatePowerRankings(league,viewer.id,"All",false).map(x=>x.team.id)};}

function createSchedule(){
  const days=[];
  for(let day=0;day<82;day++){
    const round=day%29,cycle=Math.floor(day/29),rotation=[0,...Array.from({length:29},(_,i)=>1+((i+round)%29))],games=[];
    for(let i=0;i<15;i++){
      const a=rotation[i],b=rotation[29-i],flip=(day+i+cycle)%2===0;
      games.push({homeId:flip?a:b,awayId:flip?b:a});
    }
    days.push(games);
  }
  return days;
}

export function overall(player){
  const r=player.ratings,p=player.position;
  const weights=p==="PG"?["playmaking","ballHandle","speed","threePoint","perimeterDefense"]:p==="C"?["postDefense","blocks","defRebound","finishing","strength"]:["threePoint","finishing","perimeterDefense","speed","playmaking"];
  return clamp(weights.reduce((s,k)=>s+r[k],0)/weights.length);
}

function rotationFor(league,teamId){
  const roster=league.players.filter(p=>p.teamId===teamId).sort((a,b)=>overall(b)-overall(a)).slice(0,10);
  const minuteSlots=[35,34,33,32,30,24,20,16,10,6];
  return roster.map((p,i)=>({player:p,minutes:minuteSlots[i]}));
}

function teamMetrics(rotation){
  const weighted=(keys)=>rotation.reduce((sum,x)=>sum+x.minutes*keys.reduce((s,k)=>s+x.player.ratings[k],0)/keys.length,0)/240;
  return {offense:weighted(["threePoint","midrange","finishing","playmaking"]),defense:weighted(["perimeterDefense","postDefense","blocks","steals"]),pace:96+(weighted(["speed","stamina"])-65)*.18};
}

function distributeInteger(total,weights){
  const sum=weights.reduce((a,b)=>a+b,0),raw=weights.map(w=>total*w/sum),out=raw.map(Math.floor);let left=total-out.reduce((a,b)=>a+b,0);
  raw.map((n,i)=>({i,f:n-Math.floor(n)})).sort((a,b)=>b.f-a.f).slice(0,left).forEach(x=>out[x.i]++);return out;
}

function updatePlayers(rotation,teamPoints,r,won){
  const scoringWeights=rotation.map(x=>x.minutes*Math.max(20,(x.player.ratings.finishing+x.player.ratings.threePoint+x.player.ratings.midrange)/3-35)*(1+x.player.ratings.playmaking/260));
  const points=distributeInteger(teamPoints,scoringWeights);
  return rotation.map((x,i)=>{
    const p=x.player,threeShare=Math.max(.08,Math.min(.62,p.ratings.threePoint/(p.ratings.threePoint+p.ratings.finishing+25))),threeA=Math.max(0,Math.round(points[i]*threeShare/(.85+threeShare*.2))),threePct=Math.max(.2,Math.min(.49,.20+p.ratings.threePoint/620+normal(r)*.025)),threeM=Math.min(threeA,Math.round(threeA*threePct)),twoPoints=Math.max(0,points[i]-threeM*3),twoM=Math.round(twoPoints/2),twoPct=Math.max(.34,Math.min(.72,.34+(p.ratings.finishing+p.ratings.midrange)/850+normal(r)*.025)),twoA=Math.max(twoM,Math.round(twoM/twoPct)),fgm=threeM+twoM,fga=threeA+twoA;
    const reb=Math.max(0,Math.round(x.minutes*(p.ratings.offRebound+p.ratings.defRebound)/2/330*(p.position==="C"?1.35:p.position==="PF"?1.12:.72)+normal(r)*1.2));
    const ast=Math.max(0,Math.round(x.minutes*p.ratings.playmaking/99*(p.position==="PG"?.19:p.position==="SG"?.13:.08)+normal(r)));
    const statBoost=(points[i]-x.minutes*.42)*.20+(reb-4)*.16+(ast-3)*.18+(won?1:0);
    const performance=clamp(overall(p)+normal(r)*4.5+statBoost,40,99);
    Object.assign(p.season,{gp:p.season.gp+1,minutes:p.season.minutes+x.minutes,points:p.season.points+points[i],rebounds:p.season.rebounds+reb,assists:p.season.assists+ast,fgm:p.season.fgm+fgm,fga:p.season.fga+fga,threeM:p.season.threeM+threeM,threeA:p.season.threeA+threeA});
    p.season.performances.push(performance);
    return {playerId:p.id,minutes:x.minutes,points:points[i],rebounds:reb,assists:ast,performance};
  });
}

export function simulateGame(league,game){
  const gameIndex=league.results.length,r=mulberry32((league.simulationSeed+gameIndex*7919+league.day*104729)>>>0),homeRotation=rotationFor(league,game.homeId),awayRotation=rotationFor(league,game.awayId),homeM=teamMetrics(homeRotation),awayM=teamMetrics(awayRotation);
  const home=league.teams[game.homeId],away=league.teams[game.awayId];
  let homeScore=Math.round(109+(homeM.offense-awayM.defense)*.42+(home.seasonModifier-away.seasonModifier)+(homeM.pace-100)*.12+2.2+normal(r)*8),awayScore=Math.round(109+(awayM.offense-homeM.defense)*.42+(away.seasonModifier-home.seasonModifier)+(awayM.pace-100)*.12+normal(r)*8);
  homeScore=Math.max(78,homeScore);awayScore=Math.max(78,awayScore);if(homeScore===awayScore)homeScore+=5+Math.floor(r()*8);
  const homeWon=homeScore>awayScore;home.wins+=homeWon?1:0;home.losses+=homeWon?0:1;away.wins+=homeWon?0:1;away.losses+=homeWon?1:0;home.pointsFor+=homeScore;home.pointsAgainst+=awayScore;away.pointsFor+=awayScore;away.pointsAgainst+=homeScore;
  const result={day:league.day+1,homeId:home.id,awayId:away.id,homeScore,awayScore,homeBox:updatePlayers(homeRotation,homeScore,r,homeWon),awayBox:updatePlayers(awayRotation,awayScore,r,!homeWon)};league.results.push(result);return result;
}

export function simulateNextDay(league){
  if(league.day>=league.schedule.length)return [];
  const results=league.schedule[league.day].map(game=>simulateGame(league,game));simulateCollegeDate(league);league.day++;updateAiDirections(league);if(league.day%7===0)refreshPowerRankingSnapshots(league);return results;
}

function simulateCollegeDate(league){
  // Thirty-three college dates are spread across the 82-date pro schedule.
  if((league.day*33)%82>=33)return;
  for(const p of league.prospects){
    const s=p.collegeSeason||(p.collegeSeason=emptyStatLine()),r=mulberry32((league.simulationSeed+p.id*1543+league.day*7919)>>>0),talent=overall(p);
    const minutes=clamp(Math.round(25+(talent-65)*.22+normal(r)*2),18,38);
    const points=Math.max(2,Math.round(minutes*(.35+(p.ratings.finishing+p.ratings.threePoint+p.ratings.midrange)/1050)+normal(r)*3.2));
    const rebounds=Math.max(0,Math.round(minutes*(p.ratings.offRebound+p.ratings.defRebound)/520+normal(r)*1.7));
    const assists=Math.max(0,Math.round(minutes*(p.ratings.playmaking+p.ratings.ballHandle)/760+normal(r)*1.2));
    const fga=Math.max(3,Math.round(points*.72+3+r()*3)),fgm=Math.min(fga,Math.max(1,Math.round(fga*(.39+(talent-60)/250+normal(r)*.025))));
    const threeA=Math.min(fga,Math.max(0,Math.round(minutes*(.08+p.ratings.threePoint/650)))),threeM=Math.min(threeA,Math.max(0,Math.round(threeA*(.25+p.ratings.threePoint/700+normal(r)*.025))));
    Object.assign(s,{gp:s.gp+1,minutes:s.minutes+minutes,points:s.points+points,rebounds:s.rebounds+rebounds,assists:s.assists+assists,fgm:s.fgm+fgm,fga:s.fga+fga,threeM:s.threeM+threeM,threeA:s.threeA+threeA});
  }
}

export function gameDate(dayIndex){const d=new Date(Date.UTC(2026,9,20+dayIndex*2));return d.toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric",timeZone:"UTC"});}

export function simulateDays(league,count){const results=[];for(let i=0;i<count&&league.day<league.schedule.length;i++)results.push(...simulateNextDay(league));return results;}

function seededConference(league,conference){return league.teams.filter(t=>t.conference===conference).sort((a,b)=>(b.wins-a.wins)||((b.pointsFor-b.pointsAgainst)-(a.pointsFor-a.pointsAgainst))).map((team,i)=>({seed:i+1,teamId:team.id}));}
function playoffStrength(league,teamId){const roster=league.players.filter(p=>p.teamId===teamId).sort((a,b)=>overall(b)-overall(a)).slice(0,8);return average(roster,overall)+league.teams[teamId].seasonModifier*.3;}
function decideSeries(league,a,b,bestOf=7){const r=mulberry32((league.simulationSeed+a.teamId*4099+b.teamId*6151+(league.postseason?.round||0)*7919)>>>0),sa=playoffStrength(league,a.teamId),sb=playoffStrength(league,b.teamId),need=Math.ceil(bestOf/2);let aw=0,bw=0;while(aw<need&&bw<need){const chance=Math.max(.22,Math.min(.78,.5+(sa-sb)/45));if(r()<chance)aw++;else bw++;}const winner=aw>bw?a:b;return {a,b,aWins:aw,bWins:bw,winner};}
function playIn(league,seeds){const sevenEight=decideSeries(league,seeds[6],seeds[7],1),nineTen=decideSeries(league,seeds[8],seeds[9],1),last=decideSeries(league,sevenEight.winner.teamId===seeds[6].teamId?seeds[7]:seeds[6],nineTen.winner,1);return {games:[sevenEight,nineTen,last],seven:{...sevenEight.winner,seed:7},eight:{...last.winner,seed:8}};}
function roundSeries(league,seeds){return [[seeds[0],seeds[7]],[seeds[3],seeds[4]],[seeds[2],seeds[5]],[seeds[1],seeds[6]]].map(([a,b])=>decideSeries(league,a,b));}
export function advancePostseason(league){
  if(league.day<82)return null;
  if(!league.postseason){const east=seededConference(league,"East"),west=seededConference(league,"West"),epi=playIn(league,east),wpi=playIn(league,west);league.postseason={stage:"First Round",round:1,playIn:{East:epi,West:wpi},current:{East:roundSeries(league,[...east.slice(0,6),epi.seven,epi.eight]),West:roundSeries(league,[...west.slice(0,6),wpi.seven,wpi.eight])},completed:[]};league.phase="Postseason";return league.postseason;}
  const p=league.postseason;p.completed.push({stage:p.stage,series:p.current});p.round++;
  if(p.stage==="First Round"){p.stage="Conference Semifinals";p.current={East:[decideSeries(league,p.current.East[0].winner,p.current.East[1].winner),decideSeries(league,p.current.East[2].winner,p.current.East[3].winner)],West:[decideSeries(league,p.current.West[0].winner,p.current.West[1].winner),decideSeries(league,p.current.West[2].winner,p.current.West[3].winner)]};}
  else if(p.stage==="Conference Semifinals"){p.stage="Conference Finals";p.current={East:[decideSeries(league,p.current.East[0].winner,p.current.East[1].winner)],West:[decideSeries(league,p.current.West[0].winner,p.current.West[1].winner)]};}
  else if(p.stage==="Conference Finals"){p.stage="Finals";p.current={Finals:[decideSeries(league,p.current.East[0].winner,p.current.West[0].winner)]};}
  else if(p.stage==="Finals"){p.stage="Season Complete";p.champion=p.current.Finals[0].winner.teamId;p.current={};league.phase="Offseason";}
  return p;
}

export function performanceSummary(player){
  const s=player.season,recent=s.performances.slice(-10),avg=a=>a.length?Math.round(a.reduce((x,y)=>x+y,0)/a.length):null,currentForm=avg(recent),seasonImpact=avg(s.performances),historicalPeak=Math.max(...player.history.map(h=>h.performanceOvr||overall(player)),overall(player));
  let trajectory=player.age<=23?"Developing":player.age<=29?"Prime / stable":"Veteran / stable";
  if(player.age>=30&&currentForm!==null&&currentForm<overall(player)-4)trajectory="Possible decline";else if(player.age<=25&&currentForm!==null&&currentForm>overall(player)+3)trajectory="Trending upward";
  return {currentForm,seasonImpact,careerPeak:historicalPeak,trajectory};
}

export function seasonAverages(player){const s=player.season,d=Math.max(1,s.gp);return {gp:s.gp,mpg:+(s.minutes/d).toFixed(1),ppg:+(s.points/d).toFixed(1),rpg:+(s.rebounds/d).toFixed(1),apg:+(s.assists/d).toFixed(1),fg:s.fga?+(s.fgm/s.fga*100).toFixed(1):0,three:s.threeA?+(s.threeM/s.threeA*100).toFixed(1):0};}
export function collegeAverages(player){const s=player.collegeSeason||emptyStatLine(),d=Math.max(1,s.gp);return {gp:s.gp,mpg:+(s.minutes/d).toFixed(1),ppg:+(s.points/d).toFixed(1),rpg:+(s.rebounds/d).toFixed(1),apg:+(s.assists/d).toFixed(1),fg:s.fga?+(s.fgm/s.fga*100).toFixed(1):0,three:s.threeA?+(s.threeM/s.threeA*100).toFixed(1):0};}

function calculatePowerRankings(league,viewerId,conference="All",preseason=false){
  const pool=conference==="All"?league.teams:league.teams.filter(t=>t.conference===conference);
  const rows=pool.map(team=>{
    const roster=league.players.filter(p=>p.teamId===team.id).map(p=>({p,r:scoutingReport(league,viewerId,p)})).sort((a,b)=>b.r.perceived-a.r.perceived).slice(0,8);
    const talent=average(roster,x=>x.r.perceived),games=team.wins+team.losses,winPct=games?team.wins/games:.5,net=games?(team.pointsFor-team.pointsAgainst)/games:0;
    const recentGames=league.results.filter(g=>g.homeId===team.id||g.awayId===team.id).slice(-10),recentPct=recentGames.length?recentGames.filter(g=>(g.homeId===team.id&&g.homeScore>g.awayScore)||(g.awayId===team.id&&g.awayScore>g.homeScore)).length/recentGames.length:.5;
    const score=preseason||!games?talent:talent*.42+winPct*100*.33+recentPct*100*.15+Math.max(40,Math.min(95,70+net*2))*.10;
    return {team,talent,score,winPct,net,recentPct};
  }).sort((a,b)=>b.score-a.score);
  const allPreseason=league.preseasonRankingsByViewer?.[viewerId],preseasonList=conference==="All"?allPreseason:allPreseason?.filter(id=>league.teams[id].conference===conference);
  return rows.map((x,i)=>({...x,rank:i+1,preseasonRank:preseasonList?.indexOf(x.team.id)+1||null}));
}

export function powerRankings(league,viewerId,conference="All",preseason=false){
  if(preseason)return calculatePowerRankings(league,viewerId,conference,true);
  const calculated=calculatePowerRankings(league,viewerId,"All",false),byId=new Map(calculated.map(x=>[x.team.id,x]));
  const snapshot=league.powerRankingSnapshotsByViewer?.[viewerId]||{day:0,ids:league.preseasonRankingsByViewer[viewerId]};
  const ids=conference==="All"?snapshot.ids:snapshot.ids.filter(id=>league.teams[id].conference===conference);
  const preseasonIds=conference==="All"?league.preseasonRankingsByViewer[viewerId]:league.preseasonRankingsByViewer[viewerId].filter(id=>league.teams[id].conference===conference);
  return ids.map((id,i)=>({...byId.get(id),rank:i+1,preseasonRank:preseasonIds.indexOf(id)+1,snapshotDay:snapshot.day}));
}

export function scoutingReport(league,viewerId,player){
  const viewer=league.teams[viewerId],isProspect=player.teamId===null,own=viewerId===player.teamId;
  const seasonEvidence=Math.min(16,player.season.gp*.4);
  const targetStart=viewer.scoutingTargets?.[player.id],targetDays=targetStart===undefined?0:Math.max(0,league.day-targetStart+1),targetBonus=Math.min(14,targetDays*1.15);
  const collegeEvidence=isProspect?Math.min(12,collegeAverages(player).gp*.4):0;
  const familiarity=own?Math.min(98,94+player.season.gp*.08):Math.min(97,50+player.experience*4+Math.abs(overall(player)-72)*.25+seasonEvidence+targetBonus+collegeEvidence);
  const skill=isProspect?(viewer.collegeScout*.72+viewer.analytics*.13+viewer.potentialEval*.15):(viewer.proScout*.72+viewer.analytics*.18+viewer.potentialEval*.10);
  const confidence=clamp((familiarity+skill)/2,35,98);
  const estimates={};
  for(const [key] of ATTRIBUTES){
    const potentialPenalty=key==="potential"?(isProspect?16:11):0;
    const observationReduction=key==="potential"?Math.floor(player.season.gp/35):Math.floor(player.season.gp/20);
    const width=Math.max(1,Math.round((105-confidence)/7+potentialPenalty*(1-viewer.potentialEval/130))-observationReduction);
    const noiseR=mulberry32((league.seed+viewerId*10007+player.id*313+(key.length*97))>>>0);
    const center=clamp(player.ratings[key]+(noiseR()-.5)*width*1.5);
    estimates[key]={low:clamp(center-width),high:clamp(center+width),true:player.ratings[key]};
  }
  const mid=k=>(estimates[k].low+estimates[k].high)/2;
  const weights=player.position==="PG"?["playmaking","ballHandle","speed","threePoint","perimeterDefense"]:player.position==="C"?["postDefense","blocks","defRebound","finishing","strength"]:["threePoint","finishing","perimeterDefense","speed","playmaking"];
  const perceivedOverall=clamp(weights.reduce((s,k)=>s+mid(k),0)/weights.length);
  const overallLow=clamp(weights.reduce((s,k)=>s+estimates[k].low,0)/weights.length);
  const overallHigh=clamp(weights.reduce((s,k)=>s+estimates[k].high,0)/weights.length);
  estimates.potential.low=Math.max(estimates.potential.low,perceivedOverall);
  estimates.potential.high=Math.max(estimates.potential.high,estimates.potential.low);
  const perceivedPotential=mid("potential");
  const upside=Math.max(0,perceivedPotential-perceivedOverall);
  const marketScore=perceivedOverall+(player.age<=23?upside*.55:upside*.2);
  const marketTier=marketScore>=90?"Franchise asset":marketScore>=84?"Premium asset":marketScore>=78?"High-value starter":marketScore>=70?"Rotation value":"Developmental";
  return {confidence,estimates,perceived:perceivedOverall,overallLow,overallHigh,perceivedPotential,marketScore,marketTier,own,isProspect,targeted:targetStart!==undefined,targetDays};
}

export function setScoutingTarget(league,viewerId,playerId,target=true){const targets=league.teams[viewerId].scoutingTargets;if(target)targets[playerId]=league.day;else delete targets[playerId];}

const average=(items,fn)=>items.length?items.reduce((s,x)=>s+fn(x),0)/items.length:0;
const midpoint=(report,key)=>(report.estimates[key].low+report.estimates[key].high)/2;

export function playerScoutExplanation(report,player,viewer){
  const labels=Object.fromEntries(ATTRIBUTES);
  const keys=ATTRIBUTES.slice(0,-1).map(([key])=>key);
  const ranked=[...keys].sort((a,b)=>midpoint(report,b)-midpoint(report,a));
  const strengths=ranked.slice(0,3).map(k=>labels[k]);
  const concerns=ranked.slice(-2).reverse().map(k=>labels[k]);
  const upside=report.perceivedPotential-report.perceived;
  const role=report.perceived>=90?"franchise-level centerpiece":report.perceived>=84?"high-end starter":report.perceived>=77?"quality starter":report.perceived>=69?"rotation player":"developmental player";
  const projection=player.age<=25&&upside>=8?`Projects as a ${role} with meaningful remaining upside.`:player.age<=23?`Projects as a ${role}; scouts see moderate development remaining.`:`Projects as a ${role} who is likely near his current level.`;
  const latest=player.history.at(-1),firstSeason=player.history[0],college=collegeAverages(player);
  let productionEvidence="No recorded competitive history is available.";
  if(report.isProspect&&college.gp>0){
    productionEvidence=`Through ${college.gp} college games at ${player.college}, he is averaging ${college.ppg} PPG, ${college.rpg} RPG and ${college.apg} APG. His listed draft slot is a projection, not a completed selection.`;
  }else if(report.isProspect){
    productionEvidence="He has not played a college game in the current evaluation period. This preseason report is based on background information, measurements and projection—not current college production.";
  }else if(player.season.gp>0){
    const s=seasonAverages(player),form=performanceSummary(player);
    productionEvidence=`Through ${s.gp} games this season, he is averaging ${s.ppg} PPG, ${s.rpg} RPG and ${s.apg} APG while playing like a ${form.currentForm}-level player over his last ${Math.min(10,s.gp)} games.`;
  }else if(latest){
    const trend=player.history.length>1?latest.ppg-firstSeason.ppg:0;
    const trendText=trend>=2?` Scoring increased ${trend.toFixed(1)} points across the available sample.`:trend<=-2?` Scoring declined ${Math.abs(trend).toFixed(1)} points across the available sample.`:" Production has remained relatively stable.";
    productionEvidence=latest.level==="College"?`Selected No. ${player.draftPick} after producing ${latest.ppg} PPG, ${latest.rpg} RPG and ${latest.apg} APG in ${latest.games} games at ${latest.team}.${trendText}`:`Last season he produced ${latest.ppg} PPG, ${latest.rpg} RPG and ${latest.apg} APG across ${latest.games} games.${trendText}`;
  }
  const evidence=report.own?`${productionEvidence} Daily practices, coaching access and role data further strengthen the evaluation.`:report.confidence>=80?`${productionEvidence} Heavy game exposure and strong staff consensus make the outside evaluation relatively reliable.`:report.confidence>=65?`${productionEvidence} Film and production support the report, but some traits remain uncertain.`:`${productionEvidence} The scouting department still sees a wide margin for error in translating that evidence.`;
  let staffNote;
  if(report.own){
    staffNote=player.experience>=4?`${player.experience} professional seasons plus daily coaching access make his current-ability evaluation highly reliable. Age-related decline and durability remain the primary unknowns.`:"Daily coaching, practice and role access make this evaluation more reliable than an outside scouting report.";
  }else{
    const staffRating=report.isProspect?viewer.collegeScout:viewer.proScout,department=report.isProspect?"college":"professional";
    staffNote=staffRating>=85?`This organization has an elite ${department} scouting department.`:staffRating<60?`${department[0].toUpperCase()+department.slice(1)} scouting quality is a meaningful risk in this projection.`:`${department[0].toUpperCase()+department.slice(1)} scouting quality is approximately league average.`;
  }
  return {strengths,concerns,role,projection,evidence,staffNote};
}

export function teamScoutingReport(league,viewerId,targetId){
  const viewer=league.teams[viewerId],team=league.teams[targetId];
  const roster=league.players.filter(p=>p.teamId===targetId).map(p=>({p,report:scoutingReport(league,viewerId,p)}));
  const sorted=[...roster].sort((a,b)=>b.report.perceived-a.report.perceived);
  const top3=sorted.slice(0,3),top8=sorted.slice(0,8);
  const youngCore=roster.filter(x=>x.p.age<=24&&x.report.perceivedPotential>=82).length;
  const elite=top3[0]?.report.perceived||0;
  const topTalent=average(top3,x=>x.report.perceived);
  const depth=average(top8.slice(3),x=>x.report.perceived);
  const avgAge=average(top8,x=>x.p.age);
  const direction=team.declaredDirection||evaluateTeamDirection(league,targetId);
  const competitiveAssessment=evaluateTeamDirection(league,targetId);

  const guards=roster.filter(x=>x.p.position==="PG"||x.p.position==="SG");
  const bigs=roster.filter(x=>x.p.position==="PF"||x.p.position==="C");
  const transition=average(guards,x=>(midpoint(x.report,"speed")+midpoint(x.report,"finishing")+midpoint(x.report,"playmaking"))/3);
  const spacing=average(top8,x=>midpoint(x.report,"threePoint"));
  const interior=average(bigs,x=>(midpoint(x.report,"finishing")+midpoint(x.report,"strength")+midpoint(x.report,"postDefense"))/3);
  const perimeterD=average(top8,x=>midpoint(x.report,"perimeterDefense"));
  let style="Balanced attack";
  if(transition>=82) style="Push in transition";
  else if(spacing>=80) style="Pace-and-space offense";
  else if(interior>=82) style="Inside-out basketball";
  else if(perimeterD>=80) style="Defense-first half court";

  const star=top3[0];
  const starUpside=star?star.report.perceivedPotential-star.report.perceived:0;
  const cornerstone=star&&(star.report.perceived>=88||(star.p.age<=24&&star.report.perceived>=83&&star.report.perceivedPotential>=89))?star:null;
  const positionBest={};for(const x of roster){if(!positionBest[x.p.position]||x.report.perceived>positionBest[x.p.position])positionBest[x.p.position]=x.report.perceived;}
  const weakest=positions.map(p=>[p,positionBest[p]||0]).sort((a,b)=>a[1]-b[1])[0][0];
  const needs=[];if(spacing<74)needs.push("shooting");if(perimeterD<72)needs.push("point-of-attack defense");if(interior<72)needs.push("interior size");needs.push(`${weakest} talent`);
  const games=team.wins+team.losses,winPct=games?team.wins/games:null,rank=[...league.teams].sort((a,b)=>(b.wins/(b.wins+b.losses||1))-(a.wins/(a.wins+a.losses||1))).findIndex(t=>t.id===team.id)+1;
  const declaredSignal=direction==="Rebuilding"?"Publicly open to discussing veterans and deals that return youth or draft value.":direction==="Contending"?"Publicly seeking upgrades and unlikely to move core players for future value.":direction==="Playoff push"?"Publicly seeking help without fully sacrificing the future.":"Publicly evaluating both buying and selling opportunities.";
  let credibility="The declaration is broadly consistent with the available evidence.";
  if(games>=12&&direction==="Contending"&&winPct<.42)credibility=`The declared direction conflicts with a ${team.wins}-${team.losses} record and #${rank} league position.`;
  else if(games>=12&&direction==="Rebuilding"&&winPct>.55)credibility=`The rebuilding declaration is unusual for a ${team.wins}-${team.losses} team and may be strategic messaging.`;
  const outlook=games?`Currently ${team.wins}-${team.losses} and ranked #${rank} league-wide. ${credibility}`:direction==="Contending"?"Preseason talent supports a win-now outlook.":direction==="Playoff push"?"Preseason talent suggests a playoff or play-in chase.":direction==="Rebuilding"?"Development and asset accumulation appear more important than immediate wins.":"The opening portion of the season should clarify whether this team buys or sells.";
  const confidence=clamp(average(roster,x=>x.report.confidence));
  return {team:team.name,direction,competitiveAssessment,declaredSignal,style,cornerstone:cornerstone?.p.name||"No clear cornerstone",cornerstoneReason:cornerstone?`${cornerstone.p.name} is viewed as a ${cornerstone.report.perceived}-level ${cornerstone.p.position}${starUpside>=5?" with additional upside":" whose current impact justifies building around him"}.`:"No player currently clears the combination of impact, age and upside needed to shape the roster around him.",needs:[...new Set(needs)].slice(0,3),outlook,confidence,philosophy:team.philosophy};
}

export function inches(n){return `${Math.floor(n/12)}'${n%12}\"`;}
