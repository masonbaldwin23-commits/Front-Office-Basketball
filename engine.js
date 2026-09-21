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
const bound=(n,min,max)=>Math.max(min,Math.min(max,Number(n)||0));
export function mulberry32(seed){return()=>{let t=seed+=0x6D2B79F5;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296;};}
const pick=(a,r)=>a[Math.floor(r()*a.length)];
const normal=r=>Math.sqrt(-2*Math.log(Math.max(r(),1e-9)))*Math.cos(2*Math.PI*r());

export const NBA_FINANCIALS_2026_27=Object.freeze({
  seasonYear:2026,
  salaryCap:164.961,
  minimumTeamSalary:148.465,
  luxuryTax:200.428,
  firstApron:209.015,
  secondApron:221.686,
  expandedTradeAddOn:9.098
});

export const FINANCIAL_RULE_PRESETS=Object.freeze({
  modern:Object.freeze({id:"modern",name:"Modern NBA Rules",shortName:"Modern NBA",apronsActive:true,description:"Current soft cap, luxury tax, first and second aprons, and apron-based trade restrictions."}),
  simplified:Object.freeze({id:"simplified",name:"Simplified Salary Cap",shortName:"Simplified Cap",apronsActive:false,description:"Soft cap and luxury tax without aprons; over-cap trades use one universal 125% salary-matching rule."})
});

export function financialRulePreset(league){return league?.settings?.financialRulesPreset==="simplified"?FINANCIAL_RULE_PRESETS.simplified:FINANCIAL_RULE_PRESETS.modern;}

export const DRAFT_CLASS_PRESETS=Object.freeze({
  weak:Object.freeze({id:"weak",name:"Weak",shortName:"Weak class",description:"Fewer immediate contributors and a lower concentration of star upside.",currentOffset:-2,potentialOffset:-2,potentialCap:92,scoutingCeiling:94}),
  realistic:Object.freeze({id:"realistic",name:"Realistic",shortName:"Realistic class",description:"A grounded NBA-style class with scarce stars, useful rotation prospects and real second-round risk.",currentOffset:0,potentialOffset:0,potentialCap:96,scoutingCeiling:97}),
  strong:Object.freeze({id:"strong",name:"Strong",shortName:"Strong class",description:"More lottery-ready talent and several credible future All-Star outcomes.",currentOffset:2,potentialOffset:3,potentialCap:98,scoutingCeiling:99}),
  historic:Object.freeze({id:"historic",name:"Historic",shortName:"Historic class",description:"A deliberately rare, era-defining class with elite rookies and multiple superstar ceilings.",currentOffset:4,potentialOffset:6,potentialCap:99,scoutingCeiling:99})
});

export function draftClassPreset(league){const id=league?.settings?.draftClassStrength;return DRAFT_CLASS_PRESETS[id]||DRAFT_CLASS_PRESETS.realistic;}

export const OFFENSIVE_SCHEMES=Object.freeze(["Balanced","Pace & Space","Inside-Out","Pick-and-Roll","Transition"]);
export const DEFENSIVE_SCHEMES=Object.freeze(["Balanced","Switching","Drop Coverage","Perimeter Pressure","Zone"]);

export const STAFF_ROLES=Object.freeze(["Head Coach","Player Development Director","Head Scout","Pro Scout","College Scout"]);
const SCOUT_SPECIALTIES=["Guards","Wings","Bigs","Defense","Offense","Potential"];
const COACH_SPECIALTIES=["Motion offense","Defensive structure","Pace and spacing","Half-court execution","Player leadership"];
const DEVELOPMENT_SPECIALTIES=["Young guards","Wings","Bigs","Shooting","Defense"];
const staffFirst=["Adrian","Calvin","Dana","Emmett","Franklin","Grant","Harper","Jesse","Kendall","Morgan","Parker","Reese","Robin","Sidney","Taylor","Wesley"];
const staffLast=["Baxter","Callahan","Delgado","Everett","Fleming","Goodwin","Holloway","Jefferson","Kim","Lawson","Mercer","Nolan","Ortiz","Pierce","Ramsey","Sullivan","Vaughn","Whitaker"];

function staffAttributeBase(r,market=false){return clamp((market?42:48)+r()*(market?35:42),35,96);}
function staffSalary(role,rating){const premium=role==="Head Coach"?2.5:role==="Head Scout"?1.25:role==="Player Development Director"?1.05:.55,multiplier=role==="Head Coach"?.075:role==="Head Scout"?.047:role==="Player Development Director"?.04:.028;return money(premium+Math.max(0,rating-50)*multiplier);}

export function staffOverall(member){
  if(!member)return 0;
  const a=member.attributes||{};
  if(member.role==="Head Coach")return clamp((a.offense*.38+a.defense*.38+a.leadership*.24)||50,25,99);
  if(member.role==="Player Development Director")return clamp((a.development*.68+a.leadership*.20+a.potentialEvaluation*.12)||50,25,99);
  if(member.role==="Head Scout")return clamp((a.proScouting*.22+a.collegeScouting*.22+a.potentialEvaluation*.24+a.scoutingSpeed*.18+a.leadership*.14)||50,25,99);
  if(member.role==="Pro Scout")return clamp((a.proScouting*.56+a.potentialEvaluation*.24+a.scoutingSpeed*.20)||50,25,99);
  return clamp((a.collegeScouting*.56+a.potentialEvaluation*.24+a.scoutingSpeed*.20)||50,25,99);
}

function makeStaffMember(id,role,teamId,r,legacyTeam=null,market=false){
  const anchor=staffAttributeBase(r,market),legacyPro=legacyTeam?.proScout??anchor,legacyCollege=legacyTeam?.collegeScout??anchor,legacyPotential=legacyTeam?.potentialEval??anchor;
  const attributes={
    offense:clamp(anchor+(r()-.5)*16),defense:clamp(anchor+(r()-.5)*16),leadership:clamp(anchor+(r()-.5)*14),development:clamp(anchor+(r()-.5)*15),
    proScouting:clamp(role==="Pro Scout"?legacyPro+(r()-.5)*8:role==="Head Scout"?(legacyPro+legacyCollege)/2+(r()-.5)*8:anchor+(r()-.5)*18),
    collegeScouting:clamp(role==="College Scout"?legacyCollege+(r()-.5)*8:role==="Head Scout"?(legacyPro+legacyCollege)/2+(r()-.5)*8:anchor+(r()-.5)*18),
    potentialEvaluation:clamp(["Head Scout","Pro Scout","College Scout"].includes(role)?legacyPotential+(r()-.5)*9:anchor+(r()-.5)*16),
    scoutingSpeed:clamp(anchor+(r()-.5)*17)
  };
  if(role==="Player Development Director")attributes.development=clamp(anchor+8+(r()-.5)*8);
  const specialties=role==="Head Coach"?COACH_SPECIALTIES:role==="Player Development Director"?DEVELOPMENT_SPECIALTIES:SCOUT_SPECIALTIES,specialty=pick(specialties,r);
  const member={id:`staff-${id}`,name:`${pick(staffFirst,r)} ${pick(staffLast,r)}`,role,teamId,age:31+Math.floor(r()*33),attributes,potential:0,specialty,askingSalary:0,contract:null,developmentChange:0};
  const rating=staffOverall(member);member.potential=clamp(Math.max(rating,rating+3+Math.floor(r()*14)),rating,99);member.askingSalary=staffSalary(role,rating);
  if(teamId!==null){const years=1+Math.floor(r()*4),salary=money(member.askingSalary*(.91+r()*.17));member.contract={salary,yearsRemaining:years,signedYear:2026,expiresAfterSeason:2025+years};}
  return member;
}

export function teamStaff(league,teamId){if(!league.staffSystemVersion)ensureLeagueStaff(league);return STAFF_ROLES.map(role=>league.staff.find(member=>member.teamId===teamId&&member.role===role)).filter(Boolean);}
export function staffMarket(league,role=null){if(!league.staffSystemVersion)ensureLeagueStaff(league);return league.staff.filter(member=>member.teamId===null&&(!role||member.role===role)).sort((a,b)=>staffOverall(b)-staffOverall(a)||a.name.localeCompare(b.name));}
export function teamStaffPayroll(league,teamId){return money(teamStaff(league,teamId).reduce((sum,member)=>sum+(member.contract?.salary||0),0));}
export function teamStaffBudget(league,teamId){if(!league.staffSystemVersion)ensureLeagueStaff(league);return money(league.staffBudgetByTeam?.[teamId]??20);}
export function teamStaffBuyouts(league,teamId){if(!league.staffSystemVersion)ensureLeagueStaff(league);const rows=(league.staffBuyouts||[]).filter(entry=>entry.teamId===teamId&&entry.remainingYears>0);return {total:money(rows.reduce((sum,entry)=>sum+entry.remainingAmount,0)),annual:money(rows.reduce((sum,entry)=>sum+entry.annualAmount,0)),rows};}

function scoutMatchesPlayer(specialty,player){
  if(!specialty||!player)return false;
  if(specialty==="Guards")return ["PG","SG"].includes(player.position);
  if(specialty==="Wings")return player.position==="SF";
  if(specialty==="Bigs")return ["PF","C"].includes(player.position);
  const r=player.ratings||{};
  if(specialty==="Defense")return ((r.perimeterDefense||0)+(r.postDefense||0)+(r.blocks||0)+(r.steals||0))/4>=76;
  if(specialty==="Offense")return ((r.threePoint||0)+(r.midrange||0)+(r.finishing||0)+(r.playmaking||0))/4>=76;
  if(specialty==="Potential")return (r.potential||0)>=84;
  return false;
}

export function scoutingDepartment(league,teamId,player=null){
  if(!league.staffSystemVersion)ensureLeagueStaff(league);const staff=teamStaff(league,teamId),head=staff.find(member=>member.role==="Head Scout"),pro=staff.find(member=>member.role==="Pro Scout"),college=staff.find(member=>member.role==="College Scout"),team=league.teams[teamId]||{};
  const ha=head?.attributes||{},pa=pro?.attributes||{},ca=college?.attributes||{},vacancyBaseline=38,legacyPro=team.proScout||55,legacyCollege=team.collegeScout||55,legacyPotential=team.potentialEval||55,headPro=ha.proScouting??(league.staffSystemVersion?vacancyBaseline:legacyPro),headCollege=ha.collegeScouting??(league.staffSystemVersion?vacancyBaseline:legacyCollege),headPotential=ha.potentialEvaluation??(league.staffSystemVersion?vacancyBaseline:legacyPotential),headSpeed=ha.scoutingSpeed??vacancyBaseline,headLeadership=ha.leadership??vacancyBaseline,proEvaluation=pa.proScouting??(league.staffSystemVersion?vacancyBaseline:legacyPro),proPotential=pa.potentialEvaluation??vacancyBaseline,proScoutSpeed=pa.scoutingSpeed??vacancyBaseline,collegeEvaluation=ca.collegeScouting??(league.staffSystemVersion?vacancyBaseline:legacyCollege),collegePotential=ca.potentialEvaluation??vacancyBaseline,collegeScoutSpeed=ca.scoutingSpeed??vacancyBaseline,proSkill=clamp(headPro*.34+proEvaluation*.56+headLeadership*.10+(scoutMatchesPlayer(pro?.specialty,player)?4:0),35,99),collegeSkill=clamp(headCollege*.34+collegeEvaluation*.56+headLeadership*.10+(scoutMatchesPlayer(college?.specialty,player)?4:0),35,99),potentialEval=clamp(headPotential*.45+proPotential*.20+collegePotential*.35,35,99),proSpeed=clamp((headSpeed+proScoutSpeed)/2+(scoutMatchesPlayer(pro?.specialty,player)?5:0),35,99),collegeSpeed=clamp((headSpeed+collegeScoutSpeed)/2+(scoutMatchesPlayer(college?.specialty,player)?5:0),35,99);
  return {headScout:head,proScout:pro,collegeScout:college,proSkill,collegeSkill,potentialEval,proSpeed,collegeSpeed,proCapacity:Math.max(6,Math.min(12,5+Math.floor((proSkill+proSpeed)/32))),collegeCapacity:Math.max(6,Math.min(12,5+Math.floor((collegeSkill+collegeSpeed)/32))),proSpecialty:pro?.specialty||"General",collegeSpecialty:college?.specialty||"General"};
}

function syncTeamStaffRatings(league,teamId){
  const team=league.teams[teamId];if(!team)return;const department=scoutingDepartment(league,teamId),coach=league.staff.find(member=>member.teamId===teamId&&member.role==="Head Coach"),development=league.staff.find(member=>member.teamId===teamId&&member.role==="Player Development Director");
  team.proScout=department.proSkill;team.collegeScout=department.collegeSkill;team.potentialEval=department.potentialEval;team.analytics=clamp((department.proSkill+department.collegeSkill+department.potentialEval)/3,35,99);team.scoutingSpeed=clamp((department.proSpeed+department.collegeSpeed)/2,35,99);team.coachOffense=coach?.attributes?.offense||50;team.coachDefense=coach?.attributes?.defense||50;team.coachLeadership=coach?.attributes?.leadership||50;team.playerDevelopment=development?.attributes?.development||50;
}

function releaseStaffMember(league,member,{type="Staff fired",buyout=true}={}){
  const teamId=member.teamId,contract=member.contract?{...member.contract}:null;if(teamId===null||teamId===undefined)return null;
  let buyoutEntry=null;if(buyout&&contract?.salary&&contract.yearsRemaining){const remainingYears=Math.max(1,contract.yearsRemaining),annualAmount=money(contract.salary),remainingAmount=money(annualAmount*remainingYears);buyoutEntry={teamId,staffId:member.id,staffName:member.name,role:member.role,seasonYear:league.seasonYear,annualAmount,remainingYears,remainingAmount};league.staffBuyouts.push(buyoutEntry);}
  member.teamId=null;member.contract=null;member.askingSalary=staffSalary(member.role,staffOverall(member));const transaction={seasonYear:league.seasonYear,type,teamId,staffId:member.id,staffName:member.name,role:member.role,buyout:buyoutEntry?.remainingAmount||0};league.staffTransactions.push(transaction);syncTeamStaffRatings(league,teamId);return {transaction,buyout:buyoutEntry};
}

function rebalanceEliteStaffMarket(league,protectedTeamId=league.userTeamId){
  for(const role of STAFF_ROLES){
    let guard=0;while(guard++<12){const candidate=staffMarket(league,role)[0],eligible=league.staff.filter(member=>member.teamId!==null&&member.teamId!==protectedTeamId&&member.role===role).sort((a,b)=>staffOverall(a)-staffOverall(b)),incumbent=eligible[0];if(!candidate||!incumbent||staffOverall(candidate)<86||staffOverall(candidate)<=staffOverall(incumbent)+2)break;
      const teamId=incumbent.teamId;releaseStaffMember(league,incumbent,{type:"Staff market correction",buyout:false});candidate.teamId=teamId;const years=2+((teamId+candidate.age)%3);candidate.contract={salary:candidate.askingSalary,yearsRemaining:years,signedYear:league.seasonYear,expiresAfterSeason:league.seasonYear+years-1};league.staffTransactions.push({seasonYear:league.seasonYear,type:"AI staff hire",teamId,staffId:candidate.id,staffName:candidate.name,role:candidate.role,salary:candidate.contract.salary,years,reason:"Elite staff market correction"});syncTeamStaffRatings(league,teamId);
    }
  }
}

export function ensureLeagueStaff(league){
  const previousVersion=Number(league.staffSystemVersion)||0;league.staff??=[];league.staffTransactions??=[];league.staffBuyouts??=[];league.staffBudgetByTeam??={};let nextId=league.staff.reduce((max,member)=>Math.max(max,Number(String(member.id||"").replace("staff-",""))||0),-1)+1;const r=mulberry32((((league.seed||1)>>>0)^0x6f1a2c9d)>>>0);
  for(const team of league.teams){
    league.staffBudgetByTeam[team.id]??=money(19.5+(team.id%5)*.75);
    if(previousVersion<2)for(const role of STAFF_ROLES)if(!league.staff.some(member=>member.teamId===team.id&&member.role===role))league.staff.push(makeStaffMember(nextId++,role,team.id,r,team));
  }
  for(const role of STAFF_ROLES){const available=league.staff.filter(member=>member.teamId===null&&member.role===role).length;for(let index=available;index<6;index++)league.staff.push(makeStaffMember(nextId++,role,null,r,null,true));}
  for(const member of league.staff){member.attributes??={};member.potential??=staffOverall(member);member.askingSalary??=staffSalary(member.role,staffOverall(member));member.developmentChange??=0;if(member.teamId!==null&&member.contract){member.contract.salary=money(member.contract.salary);member.contract.yearsRemaining=Math.max(1,Number(member.contract.yearsRemaining)||1);member.contract.signedYear??=league.seasonYear;member.contract.expiresAfterSeason=league.seasonYear+member.contract.yearsRemaining-1;}}
  league.staffSystemVersion=2;if(previousVersion<2)rebalanceEliteStaffMarket(league,league.userTeamId);for(const team of league.teams)syncTeamStaffRatings(league,team.id);return league.staff;
}

export function hireStaffMember(league,teamId,staffId,{salary,years}={}){
  ensureLeagueStaff(league);const candidate=league.staff.find(member=>member.id===staffId),team=league.teams[teamId];if(!team||!candidate||candidate.teamId!==null)return {completed:false,reason:"That staff member is no longer available."};
  const offerSalary=money(salary??candidate.askingSalary),offerYears=Math.max(1,Math.min(4,Number(years)||1));if(offerSalary+0.001<candidate.askingSalary*.9)return {completed:false,reason:`${candidate.name} is seeking an offer closer to $${candidate.askingSalary.toFixed(2)}M per year.`};
  const incumbent=league.staff.find(member=>member.teamId===teamId&&member.role===candidate.role),projected=money(teamStaffPayroll(league,teamId)-(incumbent?.contract?.salary||0)+offerSalary),budget=teamStaffBudget(league,teamId);if(projected>budget+.001)return {completed:false,reason:`The projected $${projected.toFixed(2)}M staff payroll exceeds the $${budget.toFixed(2)}M staff budget.`};
  if(incumbent)releaseStaffMember(league,incumbent,{type:"Staff replaced",buyout:true});
  candidate.teamId=teamId;candidate.contract={salary:offerSalary,yearsRemaining:offerYears,signedYear:league.seasonYear,expiresAfterSeason:league.seasonYear+offerYears-1};candidate.askingSalary=offerSalary;
  const transaction={seasonYear:league.seasonYear,type:"Staff hire",teamId,staffId:candidate.id,staffName:candidate.name,role:candidate.role,salary:offerSalary,years:offerYears,replacedStaffId:incumbent?.id||null,replacedStaffName:incumbent?.name||null};league.staffTransactions.push(transaction);syncTeamStaffRatings(league,teamId);return {completed:true,transaction,incumbent};
}

export function fireStaffMember(league,teamId,staffId){
  ensureLeagueStaff(league);const member=league.staff.find(item=>item.id===staffId);if(!member||member.teamId!==teamId)return {completed:false,reason:"That staff member is no longer employed by this organization."};const released=releaseStaffMember(league,member,{type:"Staff fired",buyout:true});return {completed:true,member,transaction:released.transaction,buyout:released.buyout};
}

const money=n=>+Math.max(0,Number(n)||0).toFixed(3);
const signedMoney=n=>+(Number(n)||0).toFixed(3);
const seasonName=year=>`${year}–${String(year+1).slice(-2)}`;

export function financialRulesForSeason(seasonYear=2026){
  const years=Math.max(0,seasonYear-NBA_FINANCIALS_2026_27.seasonYear),growth=Math.pow(1.05,years);
  return Object.fromEntries(Object.entries(NBA_FINANCIALS_2026_27).map(([key,value])=>[key,key==="seasonYear"?seasonYear:money(value*growth)]));
}

function veteranMinimum(experience=0){return money(Math.min(3.3,1.3+Math.max(0,experience)*.18));}
function maxSalaryPercent(experience=0){return experience>=10?.35:experience>=7?.30:.25;}
function estimatedMarketSalary(current,experience=0,cap=NBA_FINANCIALS_2026_27.salaryCap){
  if(current<=66)return veteranMinimum(experience);
  if(current>=88)return money(cap*maxSalaryPercent(experience)*(current>=93?1:.86));
  return money(Math.min(cap*.23,1.3+Math.pow(current-66,1.35)*.48));
}

function finalizeContract(contract,seasonYear){
  contract.salaries=(contract.salaries||[]).map((row,index)=>({seasonYear:row.seasonYear??seasonYear+index,amount:money(row.amount),guaranteed:row.guaranteed!==false,option:row.option||null}));
  contract.years=contract.salaries.length;
  contract.salary=money(contract.salaries[0]?.amount||contract.salary||0);
  contract.totalValue=money(contract.salaries.reduce((sum,row)=>sum+row.amount,0));
  contract.freeAgencyYear=(contract.salaries.at(-1)?.seasonYear??seasonYear)+1;
  contract.freeAgencyType??="Unrestricted free agent";
  contract.originalLength??=contract.years;
  return contract;
}

function contractSchedule(base,years,raise,seasonYear,optionForYear=()=>null,guaranteeForYear=()=>true){
  return Array.from({length:years},(_,index)=>({seasonYear:seasonYear+index,amount:money(base*Math.pow(1+raise,index)),guaranteed:guaranteeForYear(index),option:optionForYear(index)}));
}

function makeContract(player,seasonYear,r,rosterRank=7){
  const current=overall(player),service=player.experience||0,cap=financialRulesForSeason(seasonYear).salaryCap;
  let type,years,base,raise,signedUsing,freeAgencyType="Unrestricted free agent",optionForYear=()=>null,guaranteeForYear=()=>true,originalLength;
  if(service<=3&&player.draftPick<=30){
    type="Rookie Scale Contract";originalLength=4;years=Math.max(1,4-service);base=money((3+(31-player.draftPick)*.37)*Math.pow(1.045,service));raise=.045;signedUsing="Rookie Scale";freeAgencyType="Restricted free agent";
    optionForYear=index=>service+index>=2?(index===0?"Team option (exercised)":"Team option"):null;guaranteeForYear=index=>service+index<2||index===0;
  }else if(service>=4&&service<=6&&current>=86&&rosterRank<=1){
    type="Rookie Max Extension";years=5;originalLength=5;base=money(cap*.25);raise=.08;signedUsing="Bird Rights";
  }else if(service>=7&&service<=9&&current>=93&&rosterRank===0){
    type="Supermax Contract";years=5;originalLength=5;base=money(cap*.35);raise=.08;signedUsing="Designated Veteran / Bird Rights";
  }else if(current>=88&&rosterRank<=1){
    type="Maximum Contract";years=r()>.45?5:4;originalLength=years;base=money(cap*maxSalaryPercent(service));raise=years===5?.08:.05;signedUsing=years===5?"Bird Rights":"Cap Space";
  }else if(current<=66||rosterRank>=13){
    type="Veteran Minimum Contract";years=r()>.7?2:1;originalLength=years;base=veteranMinimum(service);raise=.05;signedUsing="Minimum Salary Exception";
  }else{
    type="Standard Contract";years=1+Math.floor(r()*4);originalLength=years;base=estimatedMarketSalary(current,service,cap);raise=years>=3&&r()>.5?.08:.05;signedUsing=raise===.08?"Bird Rights":"Cap Space";
    if(years>=3&&r()>.72){const option=r()>.45?"Player option":"Team option";optionForYear=index=>index===years-1?option:null;guaranteeForYear=index=>index!==years-1||option==="Player option";}
  }
  const contract={type,signedUsing,originalLength,raisePercent:Math.round(raise*100),freeAgencyType,salaries:contractSchedule(base,years,raise,seasonYear,optionForYear,guaranteeForYear)};
  return finalizeContract(contract,seasonYear);
}

function scaleContract(contract,factor,minimum,maximum=Infinity){
  contract.salaries=contract.salaries.map((row,index)=>({...row,amount:money(Math.min(maximum*Math.pow(1.08,index),Math.max(minimum*Math.pow(1.05,index),row.amount*factor)))}));
  return finalizeContract(contract,contract.salaries[0]?.seasonYear||2026);
}

function balanceTeamPayroll(league,teamId){
  const roster=league.players.filter(player=>player.teamId===teamId),rules=league.financialRules||financialRulesForSeason(league.seasonYear),topEight=[...roster].sort((a,b)=>overall(b)-overall(a)).slice(0,8),strength=topEight.reduce((sum,p)=>sum+overall(p),0)/Math.max(1,topEight.length),eliteSpend=strength>=86?22:strength>=85.7?8:0,target=Math.min(rules.secondApron+4,Math.max(rules.minimumTeamSalary,150+(strength-76)*5.1+((teamId%5)-2)*1.8+eliteSpend));
  const flexible=roster.filter(p=>p.contract.type==="Standard Contract"),fixed=roster.filter(p=>!flexible.includes(p)).reduce((sum,p)=>sum+p.contract.salary,0),flexibleTotal=flexible.reduce((sum,p)=>sum+p.contract.salary,0),factor=flexibleTotal?Math.max(.42,Math.min(2.5,(target-fixed)/flexibleTotal)):1;
  for(const player of flexible)scaleContract(player.contract,factor,veteranMinimum(player.experience),rules.salaryCap*maxSalaryPercent(player.experience)*.95);
}

export function ensureLeagueFinancials(league){
  league.seasonYear??=2026;league.settings??={};league.settings.financialRulesPreset=financialRulePreset(league).id;league.financialRules={...financialRulesForSeason(league.seasonYear)};
  const contractR=mulberry32((((league.seed||1)>>>0)^0x43a91f2d)>>>0),needsMigration=league.players.some(player=>player.teamId!==null&&(!Array.isArray(player.contract?.salaries)||!player.contract.type));
  for(const team of league.teams){
    const roster=league.players.filter(player=>player.teamId===team.id).sort((a,b)=>overall(b)-overall(a));
    roster.forEach((player,rank)=>{
      if(needsMigration||!Array.isArray(player.contract?.salaries)||!player.contract.type)player.contract=makeContract(player,league.seasonYear,contractR,rank);
      else finalizeContract(player.contract,league.seasonYear);
    });
  }
  if(needsMigration)for(const team of league.teams)balanceTeamPayroll(league,team.id);
  league.financialSystemVersion=1;
  return league.financialRules;
}

export function teamPayroll(league,teamId){return teamPayrollForSeason(league,teamId,league.seasonYear??2026);}

export function teamPayrollForSeason(league,teamId,seasonYear,{guaranteedOnly=false}={}){
  const active=league.players.filter(player=>player.teamId===teamId).reduce((sum,player)=>{
    if(player.contract?.isTwoWay)return sum;
    const row=player.contract?.salaries?.find(salary=>salary.seasonYear===seasonYear);
    if(!row||guaranteedOnly&&!row.guaranteed)return sum;
    return sum+row.amount;
  },0);
  return money(active+teamDeadMoney(league,teamId,seasonYear));
}

export function teamDeadMoney(league,teamId,seasonYear=league.seasonYear){return money((league.deadMoney||[]).filter(entry=>entry.teamId===teamId&&entry.seasonYear===seasonYear).reduce((sum,entry)=>sum+entry.amount,0));}

export function teamFinancialOutlook(league,teamId,seasons=5){
  const start=league.seasonYear??2026,roster=league.players.filter(player=>player.teamId===teamId),preset=financialRulePreset(league);
  return Array.from({length:seasons},(_,index)=>{
    const seasonYear=start+index,rules=financialRulesForSeason(seasonYear),payroll=teamPayrollForSeason(league,teamId,seasonYear),guaranteedPayroll=teamPayrollForSeason(league,teamId,seasonYear,{guaranteedOnly:true}),committedPlayers=roster.filter(player=>player.contract?.salaries?.some(row=>row.seasonYear===seasonYear)).length,optionPlayers=roster.filter(player=>player.contract?.salaries?.some(row=>row.seasonYear===seasonYear&&row.option&&!row.option.includes("exercised"))).length,capRoom=signedMoney(rules.salaryCap-payroll),taxRoom=signedMoney(rules.luxuryTax-payroll),firstApronRoom=signedMoney(rules.firstApron-payroll),secondApronRoom=signedMoney(rules.secondApron-payroll),status=preset.apronsActive&&payroll>rules.secondApron?"Above second apron":preset.apronsActive&&payroll>rules.firstApron?"Above first apron":payroll>rules.luxuryTax?"Luxury tax":payroll>rules.salaryCap?"Over the cap":"Cap room";
    return {seasonYear,payroll,guaranteedPayroll,deadMoney:teamDeadMoney(league,teamId,seasonYear),committedPlayers,optionPlayers,capRoom,taxRoom,firstApronRoom,secondApronRoom,status,rulePreset:preset.id,apronsActive:preset.apronsActive,...rules};
  });
}

export function teamCapSheet(league,teamId){
  const rules=league.financialRules||financialRulesForSeason(league.seasonYear),preset=financialRulePreset(league),payroll=teamPayroll(league,teamId),capSpace=money(Math.max(0,rules.salaryCap-payroll)),overCap=money(Math.max(0,payroll-rules.salaryCap)),taxRoom=signedMoney(rules.luxuryTax-payroll),firstApronRoom=signedMoney(rules.firstApron-payroll),secondApronRoom=signedMoney(rules.secondApron-payroll),status=preset.apronsActive&&payroll>rules.secondApron?"Above second apron":preset.apronsActive&&payroll>rules.firstApron?"Above first apron":payroll>rules.luxuryTax?"Luxury tax":payroll>rules.salaryCap?"Over the cap":"Cap room";
  return {teamId,payroll,deadMoney:teamDeadMoney(league,teamId,league.seasonYear),capSpace,overCap,taxRoom,firstApronRoom,secondApronRoom,status,rulePreset:preset.id,apronsActive:preset.apronsActive,...rules};
}

export function ensureLeagueContracts(league){
  league.deadMoney??=[];league.playerTransactions??=[];
  for(const player of league.players){player.contract??=null;if(player.contract)player.contract.isTwoWay=Boolean(player.contract.isTwoWay);}
  league.contractLifecycleVersion=1;return league;
}

export function extensionEligibility(league,teamId,playerId){
  ensureLeagueContracts(league);const player=league.players.find(item=>item.id===Number(playerId));
  if(!player||player.teamId!==teamId)return {eligible:false,reason:"That player is not on this roster."};
  if(player.contract?.isTwoWay)return {eligible:false,reason:"Two-way players must first sign a standard NBA contract."};
  if(!player.contract?.salaries?.length)return {eligible:false,reason:"No active contract is available to extend."};
  const starts=Math.max((league.seasonYear||2026)+1,player.contract.freeAgencyYear||player.contract.salaries.at(-1).seasonYear+1),yearsAway=starts-(league.seasonYear||2026);
  if(yearsAway>2)return {eligible:false,reason:"Extensions open when a contract is within two seasons of expiration."};
  const market=estimatedMarketSalary(overall(player),player.experience,financialRulesForSeason(starts).salaryCap),demand=money(Math.max(veteranMinimum(player.experience),market*(player.age>=32?.88:1))),maxYears=player.experience>=4?5:4;
  return {eligible:true,starts,yearsAway,demand,maxYears,minimum:money(demand*.9),maximum:money(financialRulesForSeason(starts).salaryCap*maxSalaryPercent(player.experience))};
}

export function extendPlayer(league,teamId,playerId,{salary,years}={}){
  const read=extensionEligibility(league,teamId,playerId);if(!read.eligible)return {completed:false,reason:read.reason};const player=league.players.find(item=>item.id===Number(playerId)),annual=money(salary),term=Math.max(1,Math.min(read.maxYears,Number(years)||1));
  if(annual+0.001<read.minimum)return {completed:false,reason:`${player.name} is seeking at least $${read.minimum.toFixed(3)}M annually.`};
  if(annual>read.maximum+.001)return {completed:false,reason:`The maximum first-year salary is $${read.maximum.toFixed(3)}M.`};
  const raise=term>=3?.08:.05,extensionRows=contractSchedule(annual,term,raise,read.starts),existing=player.contract.salaries.filter(row=>row.seasonYear<read.starts);player.contract={...player.contract,type:"Veteran Extension",signedUsing:"Extension / Bird Rights",originalLength:term,raisePercent:Math.round(raise*100),freeAgencyType:"Unrestricted free agent",salaries:[...existing,...extensionRows],extensionSignedYear:league.seasonYear};finalizeContract(player.contract,league.seasonYear);
  const transaction={seasonYear:league.seasonYear,day:league.day,type:"Extension",teamId,playerId:player.id,playerName:player.name,salary:annual,years:term,starts:read.starts};league.playerTransactions.push(transaction);return {completed:true,player,transaction};
}

export function waivePlayer(league,teamId,playerId){
  ensureLeagueContracts(league);const player=league.players.find(item=>item.id===Number(playerId));if(!player||player.teamId!==teamId)return {completed:false,reason:"That player is not on this roster."};
  const standardRoster=league.players.filter(item=>item.teamId===teamId&&!item.contract?.isTwoWay).length;if(league.phase==="Regular Season"&&!player.contract?.isTwoWay&&standardRoster<=12)return {completed:false,reason:"A regular-season roster must keep at least 12 standard-contract players."};
  const charges=(player.contract?.salaries||[]).filter(row=>row.seasonYear>=league.seasonYear&&row.guaranteed!==false).map(row=>({teamId,playerId:player.id,playerName:player.name,seasonYear:row.seasonYear,amount:money(row.amount),reason:"Waived"}));league.deadMoney.push(...charges);
  const releasedSalary=money(charges.reduce((sum,row)=>sum+row.amount,0)),oldContract=player.contract;player.teamId=null;player.contract=null;player.freeAgency={status:"Available",priorTeamId:teamId,restricted:false,rights:"None",askingSalary:estimatedMarketSalary(overall(player),player.experience,financialRulesForSeason(league.seasonYear).salaryCap),askingYears:1};
  const settings=league.teams[teamId]?.rotationSettings;if(settings?.minutes)delete settings.minutes[player.id];const transaction={seasonYear:league.seasonYear,day:league.day,type:"Waived",teamId,playerId:player.id,playerName:player.name,deadMoney:releasedSalary,contractType:oldContract?.type||"Contract"};league.playerTransactions.push(transaction);return {completed:true,player,transaction,charges};
}

export function signTwoWayPlayer(league,teamId,playerId){
  ensureLeagueContracts(league);const player=league.players.find(item=>item.id===Number(playerId));if(!player||player.teamId!==null)return {completed:false,reason:"That player is no longer unsigned."};
  if(player.age>25||(player.experience||0)>2)return {completed:false,reason:"Two-way contracts are limited here to players age 25 or younger with two or fewer years of experience."};
  if(league.players.filter(item=>item.teamId===teamId&&item.contract?.isTwoWay).length>=3)return {completed:false,reason:"This organization already has three two-way players."};
  if(league.players.filter(item=>item.teamId===teamId).length>=18)return {completed:false,reason:"The 18-player organizational roster is full."};
  const salary=.6;player.teamId=teamId;player.freeAgency=null;player.contract=finalizeContract({type:"Two-Way Contract",signedUsing:"Two-Way Slot",originalLength:1,raisePercent:0,freeAgencyType:"Restricted free agent",isTwoWay:true,salaries:[{seasonYear:league.seasonYear,amount:salary,guaranteed:false,option:null}]},league.seasonYear);
  const transaction={seasonYear:league.seasonYear,day:league.day,type:"Two-Way Signing",teamId,playerId:player.id,playerName:player.name,salary,years:1};league.playerTransactions.push(transaction);return {completed:true,player,transaction};
}

function salaryMatchForTeam(league,teamId,outgoingPlayers,incomingPlayers){
  const rules=league.financialRules||financialRulesForSeason(league.seasonYear),preset=financialRulePreset(league),sheet=teamCapSheet(league,teamId),outgoing=tradePackageSalary(outgoingPlayers),incoming=tradePackageSalary(incomingPlayers),postPayroll=money(sheet.payroll-outgoing+incoming),allowance=postPayroll>rules.firstApron?0:.25;
  let method,maxIncoming;
  if(sheet.payroll<=rules.salaryCap){method="Cap room";maxIncoming=money(outgoing+sheet.capSpace+.25);}
  else if(!preset.apronsActive){method="Simplified 125% matching";maxIncoming=money(outgoing*1.25+.25);}
  else if(sheet.payroll>rules.firstApron||postPayroll>rules.firstApron){method="Apron 100% matching";maxIncoming=outgoing;}
  else{method="Expanded traded-player exception";maxIncoming=money(Math.max(Math.min(outgoing*2+allowance,outgoing+rules.expandedTradeAddOn),outgoing*1.25+allowance));}
  let valid=incoming<=maxIncoming+.001,reason=valid?`${method}: may receive up to $${maxIncoming.toFixed(1)}M.`:`${method} allows no more than $${maxIncoming.toFixed(1)}M incoming for $${outgoing.toFixed(1)}M outgoing.`;
  if(preset.apronsActive&&sheet.payroll>rules.secondApron&&outgoingPlayers.length>1&&incoming>Math.max(0,...outgoingPlayers.map(player=>player.contract?.salary||0))+.001){valid=false;reason="A team above the second apron cannot aggregate multiple outgoing player salaries to match one larger incoming salary.";}
  return {teamId,valid,method,payroll:sheet.payroll,postPayroll,outgoing,incoming,maxIncoming,reason,status:sheet.status};
}

export function validateTradeSalary(league,proposerId,targetId,offeredPlayerIds=[],requestedPlayerIds=[]){
  const offered=offeredPlayerIds.map(Number).map(id=>league.players.find(player=>player.id===id)).filter(Boolean),requested=requestedPlayerIds.map(Number).map(id=>league.players.find(player=>player.id===id)).filter(Boolean),checks=[salaryMatchForTeam(league,proposerId,offered,requested),salaryMatchForTeam(league,targetId,requested,offered)];
  return {valid:checks.every(check=>check.valid),checks,reasons:checks.filter(check=>!check.valid).map(check=>`${league.teams[check.teamId]?.name||"Team"}: ${check.reason}`)};
}

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
  player.postseason={gp:0,minutes:0,points:0,rebounds:0,assists:0,fgm:0,fga:0,threeM:0,threeA:0,performances:[]};
  player.fatigue=0;player.injury=null;player.awards=[];player.careerStats={gp:0,minutes:0,points:0,rebounds:0,assists:0,fgm:0,fga:0,threeM:0,threeA:0};
  // Preserve the original roster generator's two contract RNG draws. Contract
  // generation now uses its own stream so names and ratings remain save-stable.
  r();r();
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

export function createLeague(seed=Date.now(),simulationSeedOverride=null,options={}){
  const r=mulberry32(seed>>>0);
  const teams=cities.map((city,id)=>({id,name:`${city} ${mascots[id]}`,conference:westernTeamIds.has(id)?"West":"East",wins:0,losses:0,pointsFor:0,pointsAgainst:0,scoutingTargets:{},scoutingKnowledge:{},proScout:45+Math.floor(r()*51),collegeScout:45+Math.floor(r()*51),analytics:45+Math.floor(r()*51),potentialEval:45+Math.floor(r()*51),risk:r()>.5?"Aggressive":"Cautious",philosophy:pick(["Build through the draft","Prioritize two-way players","Value shooting and spacing","Protect long-term flexibility","Pursue proven veterans"],r)}));
  const players=[];let id=0; for(const team of teams) for(let n=0;n<15;n++) players.push(makePlayer(id++,team.id,r));
  const prospects=[];for(let n=0;n<60;n++)prospects.push(makeProspect(1000+n,r));
  const randomRun=simulationSeedOverride??(globalThis.crypto?.getRandomValues?globalThis.crypto.getRandomValues(new Uint32Array(1))[0]:((Date.now()^Math.floor(Math.random()*0xffffffff))>>>0));
  const seasonR=mulberry32(randomRun>>>0);
  // Each new run gets a temporary chemistry/health environment independent of roster generation.
  // This prevents the same roster seed from collapsing toward the same record every season.
  for(const team of teams)team.seasonModifier=Math.max(-8,Math.min(8,normal(seasonR)*4));
  const draftClassStrength=DRAFT_CLASS_PRESETS[options.draftClassStrength]?.id||"realistic";
  const league={seed,simulationSeed:randomRun,userTeamId:null,seasonYear:2026,phase:"Regular Season",settings:{financialRulesPreset:options.financialRulesPreset==="simplified"?"simplified":"modern",draftClassStrength},teams,players,prospects,day:0,schedule:createSchedule(),results:[],postseason:null,tradeHistory:[],playerTransactions:[],deadMoney:[],retiredPlayers:[],awardHistory:[],draftPicks:[],preseasonRankingsByViewer:{},powerRankingSnapshotsByViewer:{}};
  ensureDraftClassBalance(league);
  ensureLeagueFinancials(league);
  ensureLeagueStaff(league);
  ensureLeagueTeamManagement(league);ensureLeagueHistory(league);ensureLeagueContracts(league);
  initializeDraftPicks(league);
  for(const team of teams){team.declaredDirection=evaluateTeamDirection(league,team.id);team.manualDirection=false;}
  for(const viewer of teams){
    const ids=calculatePowerRankings(league,viewer.id,"All",true).map(x=>x.team.id);
    league.preseasonRankingsByViewer[viewer.id]=ids;
    league.powerRankingSnapshotsByViewer[viewer.id]={day:0,ids:[...ids]};
  }
  return league;
}

export function initializeDraftPicks(league){
  const firstYear=(league.seasonYear||2026)+1;
  league.draftPicks??=[];
  const existing=new Set(league.draftPicks.map(pick=>pick.id));
  for(let year=firstYear;year<firstYear+3;year++)for(let round=1;round<=2;round++)for(const team of league.teams){
    const id=`pick-${year}-${round}-${team.id}`;if(!existing.has(id))league.draftPicks.push({id,year,round,originalTeamId:team.id,teamId:team.id,protection:"Unprotected"});
  }
  return league.draftPicks;
}

const LOTTERY_ODDS=[140,140,140,125,105,90,75,60,45,30,20,15,10,5];

function teamWinPct(team){const games=team.wins+team.losses;return games?team.wins/games:0;}
function teamNetRating(team){const games=team.wins+team.losses;return games?(team.pointsFor-team.pointsAgainst)/games:0;}
function worstRecordFirst(a,b){return teamWinPct(a)-teamWinPct(b)||teamNetRating(a)-teamNetRating(b)||a.id-b.id;}

function completedPostseasonRound(league,stage){
  const postseason=league.postseason;if(!postseason)return null;
  if(postseason.stage===stage)return postseason.current;
  return [...(postseason.completed||[])].reverse().find(round=>round.stage===stage)?.series||null;
}

function playoffDraftOrder(league,regularOrder){
  const firstRound=completedPostseasonRound(league,"First Round"),conferenceFinals=completedPostseasonRound(league,"Conference Finals"),finals=completedPostseasonRound(league,"Finals");
  const firstRoundIds=new Set(Object.values(firstRound||{}).flat().flatMap(series=>[series.a.teamId,series.b.teamId]));
  if(firstRoundIds.size!==16)return regularOrder.slice(14).map(team=>team.id);
  const finalsSeries=finals?.Finals?.[0],championId=league.postseason?.champion??finalsSeries?.winner?.teamId,runnerUpId=finalsSeries&&championId!==undefined?(finalsSeries.a.teamId===championId?finalsSeries.b.teamId:finalsSeries.a.teamId):null;
  const conferenceFinalLosers=Object.values(conferenceFinals||{}).flat().map(series=>series.winner?.teamId===series.a.teamId?series.b.teamId:series.a.teamId).filter(Number.isInteger);
  const reserved=new Set([championId,runnerUpId,...conferenceFinalLosers].filter(Number.isInteger));
  const earlyExit=regularOrder.filter(team=>firstRoundIds.has(team.id)&&!reserved.has(team.id)).map(team=>team.id);
  const lateExit=regularOrder.filter(team=>conferenceFinalLosers.includes(team.id)).map(team=>team.id);
  return [...earlyExit,...lateExit,...(Number.isInteger(runnerUpId)?[runnerUpId]:[]),...(Number.isInteger(championId)?[championId]:[])];
}

function weightedLotteryDraw(candidates,r){
  const pool=candidates.map((team,index)=>({team,weight:LOTTERY_ODDS[index]||1})),winners=[];
  while(winners.length<4&&pool.length){
    const total=pool.reduce((sum,item)=>sum+item.weight,0);let roll=r()*total,index=0;
    for(;index<pool.length-1;index++){roll-=pool[index].weight;if(roll<=0)break;}
    winners.push(pool.splice(index,1)[0].team);
  }
  return winners;
}

function draftPickAsset(league,year,round,originalTeamId){return league.draftPicks.find(pick=>pick.year===year&&pick.round===round&&pick.originalTeamId===originalTeamId);}

export function startDraftLottery(league){
  if(league.phase!=="Offseason"||league.postseason?.stage!=="Season Complete")return null;
  if(league.draft?.year===(league.seasonYear||2026)+1)return league.draft;
  initializeDraftPicks(league);league.draftHistory??=[];
  const year=(league.seasonYear||2026)+1,regularOrder=[...league.teams].sort(worstRecordFirst),firstRound=completedPostseasonRound(league,"First Round"),playoffIds=new Set(Object.values(firstRound||{}).flat().flatMap(series=>[series.a.teamId,series.b.teamId]));
  const lotteryTeams=(playoffIds.size===16?regularOrder.filter(team=>!playoffIds.has(team.id)):regularOrder.slice(0,14)).slice(0,14),lotteryR=mulberry32((((league.simulationSeed||league.seed||1)>>>0)^year^0x6c8e9cf5)>>>0),winners=weightedLotteryDraw(lotteryTeams,lotteryR),winnerIds=new Set(winners.map(team=>team.id)),lotteryOrder=[...winners,...lotteryTeams.filter(team=>!winnerIds.has(team.id))],playoffOrder=playoffDraftOrder(league,regularOrder),firstRoundTeamIds=[...lotteryOrder.map(team=>team.id),...playoffOrder];
  if(firstRoundTeamIds.length!==30)return null;
  const originalSlots=new Map(lotteryTeams.map((team,index)=>[team.id,index+1])),makeEntry=(originalTeamId,round,roundPick)=>{const asset=draftPickAsset(league,year,round,originalTeamId),overallPick=round===1?roundPick:30+roundPick;return {overallPick,round,roundPick,originalTeamId,teamId:asset?.teamId??originalTeamId,pickId:asset?.id??null,preLotterySlot:round===1?originalSlots.get(originalTeamId)||null:null,selectedPlayerId:null};};
  const order=[...firstRoundTeamIds.map((teamId,index)=>makeEntry(teamId,1,index+1)),...regularOrder.map((team,index)=>makeEntry(team.id,2,index+1))];
  league.draft={year,status:"Lottery Complete",currentPick:0,order,selections:[],lotteryTeamIds:lotteryTeams.map(team=>team.id),lotteryWinnerIds:winners.map(team=>team.id),declinedOfferIds:[],tradeDecisions:[],systemVersion:2,startedAtSeasonYear:league.seasonYear};
  return league.draft;
}

export function currentDraftPick(league){return league.draft?.status==="In Progress"?league.draft.order[league.draft.currentPick]||null:null;}

export function beginDraft(league){
  if(league.draft?.status!=="Lottery Complete")return false;
  league.draft.status="In Progress";league.draft.startedAtPick=league.draft.currentPick||0;return true;
}

export function rookieContractForPick(overallPick,seasonYear){
  const cap=financialRulesForSeason(seasonYear).salaryCap,firstRound=overallPick<=30,rank=firstRound?overallPick:overallPick-30,base=firstRound?money(cap*(.016+.074*Math.pow((31-rank)/30,1.35))):money((1.35+(31-rank)*.018));
  const contract=firstRound?{type:"Rookie Scale Contract",signedUsing:"Rookie Scale",originalLength:4,raisePercent:5,freeAgencyType:"Restricted free agent",salaries:contractSchedule(base,4,.05,seasonYear,index=>index>=2?"Team option":null,index=>index<2)}:{type:"Second-Round Pick Contract",signedUsing:"Second-Round Pick Exception",originalLength:4,raisePercent:5,freeAgencyType:"Restricted free agent",salaries:contractSchedule(base,4,.05,seasonYear,index=>index>=2?"Team option":null,index=>index<2)};
  return finalizeContract(contract,seasonYear);
}

function archiveProspectCollegeSeason(player,seasonYear){
  const college=collegeAverages(player);if(!college.gp)return;
  player.history.push({season:`${seasonYear-1}-${String(seasonYear).slice(-2)}`,level:"College",team:player.college,age:player.age,games:college.gp,mpg:college.mpg,ppg:college.ppg,rpg:college.rpg,apg:college.apg,fg:college.fg,three:college.three,performanceOvr:overall(player)});
}

function aiDraftScore(league,teamId,prospect,pickNumber){
  const report=scoutingReport(league,teamId,prospect),direction=league.teams[teamId]?.declaredDirection||evaluateTeamDirection(league,teamId),roster=league.players.filter(player=>player.teamId===teamId),positionStrength=Math.max(55,...roster.filter(player=>player.position===prospect.position||player.secondary===prospect.position).map(overall)),need=Math.max(0,78-positionStrength),upside=Math.max(0,report.perceivedPotential-report.perceived),risk=league.teams[teamId]?.risk==="Aggressive"?1.12:.92,noise=mulberry32((((league.simulationSeed||1)>>>0)+teamId*1543+prospect.id*31+pickNumber*7919)>>>0)();
  const currentWeight=direction==="Contending"?.76:direction==="Playoff push"?.68:.58,potentialWeight=1-currentWeight;
  return report.perceived*currentWeight+report.perceivedPotential*potentialWeight+need*(direction==="Contending"?.28:.48)+upside*risk*.16+(noise-.5)*2.6;
}

export function makeDraftSelection(league,prospectId,selectingTeamId=null){
  const entry=currentDraftPick(league),prospect=league.prospects.find(player=>player.id===Number(prospectId));
  if(!entry||!prospect)return {completed:false,reason:"The draft pick or prospect is no longer available."};
  if(selectingTeamId!==null&&entry.teamId!==selectingTeamId)return {completed:false,reason:"This selection belongs to another organization."};
  const prospectIndex=league.prospects.findIndex(player=>player.id===prospect.id),draftSeason=league.draft.year;archiveProspectCollegeSeason(prospect,draftSeason);prospect.teamId=entry.teamId;prospect.experience=0;prospect.draftPick=entry.overallPick;prospect.draftYear=draftSeason;prospect.draftedByTeamId=entry.teamId;prospect.draftOriginalTeamId=entry.originalTeamId;prospect.contract=rookieContractForPick(entry.overallPick,draftSeason);prospect.season={...emptyStatLine(),performances:[]};prospect.postseason={...emptyStatLine(),performances:[]};league.prospects.splice(prospectIndex,1);league.players.push(prospect);
  entry.selectedPlayerId=prospect.id;if(entry.pickId){const asset=league.draftPicks.find(pick=>pick.id===entry.pickId);if(asset){asset.used=true;asset.selectedPlayerId=prospect.id;asset.overallPick=entry.overallPick;}}
  prospect.fatigue=0;prospect.injury=null;prospect.awards??=[];prospect.careerStats??={gp:0,minutes:0,points:0,rebounds:0,assists:0,fgm:0,fga:0,threeM:0,threeA:0};
  const selection={year:draftSeason,overallPick:entry.overallPick,round:entry.round,roundPick:entry.roundPick,teamId:entry.teamId,originalTeamId:entry.originalTeamId,pickId:entry.pickId,playerId:prospect.id,playerName:prospect.name,position:prospect.position,college:prospect.college,contractType:prospect.contract.type};league.draft.selections.push(selection);league.draft.currentPick++;
  if(league.draft.currentPick>=league.draft.order.length){league.draft.status="Complete";if(!league.draftHistory.some(item=>item.year===draftSeason))league.draftHistory.push({year:draftSeason,selections:league.draft.selections.map(item=>({...item}))});}
  return {completed:true,selection,draftComplete:league.draft.status==="Complete"};
}

export function simulateNextDraftPick(league){
  const entry=currentDraftPick(league);if(!entry)return null;
  const prospect=[...league.prospects].sort((a,b)=>aiDraftScore(league,entry.teamId,b,entry.overallPick)-aiDraftScore(league,entry.teamId,a,entry.overallPick))[0];
  return prospect?makeDraftSelection(league,prospect.id,entry.teamId):null;
}

export function simulateDraftUntilUserPick(league,userTeamId){
  let simulated=0,guard=0;while(currentDraftPick(league)&&currentDraftPick(league).teamId!==userTeamId&&guard++<60){simulateNextDraftPick(league);simulated++;}return simulated;
}

export function simulateDraftToEnd(league){let simulated=0,guard=0;while(currentDraftPick(league)&&guard++<60){simulateNextDraftPick(league);simulated++;}return simulated;}

function makeProspect(id,r){
  const p=makePlayer(id,null,r);p.age=18+Math.floor(r()*5);p.experience=0;p.teamId=null;
  const growth=Math.max(3,(23-p.age)*(.8+r()*.8));p.ratings.potential=clamp(Math.max(overall(p),overall(p)+growth));p.history=[];p.collegeSeason=emptyStatLine();p.draftPick=clamp(Math.round(61-((p.ratings.potential-55)*1.35)+(r()-.5)*14),1,60);p.season={...emptyStatLine(),performances:[]};p.postseason={...emptyStatLine(),performances:[]};return p;
}

export function ensureDraftClassBalance(league){
  league.settings??={};const preset=draftClassPreset(league);league.settings.draftClassStrength=preset.id;
  if((league.draftClassSystemVersion||0)>=2)return preset;
  const selectedIds=new Set((league.draft?.selections||[]).map(selection=>selection.playerId)),classPlayers=[...(league.prospects||[]),...(league.players||[]).filter(player=>selectedIds.has(player.id))];
  const unique=[...new Map(classPlayers.map(player=>[player.id,player])).values()];
  const sourceScore=player=>overall(player)*.58+Math.max(overall(player),player.ratings.potential)*.42;
  unique.sort((a,b)=>sourceScore(b)-sourceScore(a)||a.id-b.id);
  const nonPotential=ATTRIBUTES.map(([key])=>key).filter(key=>key!=="potential"),count=Math.max(1,unique.length);
  unique.forEach((player,index)=>{
    const rank=index+1,strength=count===1?1:(count-rank)/(count-1),r=mulberry32((((league.seed||1)>>>0)^player.id*2654435761^0x51f15e5d)>>>0),currentNoise=Math.max(-1.5,Math.min(1.5,normal(r)*.8)),potentialNoise=Math.max(-1.5,Math.min(1.5,normal(r)*.9));
    const targetCurrent=clamp(62+19*Math.pow(strength,1.45)+preset.currentOffset+currentNoise,52,90);
    for(let pass=0;pass<2;pass++){const delta=targetCurrent-overall(player);for(const key of nonPotential)player.ratings[key]=clamp(player.ratings[key]+delta);}
    const current=overall(player),ageBonus=player.age<=19?1:player.age===20?.5:0,growth=4+7*Math.pow(strength,.75)+ageBonus+preset.potentialOffset+potentialNoise;
    player.ratings.potential=clamp(Math.max(current,current+growth),current,preset.potentialCap);if(!selectedIds.has(player.id))player.draftPick=rank;
  });
  league.draftClassSystemVersion=2;
  return preset;
}

const optionKind=option=>String(option||"").startsWith("Team option")?"Team option":String(option||"").startsWith("Player option")?"Player option":null;
const offseasonYear=league=>league.offseason?.year||(league.seasonYear||2026)+1;
const activeCapHold=(league,teamId,playerId)=>league.offseason?.capHolds?.find(hold=>hold.teamId===teamId&&hold.playerId===playerId&&hold.active);
const freeAgentRights=player=>player.experience>=3?"Full Bird":player.experience>=2?"Early Bird":"Non-Bird";

function resolveContractOption(league,decision,status){
  const player=league.players.find(item=>item.id===decision.playerId),year=offseasonYear(league),row=player?.contract?.salaries?.find(salary=>salary.seasonYear===year);
  if(!player||!row||!optionKind(row.option))return false;
  decision.status=status;
  if(status==="Exercised"){
    row.guaranteed=true;row.option=`${decision.kind} (exercised)`;finalizeContract(player.contract,player.contract.salaries[0]?.seasonYear||league.seasonYear);return true;
  }
  player.contract.salaries=player.contract.salaries.filter(salary=>salary.seasonYear<year);
  if(player.contract.salaries.length)finalizeContract(player.contract,player.contract.salaries[0].seasonYear);
  return true;
}

function optionRecommendation(league,player,amount){
  const market=estimatedMarketSalary(overall(player),player.experience,financialRulesForSeason(offseasonYear(league)).salaryCap);
  return amount<=market*1.08?"Exercise":"Decline";
}

export function startOffseason(league,userTeamId=league.userTeamId){
  if(league.phase!=="Offseason"||league.draft?.status!=="Complete")return null;
  if(league.offseason)return league.offseason;
  const year=(league.seasonYear||2026)+1,exceptions={};
  for(const team of league.teams)exceptions[team.id]={midLevelRemaining:money(financialRulesForSeason(year).salaryCap*.0855)};
  league.offseason={year,stage:"Contract Decisions",day:0,maxDays:12,decisions:[],capHolds:[],transactions:[],offerHistory:[],pendingOffers:[],exceptions};
  for(const player of league.players){
    if(player.teamId===null)continue;
    const row=player.contract?.salaries?.find(salary=>salary.seasonYear===year),kind=optionKind(row?.option);
    if(!row||!kind||String(row.option).includes("exercised"))continue;
    const decision={playerId:player.id,teamId:player.teamId,kind,amount:row.amount,status:"Pending",recommendation:optionRecommendation(league,player,row.amount)};league.offseason.decisions.push(decision);
    if(kind==="Player option"){
      const market=estimatedMarketSalary(overall(player),player.experience,financialRulesForSeason(year).salaryCap),accept=row.amount>=market*.9||player.age>=32;
      resolveContractOption(league,decision,accept?"Exercised":"Declined");
    }else if(userTeamId===null||player.teamId!==userTeamId)resolveContractOption(league,decision,decision.recommendation==="Exercise"?"Exercised":"Declined");
  }
  return league.offseason;
}

function openFreeAgency(league){
  const year=offseasonYear(league),rules=financialRulesForSeason(year);
  league.offseason.capHolds=[];
  for(const player of league.players.filter(item=>item.teamId===null&&item.freeAgency?.status==="Available")){
    const askingSalary=estimatedMarketSalary(overall(player),player.experience,rules.salaryCap);player.freeAgency={priorTeamId:null,rightsType:"None",restricted:false,capHold:0,askingSalary,askingYears:overall(player)>=85?4:overall(player)>=76?3:overall(player)>=69?2:1,status:"Available"};
  }
  for(const player of league.players){
    if(player.teamId===null)continue;
    const nextSalary=player.contract?.salaries?.find(row=>row.seasonYear===year);
    if(nextSalary)continue;
    const priorTeamId=player.teamId,askingSalary=estimatedMarketSalary(overall(player),player.experience,rules.salaryCap),rightsType=freeAgentRights(player),restricted=String(player.contract?.freeAgencyType||"").startsWith("Restricted"),previousSalary=player.contract?.salary||0,capHold=money(Math.min(rules.salaryCap*.35,Math.max(askingSalary*1.15,previousSalary*1.3,veteranMinimum(player.experience))));
    player.teamId=null;player.freeAgency={priorTeamId,rightsType,restricted,capHold,askingSalary,askingYears:overall(player)>=85?4:overall(player)>=76?3:overall(player)>=69?2:1,status:"Available"};
    league.offseason.capHolds.push({playerId:player.id,teamId:priorTeamId,amount:capHold,rightsType,restricted,active:true});
  }
  league.offseason.stage="Free Agency";league.offseason.day=0;return league.offseason;
}

export function finalizeContractDecisions(league,userTeamId=league.userTeamId,choices={}){
  if(!league.offseason&&league.draft?.status==="Complete")startOffseason(league,userTeamId);
  if(league.offseason?.stage!=="Contract Decisions")return {completed:false,reason:"Contract decisions are not active."};
  const pending=league.offseason.decisions.filter(decision=>decision.status==="Pending");
  for(const decision of pending){
    if(userTeamId!==null&&decision.teamId===userTeamId){
      const choice=String(choices[decision.playerId]||"").toLowerCase();if(!["exercise","decline"].includes(choice))continue;
      resolveContractOption(league,decision,choice==="exercise"?"Exercised":"Declined");
    }else resolveContractOption(league,decision,decision.recommendation==="Exercise"?"Exercised":"Declined");
  }
  const unresolved=league.offseason.decisions.filter(decision=>decision.status==="Pending");
  if(unresolved.length)return {completed:false,reason:"Choose whether to exercise or decline every team option.",pending:unresolved};
  openFreeAgency(league);return {completed:true,freeAgents:league.players.filter(player=>player.freeAgency?.status==="Available").length};
}

export function teamCapHolds(league,teamId){return money((league.offseason?.capHolds||[]).filter(hold=>hold.teamId===teamId&&hold.active).reduce((sum,hold)=>sum+hold.amount,0));}

export function freeAgencyTeamSheet(league,teamId){
  const year=offseasonYear(league),rules=financialRulesForSeason(year),committed=teamPayrollForSeason(league,teamId,year),capHolds=teamCapHolds(league,teamId),capCharges=money(committed+capHolds),capPosition=signedMoney(rules.salaryCap-capCharges),midLevelRemaining=league.offseason?.exceptions?.[teamId]?.midLevelRemaining||0;
  return {teamId,seasonYear:year,committed,capHolds,capCharges,capPosition,capRoom:money(Math.max(0,capPosition)),overCapBy:money(Math.max(0,-capPosition)),rosterSize:league.players.filter(player=>player.teamId===teamId).length,midLevelRemaining,...rules};
}

export function freeAgentMarketValue(league,playerId){
  const player=league.players.find(item=>item.id===Number(playerId));if(!player)return null;
  const salary=player.freeAgency?.askingSalary||estimatedMarketSalary(overall(player),player.experience,financialRulesForSeason(offseasonYear(league)).salaryCap),years=player.freeAgency?.askingYears||(overall(player)>=85?4:overall(player)>=76?3:overall(player)>=69?2:1);
  return {salary:money(salary),years,minimum:veteranMinimum(player.experience),maxSalary:money(financialRulesForSeason(offseasonYear(league)).salaryCap*maxSalaryPercent(player.experience))};
}

function signingMechanism(league,teamId,player,salary){
  const sheet=freeAgencyTeamSheet(league,teamId),hold=activeCapHold(league,teamId,player.id);
  if(hold)return {valid:true,mechanism:`${hold.rightsType} Rights`};
  if(salary<=sheet.capRoom+.001)return {valid:true,mechanism:"Cap Space"};
  if(salary<=sheet.midLevelRemaining+.001&&salary<=sheet.salaryCap*.09)return {valid:true,mechanism:"Mid-Level Exception"};
  if(salary<=veteranMinimum(player.experience)*1.03+.001)return {valid:true,mechanism:"Minimum Salary Exception"};
  return {valid:false,reason:`Only $${sheet.capRoom.toFixed(1)}M in cap room and $${sheet.midLevelRemaining.toFixed(1)}M of the mid-level exception remain.`};
}

const FREE_AGENT_SKILL_GROUPS={
  scoring:["threePoint","midrange","finishing"],
  playmaking:["playmaking","ballHandle"],
  wingDefense:["perimeterDefense","steals","speed"],
  rimProtection:["blocks","postDefense","strength"],
  rebounding:["offRebound","defRebound"]
};
const FREE_AGENT_SKILL_LABELS={scoring:"shot creation",playmaking:"playmaking",wingDefense:"perimeter defense",rimProtection:"rim protection",rebounding:"rebounding"};
const playerPositions=player=>new Set([player.position,player.secondary].filter(Boolean));
const sharesPosition=(left,right)=>[...playerPositions(left)].some(position=>playerPositions(right).has(position));
const skillGroupValue=(player,keys,report=null)=>keys.reduce((sum,key)=>sum+(report?(report.estimates[key].low+report.estimates[key].high)/2:player.ratings[key]),0)/keys.length;

function freeAgentRosterNeeds(league,teamId){
  const team=league.teams.find(item=>item.id===Number(teamId)),rotation=league.players.filter(player=>player.teamId===Number(teamId)).sort((a,b)=>overall(b)-overall(a)).slice(0,10),categoryStrengths={},categoryNeeds={};
  for(const [category,keys] of Object.entries(FREE_AGENT_SKILL_GROUPS)){
    const strength=rotation.length?rotation.reduce((sum,player,index)=>sum+skillGroupValue(player,keys)*(10-index),0)/rotation.reduce((sum,_,index)=>sum+10-index,0):55;
    categoryStrengths[category]=strength;categoryNeeds[category]=Math.max(0,78-strength);
  }
  const games=(team?.wins||0)+(team?.losses||0),leagueTeams=league.teams.filter(item=>(item.wins||0)+(item.losses||0)>0),leagueOffense=leagueTeams.length?leagueTeams.reduce((sum,item)=>sum+item.pointsFor/Math.max(1,item.wins+item.losses),0)/leagueTeams.length:0,pointsFor=games?(team.pointsFor||0)/games:leagueOffense,pointsAgainst=games?(team.pointsAgainst||0)/games:leagueOffense,offenseGap=leagueOffense?pointsFor-leagueOffense:0,defenseGap=leagueOffense?pointsAgainst-leagueOffense:0;
  if(offenseGap<=-2){categoryNeeds.scoring+=Math.min(10,Math.abs(offenseGap)*1.6);categoryNeeds.playmaking+=Math.min(7,Math.abs(offenseGap));}
  if(defenseGap>=2){categoryNeeds.wingDefense+=Math.min(10,defenseGap*1.5);categoryNeeds.rimProtection+=Math.min(10,defenseGap*1.5);}
  return {team,rotation,categoryStrengths,categoryNeeds,offenseGap,defenseGap,games};
}

function freeAgentGrade(score){return score>=94?"A+":score>=89?"A":score>=85?"A-":score>=81?"B+":score>=76?"B":score>=72?"B-":score>=68?"C+":score>=63?"C":score>=58?"C-":"D";}

export function freeAgentTeamFit(league,teamId,playerId){
  const player=league.players.find(item=>item.id===Number(playerId));if(!player)return null;
  const report=scoutingReport(league,Number(teamId),player),needs=freeAgentRosterNeeds(league,Number(teamId)),strengths=Object.fromEntries(Object.entries(FREE_AGENT_SKILL_GROUPS).map(([category,keys])=>[category,skillGroupValue(player,keys,report)])),needEntries=Object.entries(needs.categoryNeeds),needTotal=Math.max(1,needEntries.reduce((sum,[,need])=>sum+need,0)),synergy=needEntries.reduce((sum,[category,need])=>sum+need*Math.max(0,strengths[category]-60),0)/needTotal*.8,samePosition=needs.rotation.filter(rosterPlayer=>sharesPosition(rosterPlayer,player)),bestAtPosition=samePosition.length?Math.max(...samePosition.map(overall)):0,positionBonus=samePosition.length<2?9:samePosition.length<3?5:bestAtPosition<report.perceived-4?4:0,dominantCategory=Object.entries(strengths).sort((a,b)=>b[1]-a[1])[0][0],redundancyPenalty=needs.categoryNeeds[dominantCategory]<3&&samePosition.filter(rosterPlayer=>overall(rosterPlayer)>=78).length>=2?6:0,score=clamp(50+(report.perceived-65)*.85+synergy+positionBonus-redundancyPenalty,45,98),rankedImpact=needEntries.map(([category,need])=>({category,impact:need*Math.max(0,strengths[category]-58)})).sort((a,b)=>b.impact-a.impact),reasons=[];
  const topImpact=rankedImpact[0]?.category;
  if(topImpact&&rankedImpact[0].impact>70){const lastSeason=needs.games>=40&&((needs.defenseGap>=2&&["wingDefense","rimProtection"].includes(topImpact))||(needs.offenseGap<=-2&&["scoring","playmaking"].includes(topImpact)));reasons.push(`${lastSeason?"Targets last season's":"Addresses the roster's"} ${FREE_AGENT_SKILL_LABELS[topImpact]} need`);}
  if(positionBonus>=8)reasons.push(`Fills thin ${player.position} depth`);else if(positionBonus>=4)reasons.push(`Could earn a major ${player.position} role`);
  if(redundancyPenalty)reasons.push(`${FREE_AGENT_SKILL_LABELS[dominantCategory]} overlaps with established rotation strengths`);
  if(!reasons.length)reasons.push(score>=76?"Adds useful two-way rotation value":"Useful talent, but not a priority roster need");
  return {score,grade:freeAgentGrade(score),label:score>=89?"Excellent match":score>=81?"Strong match":score>=72?"Good match":score>=63?"Situational fit":"Low-priority fit",reasons:reasons.slice(0,2),strengths,needs:needs.categoryNeeds,scoutingConfidence:report.confidence};
}

export function freeAgentInterest(league,teamId,playerId){
  const player=league.players.find(item=>item.id===Number(playerId)),team=league.teams.find(item=>item.id===Number(teamId));if(!player||!team)return null;
  const report=scoutingReport(league,Number(teamId),player),roster=league.players.filter(item=>item.teamId===Number(teamId)),samePosition=roster.filter(item=>sharesPosition(item,player)),bestAtPosition=samePosition.length?Math.max(...samePosition.map(overall)):0,games=(team.wins||0)+(team.losses||0),winPct=games?team.wins/games:.5,direction=team.declaredDirection||evaluateTeamDirection(league,team.id),preferenceR=mulberry32((((league.seed||1)>>>0)^player.id*2246822519^team.id*3266489917)>>>0),drivers=[];
  let score=52+(preferenceR()-.5)*14;
  if(games>=40){const resultEffect=(winPct-.5)*38;score+=resultEffect;if(resultEffect>=5)drivers.push("winning situation");else if(resultEffect<=-5)drivers.push("recent team results");}
  if(player.freeAgency?.priorTeamId===team.id){score+=11;drivers.push("familiar organization");}
  if(samePosition.length<2||bestAtPosition<report.perceived-5){score+=9;drivers.push("clear rotation opportunity");}else if(bestAtPosition>report.perceived+5&&samePosition.length>=3){score-=8;drivers.push("crowded role");}
  if(direction==="Contending"&&player.age>=27){score+=7;drivers.push("win-now timeline");}else if(direction==="Rebuilding"&&player.age<=25){score+=7;drivers.push("development timeline");}else if(direction==="Rebuilding"&&player.age>=30){score-=7;drivers.push("timeline mismatch");}
  score=clamp(score,18,96);const label=score>=82?"Very high":score>=68?"High":score>=50?"Open":score>=35?"Low":"Very low";
  return {score,label,drivers:drivers.slice(0,2)};
}

export function freeAgentAffordability(league,teamId,playerId){
  const player=league.players.find(item=>item.id===Number(playerId));if(!player)return null;
  const market=freeAgentMarketValue(league,player.id),sheet=freeAgencyTeamSheet(league,Number(teamId)),mechanism=signingMechanism(league,Number(teamId),player,market.salary),label=mechanism.valid?mechanism.mechanism.replace("Cap Space","Cap room").replace("Mid-Level Exception","Mid-level").replace("Minimum Salary Exception","Minimum"):"Out of range",maxWithoutTrade=activeCapHold(league,Number(teamId),player.id)?market.maxSalary:Math.max(sheet.capRoom,Math.min(sheet.midLevelRemaining,sheet.salaryCap*.09),market.minimum*1.03);
  return {affordable:mechanism.valid,label,mechanism:mechanism.valid?mechanism.mechanism:null,maxWithoutTrade:money(maxWithoutTrade)};
}

function validateFreeAgentOffer(league,teamId,player,salary,years){
  if(league.offseason?.stage!=="Free Agency"||player?.freeAgency?.status!=="Available")return {completed:false,reason:"That player is no longer available."};
  if(!league.teams.some(team=>team.id===teamId))return {completed:false,reason:"That organization does not exist."};
  if(league.players.filter(item=>item.teamId===teamId).length>=18)return {completed:false,reason:"The roster already has 18 players."};
  const market=freeAgentMarketValue(league,player.id),annual=money(salary),term=Math.max(1,Math.min(5,Math.round(years||1))),ownRights=Boolean(activeCapHold(league,teamId,player.id)),mechanism=signingMechanism(league,teamId,player,annual);
  if(annual<market.minimum-.001)return {completed:false,reason:`The minimum first-year salary is $${market.minimum.toFixed(1)}M.`};
  if(!mechanism.valid)return {completed:false,reason:mechanism.reason};
  if(annual>market.maxSalary+.001)return {completed:false,reason:`The maximum first-year salary is $${market.maxSalary.toFixed(1)}M.`};
  if(term>4&&!ownRights)return {completed:false,reason:"Only a player's prior team can offer a fifth year."};
  return {completed:true,market,annual,term,ownRights,mechanism};
}

function signFreeAgent(league,teamId,player,salary,years,{allowMatch=true}={}){
  const terms=validateFreeAgentOffer(league,teamId,player,salary,years);if(!terms.completed)return terms;
  const {market,annual,term,ownRights,mechanism}=terms;
  let signedTeamId=teamId,matched=false;
  if(allowMatch&&player.freeAgency.restricted&&!ownRights&&activeCapHold(league,player.freeAgency.priorTeamId,player.id)&&league.players.filter(item=>item.teamId===player.freeAgency.priorTeamId).length<18&&overall(player)>=76&&annual<=market.salary*1.15){signedTeamId=player.freeAgency.priorTeamId;matched=true;}
  const signedMechanism=matched?`${player.freeAgency.rightsType} Rights`:mechanism.mechanism,year=offseasonYear(league),contract={type:annual<=market.minimum*1.03?"Veteran Minimum Contract":"Free Agent Contract",signedUsing:signedMechanism,originalLength:term,raisePercent:5,freeAgencyType:"Unrestricted free agent",salaries:contractSchedule(annual,term,.05,year,index=>term>=3&&index===term-1?"Player option":null)};
  player.contract=finalizeContract(contract,year);player.teamId=signedTeamId;player.freeAgency.status="Signed";
  for(const hold of league.offseason.capHolds)if(hold.playerId===player.id)hold.active=false;
  if(!matched&&mechanism.mechanism==="Mid-Level Exception")league.offseason.exceptions[teamId].midLevelRemaining=money(Math.max(0,league.offseason.exceptions[teamId].midLevelRemaining-annual));
  const transaction={day:league.offseason.day,type:matched?"Offer sheet matched":"Free-agent signing",playerId:player.id,playerName:player.name,teamId:signedTeamId,offerTeamId:teamId,salary:annual,years:term,mechanism:signedMechanism,matched};league.offseason.transactions.push(transaction);
  league.offseason.pendingOffers=(league.offseason.pendingOffers||[]).filter(offer=>offer.playerId!==player.id);
  return {completed:true,matched,teamId:signedTeamId,transaction};
}

export function makeFreeAgentOffer(league,teamId,playerId,{salary,years}={}){
  const player=league.players.find(item=>item.id===Number(playerId)),market=player?freeAgentMarketValue(league,player.id):null;
  if(!player||!market)return {completed:false,reason:"That free agent could not be found."};
  const resolvedTeamId=Number(teamId),terms=validateFreeAgentOffer(league,resolvedTeamId,player,salary??market.salary,years??market.years);if(!terms.completed)return terms;
  league.offseason.pendingOffers??=[];league.offseason.offerHistory??=[];
  const existing=league.offseason.pendingOffers.find(offer=>offer.playerId===player.id&&offer.teamId===resolvedTeamId),submittedDay=existing?.submittedDay??league.offseason.day,offer={id:`fa-${resolvedTeamId}-${player.id}`,playerId:player.id,teamId:resolvedTeamId,salary:terms.annual,years:terms.term,mechanism:terms.mechanism.mechanism,submittedDay,updatedDay:league.offseason.day,source:resolvedTeamId===league.userTeamId?"User":"AI"};
  if(existing)Object.assign(existing,offer);else league.offseason.pendingOffers.push(offer);
  const interest=freeAgentInterest(league,resolvedTeamId,player.id);league.offseason.offerHistory.push({day:league.offseason.day,playerId:player.id,teamId:resolvedTeamId,salary:terms.annual,years:terms.term,interest:interest.score,status:existing?"Updated":"Submitted"});
  return {completed:true,pending:true,updated:Boolean(existing),offer,competition:league.offseason.pendingOffers.filter(item=>item.playerId===player.id).length};
}

export function renounceCapHold(league,teamId,playerId){
  if(league.offseason?.stage!=="Free Agency")return false;const hold=activeCapHold(league,Number(teamId),Number(playerId));if(!hold)return false;hold.active=false;
  const player=league.players.find(item=>item.id===Number(playerId));if(player?.freeAgency&&player.freeAgency.priorTeamId===Number(teamId))player.freeAgency.rightsType="Renounced";return true;
}

export function simulateFreeAgencyDay(league,userTeamId=league.userTeamId){
  if(league.offseason?.stage!=="Free Agency")return {completed:false,reason:"Free agency is not active.",signings:[]};
  league.offseason.pendingOffers??=[];league.offseason.offerHistory??=[];
  const available=()=>league.players.filter(player=>player.freeAgency?.status==="Available"),teams=[...league.teams].sort((a,b)=>((a.id+league.offseason.day)%league.teams.length)-((b.id+league.offseason.day)%league.teams.length));let offersSubmitted=0;
  for(const team of teams){
    const rosterSize=league.players.filter(player=>player.teamId===team.id).length,minimumVacancies=league.teams.reduce((sum,item)=>sum+Math.max(0,12-league.players.filter(player=>player.teamId===item.id).length),0),teamPending=league.offseason.pendingOffers.filter(offer=>offer.teamId===team.id);
    if(team.id===userTeamId||rosterSize>=16||teamPending.length>=3||rosterSize>=12&&available().length<=minimumVacancies)continue;
    const candidates=available().filter(player=>!teamPending.some(offer=>offer.playerId===player.id)).map(player=>{const fit=freeAgentTeamFit(league,team.id,player.id),interest=freeAgentInterest(league,team.id,player.id),competition=league.offseason.pendingOffers.filter(offer=>offer.playerId===player.id).length,r=mulberry32((((league.seed||1)>>>0)^team.id*2654435761^player.id*1597334677^(league.offseason.day+1)*2246822519)>>>0);return {player,score:fit.score*.5+overall(player)*.25+interest.score*.25-competition*7+r()*7};}).sort((a,b)=>b.score-a.score||a.player.id-b.player.id);
    for(const {player} of candidates){
      const market=freeAgentMarketValue(league,player.id),affordability=freeAgentAffordability(league,team.id,player.id),r=mulberry32((((league.seed||1)>>>0)^team.id*3266489917^player.id*668265263^(league.offseason.day+1)*374761393)>>>0),salary=money(Math.max(market.minimum,Math.min(market.maxSalary,affordability.maxWithoutTrade,market.salary*(.97+r()*.1)))),ownRights=player.freeAgency.priorTeamId===team.id,years=Math.max(1,Math.min(ownRights?5:4,market.years+(r()>.8?1:0))),result=makeFreeAgentOffer(league,team.id,player.id,{salary,years});
      if(result.completed){offersSubmitted++;break;}
    }
  }
  league.offseason.day=Math.min(league.offseason.maxDays,league.offseason.day+1);
  const signings=[],groups=new Map();for(const offer of league.offseason.pendingOffers)groups.set(offer.playerId,[...(groups.get(offer.playerId)||[]),offer]);
  for(const [playerId,offers] of [...groups.entries()].sort((a,b)=>a[0]-b[0])){
    const player=league.players.find(item=>item.id===playerId);if(player?.freeAgency?.status!=="Available")continue;
    const validOffers=offers.map(offer=>({offer,terms:validateFreeAgentOffer(league,offer.teamId,player,offer.salary,offer.years)})).filter(entry=>entry.terms.completed).map(entry=>{const interest=freeAgentInterest(league,entry.offer.teamId,player.id),fit=freeAgentTeamFit(league,entry.offer.teamId,player.id),market=entry.terms.market,annualRatio=entry.offer.salary/Math.max(.001,market.salary),totalRatio=entry.offer.salary*entry.offer.years/Math.max(.001,market.salary*market.years),score=annualRatio*45+Math.min(1.35,totalRatio)*16+interest.score*.25+fit.score*.14;return {...entry,interest,fit,score};}).sort((a,b)=>b.score-a.score||b.offer.salary-a.offer.salary||a.offer.teamId-b.offer.teamId);
    const validIds=new Set(validOffers.map(entry=>entry.offer.id));for(const offer of offers.filter(item=>!validIds.has(item.id)))league.offseason.offerHistory.push({...offer,day:league.offseason.day,status:"Withdrawn"});
    league.offseason.pendingOffers=league.offseason.pendingOffers.filter(offer=>offer.playerId!==playerId||validIds.has(offer.id));
    if(!validOffers.length)continue;
    const best=validOffers[0],progress=league.offseason.day/league.offseason.maxDays,market=best.terms.market,minimumRatio=Math.max(.78,1.01-(best.interest.score-50)*.0025-(best.offer.years-market.years)*.025-(league.offseason.day===league.offseason.maxDays?.1:0)),acceptable=best.offer.salary>=market.salary*minimumRatio-.001;
    const rosterSize=league.players.filter(item=>item.teamId===best.offer.teamId).length,minimumVacancies=league.teams.reduce((sum,team)=>sum+Math.max(0,12-league.players.filter(item=>item.teamId===team.id).length),0),slotAvailable=rosterSize<12||available().length>minimumVacancies;
    const decisionR=mulberry32((((league.seed||1)>>>0)^player.id*2246822519^league.offseason.day*3266489917)>>>0),decisionChance=Math.max(.08,Math.min(.94,.04+progress*.82+(validOffers.length>1?.1:0)+Math.max(0,best.offer.salary/market.salary-1)*.35)),decides=league.offseason.day>=league.offseason.maxDays||decisionR()<decisionChance;
    if(!decides||!acceptable||!slotAvailable)continue;
    const result=signFreeAgent(league,best.offer.teamId,player,best.offer.salary,best.offer.years);if(!result.completed)continue;
    for(const entry of validOffers)league.offseason.offerHistory.push({...entry.offer,day:league.offseason.day,interest:entry.interest.score,status:entry.offer.id===best.offer.id?(result.matched?"Matched":"Accepted"):"Declined"});
    signings.push(result.transaction);
  }
  return {completed:true,signings,offersSubmitted,pendingOffers:league.offseason.pendingOffers.length,day:league.offseason.day};
}

function finalizeFreeAgencyRosters(league){
  if(league.offseason?.stage!=="Free Agency")return {completed:false,reason:"Free agency is not active."};
  const oversized=league.teams.filter(team=>league.players.filter(player=>player.teamId===team.id).length>18);if(oversized.length)return {completed:false,reason:`${oversized.map(team=>team.name).join(", ")} must reduce the roster to 18 players.`};
  for(const offer of league.offseason.pendingOffers||[])league.offseason.offerHistory.push({...offer,day:league.offseason.day,status:"Expired"});league.offseason.pendingOffers=[];
  for(const team of league.teams){
    let guard=0;while(league.players.filter(player=>player.teamId===team.id).length<12&&guard++<30){
      const player=league.players.filter(item=>item.freeAgency?.status==="Available").sort((a,b)=>overall(b)-overall(a)||a.id-b.id)[0];if(!player)break;
      const salary=veteranMinimum(player.experience),result=signFreeAgent(league,team.id,player,salary,1,{allowMatch:false});if(!result.completed)break;
    }
  }
  const short=league.teams.filter(team=>league.players.filter(player=>player.teamId===team.id).length<12);if(short.length)return {completed:false,reason:"Not enough free agents remain to complete every roster."};
  league.offseason.stage="Ready for Next Season";return {completed:true};
}

export function finishFreeAgency(league,userTeamId=league.userTeamId){
  const resumable=league.offseason?.stage==="Ready for Next Season"&&league.offseason.day<league.offseason.maxDays;if(resumable)league.offseason.stage="Free Agency";
  if(league.offseason?.stage!=="Free Agency")return {completed:false,reason:"Free agency is not active."};
  let days=0,signings=0;while(league.offseason.day<league.offseason.maxDays){const result=simulateFreeAgencyDay(league,userTeamId);if(!result.completed)break;days++;signings+=result.signings.length;}
  return {...finalizeFreeAgencyRosters(league),days,signings};
}

export function simulateFreeAgencyToEnd(league,userTeamId=league.userTeamId){return finishFreeAgency(league,userTeamId);}

function careerFromHistory(player){
  const totals={gp:0,minutes:0,points:0,rebounds:0,assists:0,fgm:0,fga:0,threeM:0,threeA:0};for(const row of player.history||[]){if(row.level!=="Pro")continue;const games=Number(row.games)||0;totals.gp+=games;totals.minutes+=Math.round((Number(row.mpg)||0)*games);totals.points+=Math.round((Number(row.ppg)||0)*games);totals.rebounds+=Math.round((Number(row.rpg)||0)*games);totals.assists+=Math.round((Number(row.apg)||0)*games);}
  return totals;
}

export function ensureLeagueHistory(league){
  const migrating=!league.historySystemVersion;league.seasonHistory??=[];league.awardHistory??=[];league.retiredPlayers??=[];
  for(const player of league.players){player.awards??=[];if(!player.careerStats||migrating&&Object.values(player.careerStats).every(value=>!value))player.careerStats=careerFromHistory(player);}
  league.historySystemVersion=1;return league;
}

function awardScore(league,player,type){const stats=seasonAverages(player),wins=player.teamId===null?0:(league.teams[player.teamId]?.wins||0);if(!stats.gp)return -Infinity;if(type==="MVP")return stats.ppg*1.8+stats.rpg*.65+stats.apg+performanceSummary(player).seasonImpact*.35+wins*.08;if(type==="Defensive Player of the Year")return (player.ratings.perimeterDefense+player.ratings.postDefense+player.ratings.blocks+player.ratings.steals)/4+stats.rpg*.9+wins*.06;if(type==="Rookie of the Year")return stats.ppg*1.4+stats.rpg*.7+stats.apg+performanceSummary(player).seasonImpact*.3;return performanceSummary(player).seasonImpact+stats.ppg*.35;}

function recordSeasonAwards(league,championId){
  ensureLeagueHistory(league);if(league.awardHistory.some(row=>row.seasonYear===league.seasonYear))return league.awardHistory.find(row=>row.seasonYear===league.seasonYear).awards;
  const eligible=league.players.filter(player=>player.teamId!==null&&seasonAverages(player).gp>=20),pickWinner=(type,pool=eligible)=>[...pool].sort((a,b)=>awardScore(league,b,type)-awardScore(league,a,type)||b.id-a.id)[0],mvp=pickWinner("MVP"),dpoy=pickWinner("Defensive Player of the Year"),roy=pickWinner("Rookie of the Year",eligible.filter(player=>(player.experience||0)===0)),sixth=pickWinner("Sixth Man of the Year",eligible.filter(player=>seasonAverages(player).mpg<29.5));
  const championPool=eligible.filter(player=>player.teamId===championId&&postseasonAverages(player).gp),finalsMvp=[...championPool].sort((a,b)=>(postseasonAverages(b).ppg+postseasonAverages(b).rpg*.45+postseasonAverages(b).apg*.65)-(postseasonAverages(a).ppg+postseasonAverages(a).rpg*.45+postseasonAverages(a).apg*.65))[0];
  const awards=[mvp&&["MVP",mvp],dpoy&&["Defensive Player of the Year",dpoy],roy&&["Rookie of the Year",roy],sixth&&["Sixth Man of the Year",sixth],finalsMvp&&["Finals MVP",finalsMvp]].filter(Boolean).map(([name,player])=>({name,playerId:player.id,playerName:player.name,teamId:player.teamId}));for(const award of awards){const player=league.players.find(item=>item.id===award.playerId);player.awards.push({seasonYear:league.seasonYear,name:award.name});}league.awardHistory.push({seasonYear:league.seasonYear,awards});return awards;
}

function retirePlayers(league,nextYear){
  const retired=[];for(const player of league.players){if(player.draftYear===nextYear)continue;const rating=overall(player),r=mulberry32((((league.seed||1)>>>0)^player.id*2654435761^nextYear*3266489917)>>>0),chance=player.age>=42?1:player.age>=39?.64:player.age>=37?.28+Math.max(0,72-rating)*.012:player.age>=35&&rating<67?.12:0;if(r()>=chance)continue;retired.push(player);}
  for(const player of retired){league.retiredPlayers.push({id:player.id,name:player.name,position:player.position,secondary:player.secondary,age:player.age,retiredYear:nextYear,finalTeamId:player.teamId,careerStats:{...player.careerStats},awards:[...(player.awards||[])],history:[...(player.history||[])],careerPeak:performanceSummary(player).careerPeak});}
  const ids=new Set(retired.map(player=>player.id));league.players=league.players.filter(player=>!ids.has(player.id));return retired;
}

function fillPostRetirementRosters(league){
  for(const team of league.teams){let guard=0;while(league.players.filter(player=>player.teamId===team.id&&!player.contract?.isTwoWay).length<12&&guard++<30){const player=league.players.filter(item=>item.teamId===null).sort((a,b)=>overall(b)-overall(a)||a.id-b.id)[0];if(!player)break;player.teamId=team.id;player.freeAgency=null;player.contract=finalizeContract({type:"Veteran Minimum Contract",signedUsing:"Minimum Salary Exception",originalLength:1,raisePercent:0,freeAgencyType:"Unrestricted free agent",salaries:contractSchedule(veteranMinimum(player.experience),1,0,league.seasonYear)},league.seasonYear);league.playerTransactions.push({seasonYear:league.seasonYear,day:0,type:"Post-retirement roster signing",teamId:team.id,playerId:player.id,playerName:player.name,salary:player.contract.salary,years:1});}}
}

export function careerLeaders(league,stat="points",limit=10){
  ensureLeagueHistory(league);const current=league.players.map(player=>({id:player.id,name:player.name,teamId:player.teamId,retired:false,value:(player.careerStats?.[stat]||0)+(player.season?.[stat]||0)})),retired=league.retiredPlayers.map(player=>({id:player.id,name:player.name,teamId:player.finalTeamId,retired:true,value:player.careerStats?.[stat]||0}));return [...current,...retired].sort((a,b)=>b.value-a.value||a.name.localeCompare(b.name)).slice(0,limit);
}

function archiveCompletedSeason(player,year){
  const averages=seasonAverages(player);if(!averages.gp)return;
  player.history??=[];player.history.push({season:`${year}-${String(year+1).slice(-2)}`,level:"Pro",team:null,age:player.age,games:averages.gp,mpg:averages.mpg,ppg:averages.ppg,rpg:averages.rpg,apg:averages.apg,fg:averages.fg,three:averages.three,performanceOvr:performanceSummary(player).seasonImpact||overall(player)});
  player.careerStats??=careerFromHistory(player);for(const key of ["gp","minutes","points","rebounds","assists","fgm","fga","threeM","threeA"])player.careerStats[key]=(player.careerStats[key]||0)+(player.season?.[key]||0);
}

function generateNextDraftClass(league,draftYear){
  const maxId=Math.max(999,...league.players.map(player=>player.id),...(league.prospects||[]).map(player=>player.id)),r=mulberry32((((league.seed||1)>>>0)^draftYear*2654435761^0x31dd71a3)>>>0);
  league.prospects=Array.from({length:60},(_,index)=>makeProspect(maxId+index+1,r));league.draftClassSystemVersion=1;ensureDraftClassBalance(league);
}

function developmentKeys(player){return player.position==="PG"?["playmaking","ballHandle","speed","threePoint","perimeterDefense"]:player.position==="C"?["postDefense","blocks","defRebound","finishing","strength"]:["threePoint","finishing","perimeterDefense","speed","playmaking"];}

function applyPlayerDevelopment(league,nextYear){
  ensureLeagueStaff(league);
  for(const player of league.players){
    if(player.teamId===null||player.draftYear===nextYear)continue;
    const director=league.staff.find(member=>member.teamId===player.teamId&&member.role==="Player Development Director"),quality=director?.attributes?.development||50,before=overall(player),gap=Math.max(0,(player.ratings.potential||before)-before),r=mulberry32((((league.seed||1)>>>0)^player.id*2654435761^nextYear*2246822519)>>>0);let change=0;
    if(player.age<=25&&gap>0){const growthChance=Math.min(.96,.18+(quality-45)/85+gap/28);if(r()<growthChance)change=1;if(gap>=7&&quality>=76&&r()<growthChance*.42)change=2;}
    else if(player.age<=28&&gap>=5&&r()<.10+(quality-45)/180)change=1;
    else if(player.age>=32){const declineChance=Math.min(.78,.15+(player.age-31)*.075-(quality-50)/250);if(r()<declineChance)change=-1;if(player.age>=36&&r()<declineChance*.35)change=-2;}
    const keys=developmentKeys(player);for(const key of keys)player.ratings[key]=clamp(player.ratings[key]+change);player.ratings.potential=clamp(Math.max(overall(player),player.ratings.potential+(change<0?change:0)));
    const actual=overall(player)-before;player.developmentDelta=actual;player.developmentHistory??=[];player.developmentHistory.push({seasonYear:nextYear,change:actual,directorId:director?.id||null,directorName:director?.name||"Vacant department",staffRating:quality});if(player.developmentHistory.length>6)player.developmentHistory=player.developmentHistory.slice(-6);
  }
}

function runAiStaffMarket(league,userTeamId){
  for(const team of league.teams){
    if(team.id===userTeamId)continue;
    for(const role of STAFF_ROLES){if(league.staff.some(member=>member.teamId===team.id&&member.role===role))continue;for(const candidate of staffMarket(league,role)){const result=hireStaffMember(league,team.id,candidate.id,{salary:candidate.askingSalary,years:2+((team.id+candidate.age)%3)});if(result.completed)break;}}
  }
  for(const role of STAFF_ROLES){
    let guard=0;while(guard++<12){const candidate=staffMarket(league,role)[0];if(!candidate)break;const incumbents=league.staff.filter(member=>member.teamId!==null&&member.teamId!==userTeamId&&member.role===role).sort((a,b)=>staffOverall(a)-staffOverall(b));let upgraded=false;for(const incumbent of incumbents){if(staffOverall(candidate)<staffOverall(incumbent)+6)break;const result=hireStaffMember(league,incumbent.teamId,candidate.id,{salary:candidate.askingSalary,years:2+((incumbent.teamId+candidate.age)%3)});if(result.completed){upgraded=true;break;}}if(!upgraded)break;}
  }
}

function advanceStaffForNewSeason(league,nextYear,userTeamId){
  ensureLeagueStaff(league);
  for(const member of league.staff){
    member.developmentChange=0;if(member.teamId===null)continue;const before=staffOverall(member),r=mulberry32((((league.seed||1)>>>0)^Number(String(member.id).replace("staff-",""))*1597334677^nextYear*3812015801)>>>0),room=Math.max(0,member.potential-before);let change=0;
    if(member.age<=47&&room>0&&r()<.28+room/42)change=r()<.18?2:1;else if(member.age>=62&&r()<.25+(member.age-62)*.07)change=-1;
    if(change)for(const key of Object.keys(member.attributes))member.attributes[key]=clamp(member.attributes[key]+change);member.developmentChange=staffOverall(member)-before;member.age++;
    if(member.contract){member.contract.yearsRemaining--;if(member.contract.yearsRemaining<=0){league.staffTransactions.push({seasonYear:nextYear,type:"Staff contract expired",teamId:member.teamId,staffId:member.id,staffName:member.name,role:member.role});member.teamId=null;member.contract=null;member.askingSalary=staffSalary(member.role,staffOverall(member));}else member.contract.expiresAfterSeason=nextYear+member.contract.yearsRemaining-1;}
  }
  league.seasonYear=nextYear;
  league.staffBuyouts=(league.staffBuyouts||[]).map(entry=>{const remainingYears=Math.max(0,entry.remainingYears-1);return {...entry,remainingYears,remainingAmount:money(entry.annualAmount*remainingYears)};}).filter(entry=>entry.remainingYears>0);
  runAiStaffMarket(league,userTeamId);
  for(const team of league.teams)syncTeamStaffRatings(league,team.id);
}

export function advanceToNextSeason(league,userTeamId=league.userTeamId){
  if(league.offseason?.stage!=="Ready for Next Season")return {completed:false,reason:"Complete free agency before starting the next season."};
  ensureLeagueHistory(league);ensureLeagueContracts(league);ensureLeagueTeamManagement(league);const nextYear=league.offseason.year,championId=league.postseason?.champion??null,awards=recordSeasonAwards(league,championId);
  league.seasonHistory??=[];league.seasonHistory.push({seasonYear:league.seasonYear,championId,awards:awards.map(award=>({...award})),standings:league.teams.map(team=>({teamId:team.id,wins:team.wins,losses:team.losses})),draftYear:league.draft?.year??nextYear,offseasonTransactions:league.offseason.transactions.map(transaction=>({...transaction}))});
  league.offseasonHistory??=[];league.offseasonHistory.push({year:league.offseason.year,decisions:league.offseason.decisions.map(decision=>({...decision})),transactions:league.offseason.transactions.map(transaction=>({...transaction}))});
  applyPlayerDevelopment(league,nextYear);
  for(const player of league.players){
    archiveCompletedSeason(player,league.seasonYear);if(player.draftYear!==nextYear){player.age++;player.experience=(player.experience||0)+1;}
    player.season={...emptyStatLine(),performances:[]};player.postseason={...emptyStatLine(),performances:[]};player.fatigue=0;player.injury=null;
    if(player.teamId!==null&&player.contract?.salaries){player.contract.salaries=player.contract.salaries.filter(row=>row.seasonYear>=nextYear);if(player.contract.salaries.length)finalizeContract(player.contract,nextYear);}
  }
  const retired=retirePlayers(league,nextYear);advanceStaffForNewSeason(league,nextYear,userTeamId);league.deadMoney=league.deadMoney.filter(entry=>entry.seasonYear>=nextYear);fillPostRetirementRosters(league);league.financialRules={...financialRulesForSeason(nextYear)};league.day=0;league.schedule=createSchedule();league.results=[];league.postseason=null;league.phase="Regular Season";league.draft=null;league.offseason=null;league.simulationSeed=(((league.simulationSeed||league.seed||1)>>>0)^nextYear*2246822519)>>>0;
  const seasonR=mulberry32(league.simulationSeed);for(const team of league.teams){team.wins=0;team.losses=0;team.pointsFor=0;team.pointsAgainst=0;team.seasonModifier=Math.max(-8,Math.min(8,normal(seasonR)*4));team.scoutingTargets={};team.scoutingKnowledge={};if(!team.manualDirection)team.declaredDirection=evaluateTeamDirection(league,team.id);}
  initializeDraftPicks(league);generateNextDraftClass(league,nextYear+1);league.preseasonRankingsByViewer={};league.powerRankingSnapshotsByViewer={};for(const viewer of league.teams){const ids=calculatePowerRankings(league,viewer.id,"All",true).map(item=>item.team.id);league.preseasonRankingsByViewer[viewer.id]=ids;league.powerRankingSnapshotsByViewer[viewer.id]={day:0,ids:[...ids]};}
  ensureLeagueTeamManagement(league);league.userTeamId=userTeamId;return {completed:true,seasonYear:nextYear,retired:retired.map(player=>player.id),awards};
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

export function ensureLeagueTeamManagement(league){
  for(const team of league.teams){team.rotationSettings??={offenseScheme:"Balanced",defenseScheme:"Balanced",minutes:{},manual:false};team.rotationSettings.minutes??={};if(!OFFENSIVE_SCHEMES.includes(team.rotationSettings.offenseScheme))team.rotationSettings.offenseScheme="Balanced";if(!DEFENSIVE_SCHEMES.includes(team.rotationSettings.defenseScheme))team.rotationSettings.defenseScheme="Balanced";}
  for(const player of league.players){player.fatigue=bound(player.fatigue??0,0,100);player.injury??=null;}
  league.teamManagementSystemVersion=1;return league;
}

function normalizeRotationMinutes(rows){
  if(!rows.length)return rows;let total=rows.reduce((sum,row)=>sum+row.minutes,0),guard=0;
  while(total!==240&&guard++<500){const direction=total<240?1:-1,candidates=rows.filter(row=>direction>0?row.minutes<48:row.minutes>0).sort((a,b)=>direction>0?(overall(b.player)-overall(a.player)):(overall(a.player)-overall(b.player)));if(!candidates.length)break;candidates[guard%candidates.length].minutes+=direction;total+=direction;}
  return rows.filter(row=>row.minutes>0);
}

export function setTeamRotation(league,teamId,{offenseScheme,defenseScheme,minutes}={}){
  ensureLeagueTeamManagement(league);const team=league.teams[teamId];if(!team)return {completed:false,reason:"Organization not found."};
  if(offenseScheme!==undefined&&!OFFENSIVE_SCHEMES.includes(offenseScheme))return {completed:false,reason:"Choose a valid offensive scheme."};if(defenseScheme!==undefined&&!DEFENSIVE_SCHEMES.includes(defenseScheme))return {completed:false,reason:"Choose a valid defensive scheme."};
  if(minutes){const rosterIds=new Set(league.players.filter(player=>player.teamId===teamId).map(player=>String(player.id))),clean={};for(const [id,value] of Object.entries(minutes)){const amount=Math.round(Number(value)||0);if(!rosterIds.has(String(id))||amount<0||amount>48)return {completed:false,reason:"Every minute entry must belong to the roster and fall between 0 and 48."};if(amount)clean[id]=amount;}const total=Object.values(clean).reduce((sum,value)=>sum+value,0);if(total!==240)return {completed:false,reason:`Rotation minutes must total 240. Current total: ${total}.`};if(Object.keys(clean).length<5)return {completed:false,reason:"At least five players must receive minutes."};team.rotationSettings.minutes=clean;team.rotationSettings.manual=true;}
  if(offenseScheme!==undefined)team.rotationSettings.offenseScheme=offenseScheme;if(defenseScheme!==undefined)team.rotationSettings.defenseScheme=defenseScheme;return {completed:true,settings:team.rotationSettings};
}

export function resetTeamRotation(league,teamId){ensureLeagueTeamManagement(league);const settings=league.teams[teamId]?.rotationSettings;if(!settings)return false;settings.minutes={};settings.manual=false;return true;}

export function teamRotation(league,teamId){
  ensureLeagueTeamManagement(league);const team=league.teams[teamId],healthy=league.players.filter(player=>player.teamId===teamId&&!(player.injury?.gamesRemaining>0)).sort((a,b)=>overall(b)-overall(a));if(!healthy.length)return [];
  let rows;if(team.rotationSettings.manual&&Object.values(team.rotationSettings.minutes||{}).reduce((sum,value)=>sum+Number(value||0),0)===240){rows=healthy.map(player=>({player,minutes:Math.max(0,Math.min(48,Math.round(team.rotationSettings.minutes[player.id]||0)))})).filter(row=>row.minutes>0);const missing=240-rows.reduce((sum,row)=>sum+row.minutes,0);if(missing>0){const extras=healthy.filter(player=>!rows.some(row=>row.player.id===player.id));for(const player of extras)rows.push({player,minutes:0});}}
  else{const slots=[35,34,33,32,30,24,20,16,10,6];rows=healthy.slice(0,10).map((player,index)=>({player,minutes:slots[index]||0}));}
  return normalizeRotationMinutes(rows);
}

function schemeRead(rotation,scheme,side){
  const avg=keys=>rotation.reduce((sum,row)=>sum+row.minutes*keys.reduce((inner,key)=>inner+(row.player.ratings[key]||50),0)/keys.length,0)/240;
  if(side==="offense"){if(scheme==="Pace & Space")return {offense:(avg(["threePoint","playmaking"])-72)*.09,pace:2.5};if(scheme==="Inside-Out")return {offense:(avg(["finishing","strength","playmaking"])-72)*.08,pace:-.8};if(scheme==="Pick-and-Roll")return {offense:(avg(["playmaking","ballHandle","finishing"])-72)*.085,pace:.4};if(scheme==="Transition")return {offense:(avg(["speed","stamina","finishing"])-72)*.08,pace:3.2};}
  if(side==="defense"){if(scheme==="Switching")return {defense:(avg(["perimeterDefense","speed","strength"])-72)*.08};if(scheme==="Drop Coverage")return {defense:(avg(["postDefense","blocks","defRebound"])-72)*.085};if(scheme==="Perimeter Pressure")return {defense:(avg(["perimeterDefense","steals","speed"])-72)*.08,pace:1};if(scheme==="Zone")return {defense:(avg(["postDefense","defRebound","perimeterDefense"])-72)*.07,pace:-1};}
  return {};
}

function teamMetrics(rotation,league,teamId){
  const weighted=keys=>rotation.reduce((sum,x)=>{const conditionPenalty=(x.player.fatigue||0)*.085;return sum+x.minutes*(keys.reduce((s,k)=>s+x.player.ratings[k],0)/keys.length-conditionPenalty);},0)/240,settings=league.teams[teamId]?.rotationSettings||{},offScheme=schemeRead(rotation,settings.offenseScheme,"offense"),defScheme=schemeRead(rotation,settings.defenseScheme,"defense");
  return {offense:weighted(["threePoint","midrange","finishing","playmaking"])+(offScheme.offense||0),defense:weighted(["perimeterDefense","postDefense","blocks","steals"])+(defScheme.defense||0),pace:96+(weighted(["speed","stamina"])-65)*.18+(offScheme.pace||0)+(defScheme.pace||0)};
}

function distributeInteger(total,weights){
  const sum=weights.reduce((a,b)=>a+b,0),raw=weights.map(w=>total*w/sum),out=raw.map(Math.floor);let left=total-out.reduce((a,b)=>a+b,0);
  raw.map((n,i)=>({i,f:n-Math.floor(n)})).sort((a,b)=>b.f-a.f).slice(0,left).forEach(x=>out[x.i]++);return out;
}

function updatePlayers(league,rotation,teamPoints,r,won,statKey="season"){
  const scoringWeights=rotation.map(x=>x.minutes*Math.max(20,(x.player.ratings.finishing+x.player.ratings.threePoint+x.player.ratings.midrange)/3-35)*(1+x.player.ratings.playmaking/260));
  const points=distributeInteger(teamPoints,scoringWeights);
  return rotation.map((x,i)=>{
    const p=x.player,threeShare=Math.max(.08,Math.min(.62,p.ratings.threePoint/(p.ratings.threePoint+p.ratings.finishing+25))),threeA=Math.max(0,Math.round(points[i]*threeShare/(.85+threeShare*.2))),threePct=Math.max(.2,Math.min(.49,.20+p.ratings.threePoint/620+normal(r)*.025)),threeM=Math.min(threeA,Math.round(threeA*threePct)),twoPoints=Math.max(0,points[i]-threeM*3),twoM=Math.round(twoPoints/2),twoPct=Math.max(.34,Math.min(.72,.34+(p.ratings.finishing+p.ratings.midrange)/850+normal(r)*.025)),twoA=Math.max(twoM,Math.round(twoM/twoPct)),fgm=threeM+twoM,fga=threeA+twoA;
    const reb=Math.max(0,Math.round(x.minutes*(p.ratings.offRebound+p.ratings.defRebound)/2/330*(p.position==="C"?1.35:p.position==="PF"?1.12:.72)+normal(r)*1.2));
    const ast=Math.max(0,Math.round(x.minutes*p.ratings.playmaking/99*(p.position==="PG"?.19:p.position==="SG"?.13:.08)+normal(r)));
    const statBoost=(points[i]-x.minutes*.42)*.20+(reb-4)*.16+(ast-3)*.18+(won?1:0);
    const performance=clamp(overall(p)+normal(r)*4.5+statBoost,40,99);
    const stats=p[statKey]||(p[statKey]={...emptyStatLine(),performances:[]});stats.performances??=[];
    Object.assign(stats,{gp:stats.gp+1,minutes:stats.minutes+x.minutes,points:stats.points+points[i],rebounds:stats.rebounds+reb,assists:stats.assists+ast,fgm:stats.fgm+fgm,fga:stats.fga+fga,threeM:stats.threeM+threeM,threeA:stats.threeA+threeA});
    stats.performances.push(performance);p.fatigue=bound((p.fatigue||0)+x.minutes*(1.08-(p.ratings.stamina||65)/180),0,100);
    if(!p.injury){const risk=.00055+Math.max(0,p.fatigue-62)*.000045+Math.max(0,68-(p.ratings.stamina||68))*.00002;if(r()<risk){const roll=r(),gamesRemaining=roll<.72?1+Math.floor(r()*3):roll<.96?4+Math.floor(r()*7):12+Math.floor(r()*19),type=gamesRemaining<=3?"Minor knock":gamesRemaining<=10?"Strain":"Significant injury";p.injury={type,gamesRemaining,occurredYear:league.seasonYear,occurredDay:league.day+1,justInjured:true};}}
    return {playerId:p.id,minutes:x.minutes,points:points[i],rebounds:reb,assists:ast,performance};
  });
}

function prepareGameDay(league){for(const player of league.players)player.fatigue=bound((player.fatigue||0)-(player.injury?.gamesRemaining>0?10:7),0,100);}
function finishGameDay(league){for(const player of league.players)if(player.injury?.gamesRemaining>0){if(player.injury.justInjured){delete player.injury.justInjured;continue;}player.injury.gamesRemaining--;if(player.injury.gamesRemaining<=0)player.injury=null;}}

export function simulateGame(league,game){
  const gameIndex=league.results.length,r=mulberry32((league.simulationSeed+gameIndex*7919+league.day*104729)>>>0),homeRotation=teamRotation(league,game.homeId),awayRotation=teamRotation(league,game.awayId),homeM=teamMetrics(homeRotation,league,game.homeId),awayM=teamMetrics(awayRotation,league,game.awayId);
  const home=league.teams[game.homeId],away=league.teams[game.awayId];
  ensureLeagueStaff(league);const homeCoach=league.staff.find(member=>member.teamId===home.id&&member.role==="Head Coach"),awayCoach=league.staff.find(member=>member.teamId===away.id&&member.role==="Head Coach"),homeCoachEdge=((homeCoach?.attributes?.offense||50)-(awayCoach?.attributes?.defense||50))*.045+((homeCoach?.attributes?.leadership||50)-50)*.012,awayCoachEdge=((awayCoach?.attributes?.offense||50)-(homeCoach?.attributes?.defense||50))*.045+((awayCoach?.attributes?.leadership||50)-50)*.012;
  let homeScore=Math.round(109+(homeM.offense-awayM.defense)*.42+(home.seasonModifier-away.seasonModifier)+(homeM.pace-100)*.12+homeCoachEdge+2.2+normal(r)*8),awayScore=Math.round(109+(awayM.offense-homeM.defense)*.42+(away.seasonModifier-home.seasonModifier)+(awayM.pace-100)*.12+awayCoachEdge+normal(r)*8);
  homeScore=Math.max(78,homeScore);awayScore=Math.max(78,awayScore);if(homeScore===awayScore)homeScore+=5+Math.floor(r()*8);
  const homeWon=homeScore>awayScore;home.wins+=homeWon?1:0;home.losses+=homeWon?0:1;away.wins+=homeWon?0:1;away.losses+=homeWon?1:0;home.pointsFor+=homeScore;home.pointsAgainst+=awayScore;away.pointsFor+=awayScore;away.pointsAgainst+=homeScore;
  const result={day:league.day+1,homeId:home.id,awayId:away.id,homeScore,awayScore,homeBox:updatePlayers(league,homeRotation,homeScore,r,homeWon),awayBox:updatePlayers(league,awayRotation,awayScore,r,!homeWon)};league.results.push(result);return result;
}

export function simulateNextDay(league){
  if(league.day>=league.schedule.length)return [];
  prepareGameDay(league);const results=league.schedule[league.day].map(game=>simulateGame(league,game));finishGameDay(league);simulateCollegeDate(league);league.day++;updateAiDirections(league);if(league.day%7===0)refreshPowerRankingSnapshots(league);return results;
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

export function gameDate(dayIndex,seasonYear=2026){const d=new Date(Date.UTC(seasonYear,9,20+dayIndex*2));return d.toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric",timeZone:"UTC"});}

export function simulateDays(league,count){const results=[];for(let i=0;i<count&&league.day<league.schedule.length;i++)results.push(...simulateNextDay(league));return results;}

function seededConference(league,conference){return league.teams.filter(t=>t.conference===conference).sort((a,b)=>(b.wins-a.wins)||((b.pointsFor-b.pointsAgainst)-(a.pointsFor-a.pointsAgainst))).map((team,i)=>({seed:i+1,teamId:team.id}));}
function playoffStrength(league,teamId){const roster=league.players.filter(p=>p.teamId===teamId).sort((a,b)=>overall(b)-overall(a)).slice(0,8);return average(roster,overall)+league.teams[teamId].seasonModifier*.3;}
function createSeries(a,b,bestOf=7){return {a,b,bestOf,aWins:0,bWins:0,winner:null,games:[]};}
function simulateSeriesGame(league,series){
  if(series.winner)return series;
  const p=league.postseason,gameNumber=p.gameNumber||0,r=mulberry32((league.simulationSeed+series.a.teamId*4099+series.b.teamId*6151+(p.round||0)*7919+gameNumber*104729)>>>0),homePattern=[true,true,false,false,true,false,true],seriesGame=(series.games?.length||0)+1,aHome=series.bestOf===1?true:homePattern[Math.min(homePattern.length-1,seriesGame-1)],homeId=aHome?series.a.teamId:series.b.teamId,awayId=aHome?series.b.teamId:series.a.teamId,homeRotation=teamRotation(league,homeId),awayRotation=teamRotation(league,awayId),homeM=teamMetrics(homeRotation,league,homeId),awayM=teamMetrics(awayRotation,league,awayId),home=league.teams[homeId],away=league.teams[awayId];
  let homeScore=Math.round(108+(homeM.offense-awayM.defense)*.42+(home.seasonModifier-away.seasonModifier)+(homeM.pace-100)*.12+2.2+normal(r)*8.5),awayScore=Math.round(108+(awayM.offense-homeM.defense)*.42+(away.seasonModifier-home.seasonModifier)+(awayM.pace-100)*.12+normal(r)*8.5);
  homeScore=Math.max(78,homeScore);awayScore=Math.max(78,awayScore);if(homeScore===awayScore)homeScore+=3+Math.floor(r()*8);
  const homeWon=homeScore>awayScore,winnerId=homeWon?homeId:awayId,result={postseason:true,stage:p.stage,round:p.round,gameNumber:gameNumber+1,seriesGame,homeId,awayId,homeScore,awayScore,winnerId,homeBox:updatePlayers(league,homeRotation,homeScore,r,homeWon,"postseason"),awayBox:updatePlayers(league,awayRotation,awayScore,r,!homeWon,"postseason")};
  p.results??=[];p.results.push(result);series.games??=[];series.games.push({postseason:true,stage:p.stage,round:p.round,gameNumber:gameNumber+1,seriesGame,homeId,awayId,homeScore,awayScore,winnerId});
  if(winnerId===series.a.teamId)series.aWins++;else series.bWins++;p.gameNumber=gameNumber+1;
  const need=Math.ceil((series.bestOf||7)/2);if(series.aWins>=need)series.winner=series.a;else if(series.bWins>=need)series.winner=series.b;return series;
}
function initialPlayIn(seeds){return [createSeries(seeds[6],seeds[7],1),createSeries(seeds[8],seeds[9],1)];}
function preparePlayInFinals(p){
  for(const conference of ["East","West"]){const games=p.current[conference];if(games?.length===2&&games.every(x=>x.winner)){const loser78=games[0].winner.teamId===games[0].a.teamId?games[0].b:games[0].a;games.push(createSeries(loser78,games[1].winner,1));}}
}
function roundSeries(seeds){return [[seeds[0],seeds[7]],[seeds[3],seeds[4]],[seeds[2],seeds[5]],[seeds[1],seeds[6]]].map(([a,b])=>createSeries(a,b));}
function stageComplete(p){const groups=Object.values(p.current||{});return groups.length>0&&groups.every(series=>series.length&&series.every(x=>x.winner))&&(p.stage!=="Play-In"||groups.every(series=>series.length===3));}
function archiveCurrent(p){p.completed.push({stage:p.stage,series:p.current});p.round++;}
function startPostseason(league){
  const east=seededConference(league,"East"),west=seededConference(league,"West");league.postseason={stage:"Play-In",round:0,gameNumber:0,results:[],seeds:{East:east,West:west},playIn:null,current:{East:initialPlayIn(east),West:initialPlayIn(west)},completed:[]};league.phase="Postseason";return league.postseason;
}
function advancePostseasonStage(league){
  const p=league.postseason;if(!p||!stageComplete(p))return p;archiveCurrent(p);
  if(p.stage==="Play-In"){
    p.playIn={};for(const conference of ["East","West"]){const games=p.current[conference];p.playIn[conference]={games,seven:{...games[0].winner,seed:7},eight:{...games[2].winner,seed:8}};}
    p.stage="First Round";p.current={East:roundSeries([...p.seeds.East.slice(0,6),p.playIn.East.seven,p.playIn.East.eight]),West:roundSeries([...p.seeds.West.slice(0,6),p.playIn.West.seven,p.playIn.West.eight])};
  }else if(p.stage==="First Round"){
    p.stage="Conference Semifinals";p.current={East:[createSeries(p.current.East[0].winner,p.current.East[1].winner),createSeries(p.current.East[2].winner,p.current.East[3].winner)],West:[createSeries(p.current.West[0].winner,p.current.West[1].winner),createSeries(p.current.West[2].winner,p.current.West[3].winner)]};
  }else if(p.stage==="Conference Semifinals"){
    p.stage="Conference Finals";p.current={East:[createSeries(p.current.East[0].winner,p.current.East[1].winner)],West:[createSeries(p.current.West[0].winner,p.current.West[1].winner)]};
  }else if(p.stage==="Conference Finals"){
    p.stage="Finals";p.current={Finals:[createSeries(p.current.East[0].winner,p.current.West[0].winner)]};
  }else if(p.stage==="Finals"){
    p.stage="Season Complete";p.champion=p.current.Finals[0].winner.teamId;p.current={};league.phase="Offseason";
  }
  return p;
}
function migrateLegacyPostseason(league){
  const p=league.postseason;if(!p)return;
  p.completed??=[];p.gameNumber??=0;p.round??=0;p.results??=[];
  if(p.stage==="Play-In"&&(!p.current||!Object.keys(p.current).length))p.current={East:initialPlayIn(p.seeds.East),West:initialPlayIn(p.seeds.West)};
  if(p.stage==="Play-In Results"){
    p.playIn??={East:{games:p.current.East,seven:{...p.current.East[0].winner,seed:7},eight:{...p.current.East[2].winner,seed:8}},West:{games:p.current.West,seven:{...p.current.West[0].winner,seed:7},eight:{...p.current.West[2].winner,seed:8}}};
    p.stage="First Round";p.current={East:roundSeries([...p.seeds.East.slice(0,6),p.playIn.East.seven,p.playIn.East.eight]),West:roundSeries([...p.seeds.West.slice(0,6),p.playIn.West.seven,p.playIn.West.eight])};
  }
  for(const list of Object.values(p.current||{}))for(const series of list){
    series.bestOf??=(p.stage==="Play-In"?1:7);series.games??=[];const missingScore=series.aWins===undefined&&series.bWins===undefined;series.aWins??=0;series.bWins??=0;
    if(missingScore&&series.winner){const clinch=Math.ceil(series.bestOf/2);if(series.winner.teamId===series.a.teamId)series.aWins=clinch;else series.bWins=clinch;}series.winner??=null;
  }
}
export function simulatePostseasonGame(league){
  if(league.day<82)return null;if(!league.postseason)return startPostseason(league);migrateLegacyPostseason(league);const p=league.postseason;if(p.stage==="Season Complete")return p;
  prepareGameDay(league);preparePlayInFinals(p);const order=p.stage==="Finals"?["Finals"]:["East","West"],active=order.flatMap(conference=>p.current[conference]||[]).filter(series=>!series.winner);
  for(const series of active)simulateSeriesGame(league,series);finishGameDay(league);
  preparePlayInFinals(p);if(stageComplete(p))advancePostseasonStage(league);return p;
}
export function simulatePostseasonRound(league){
  if(league.day<82)return null;if(!league.postseason)return startPostseason(league);migrateLegacyPostseason(league);const startStage=league.postseason.stage;let safety=0;while(league.postseason.stage===startStage&&league.postseason.stage!=="Season Complete"&&safety++<200)simulatePostseasonGame(league);return league.postseason;
}
export function advancePostseason(league){if(league.day<82)return null;if(!league.postseason)return startPostseason(league);return simulatePostseasonRound(league);}

export function performanceSummary(player){
  const s=player.season,recent=s.performances.slice(-10),avg=a=>a.length?Math.round(a.reduce((x,y)=>x+y,0)/a.length):null,currentForm=avg(recent),seasonImpact=avg(s.performances),historicalPeak=Math.max(...player.history.map(h=>h.performanceOvr||overall(player)),overall(player));
  let trajectory=player.age<=23?"Developing":player.age<=29?"Prime / stable":"Veteran / stable";
  if(player.age>=30&&currentForm!==null&&currentForm<overall(player)-4)trajectory="Possible decline";else if(player.age<=25&&currentForm!==null&&currentForm>overall(player)+3)trajectory="Trending upward";
  return {currentForm,seasonImpact,careerPeak:historicalPeak,trajectory};
}

function averagesFor(s=emptyStatLine()){const d=Math.max(1,s.gp);return {gp:s.gp,mpg:+(s.minutes/d).toFixed(1),ppg:+(s.points/d).toFixed(1),rpg:+(s.rebounds/d).toFixed(1),apg:+(s.assists/d).toFixed(1),fg:s.fga?+(s.fgm/s.fga*100).toFixed(1):0,three:s.threeA?+(s.threeM/s.threeA*100).toFixed(1):0};}
export function seasonAverages(player){return averagesFor(player.season);}
export function postseasonAverages(player){return averagesFor(player.postseason);}
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
  const viewer=league.teams[viewerId],isProspect=(league.prospects||[]).some(prospect=>prospect.id===player.id),own=viewerId===player.teamId;
  const seasonEvidence=Math.min(16,player.season.gp*.4);
  const targetStart=viewer.scoutingTargets?.[player.id],retainedDays=viewer.scoutingKnowledge?.[player.id]||0,activeDays=targetStart===undefined?0:Math.max(0,league.day-targetStart),targetDays=retainedDays+activeDays;
  const collegeEvidence=isProspect?Math.min(12,collegeAverages(player).gp*.4):0;
  const familiarity=own?Math.min(98,94+player.season.gp*.08):Math.min(97,50+player.experience*4+Math.abs(overall(player)-72)*.25+seasonEvidence+collegeEvidence);
  const department=scoutingDepartment(league,viewerId,player),skill=isProspect?(department.collegeSkill*.77+viewer.analytics*.08+department.potentialEval*.15):(department.proSkill*.77+viewer.analytics*.13+department.potentialEval*.10),speed=isProspect?department.collegeSpeed:department.proSpeed,effectiveTargetDays=targetDays*(.68+speed/100*.64);
  const baseConfidence=(familiarity+skill)/2,targetProgress=Math.min(1,effectiveTargetDays/55),targetCeiling=Math.min(96,88+skill*.075),confidence=clamp(own?baseConfidence:baseConfidence+(targetCeiling-baseConfidence)*Math.pow(targetProgress,.75),35,98);
  const estimates={};
  for(const [key] of ATTRIBUTES){
    const potentialPenalty=key==="potential"?(isProspect?5:11):0;
    const observationReduction=key==="potential"?Math.floor(player.season.gp/35):Math.floor(player.season.gp/20);
    const width=Math.max(1,Math.round((105-confidence)/7+potentialPenalty*(1-department.potentialEval/130))-observationReduction);
    const noiseR=mulberry32((league.seed+viewerId*10007+player.id*313+(key.length*97))>>>0);
    const center=clamp(player.ratings[key]+(noiseR()-.5)*width*(isProspect&&key==="potential"?.75:1.5));
    estimates[key]={low:clamp(center-width),high:clamp(center+width),true:player.ratings[key]};
  }
  const mid=k=>(estimates[k].low+estimates[k].high)/2;
  const weights=player.position==="PG"?["playmaking","ballHandle","speed","threePoint","perimeterDefense"]:player.position==="C"?["postDefense","blocks","defRebound","finishing","strength"]:["threePoint","finishing","perimeterDefense","speed","playmaking"];
  const perceivedOverall=clamp(weights.reduce((s,k)=>s+mid(k),0)/weights.length);
  const overallLow=clamp(weights.reduce((s,k)=>s+estimates[k].low,0)/weights.length);
  const overallHigh=clamp(weights.reduce((s,k)=>s+estimates[k].high,0)/weights.length);
  estimates.potential.low=Math.max(estimates.potential.low,perceivedOverall);
  if(isProspect)estimates.potential.high=Math.min(estimates.potential.high,draftClassPreset(league).scoutingCeiling);
  estimates.potential.high=Math.max(estimates.potential.high,estimates.potential.low);
  const perceivedPotential=mid("potential");
  const upside=Math.max(0,perceivedPotential-perceivedOverall);
  const marketScore=perceivedOverall+(player.age<=23?upside*.55:upside*.2);
  const marketTier=marketScore>=90?"Franchise asset":marketScore>=84?"Premium asset":marketScore>=78?"High-value starter":marketScore>=70?"Rotation value":"Developmental";
  return {confidence,estimates,perceived:perceivedOverall,overallLow,overallHigh,perceivedPotential,marketScore,marketTier,own,isProspect,targeted:targetStart!==undefined,targetDays,effectiveTargetDays:Math.round(effectiveTargetDays),scoutSpecialty:isProspect?department.collegeSpecialty:department.proSpecialty,retainedKnowledge:targetStart===undefined&&targetDays>0};
}

export function setScoutingTarget(league,viewerId,playerId,target=true){
  const viewer=league.teams[viewerId],targets=viewer.scoutingTargets||(viewer.scoutingTargets={}),knowledge=viewer.scoutingKnowledge||(viewer.scoutingKnowledge={}),isProspect=(league.prospects||[]).some(player=>player.id===playerId),player=isProspect?league.prospects.find(item=>item.id===playerId):league.players.find(item=>item.id===playerId);
  if(!player)return {completed:false,reason:"That player is no longer available to scout."};
  if(target){
    if(targets[playerId]!==undefined)return {completed:true,alreadyAssigned:true};
    const department=scoutingDepartment(league,viewerId),capacity=isProspect?department.collegeCapacity:department.proCapacity,assigned=Object.keys(targets).map(Number).filter(id=>isProspect?(league.prospects||[]).some(item=>item.id===id):league.players.some(item=>item.id===id)).length;
    if(assigned>=capacity)return {completed:false,reason:`Your ${isProspect?"college":"pro"} scouting staff can actively cover ${capacity} players at once. Stop another assignment or hire a faster department.`};
    targets[playerId]=league.day;return {completed:true,capacity,assigned:assigned+1};
  }
  if(targets[playerId]!==undefined){knowledge[playerId]=(knowledge[playerId]||0)+Math.max(0,league.day-targets[playerId]);delete targets[playerId];}
  return {completed:true,assigned:false};
}

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

function tradePositionNeed(league,teamId,position,excludedIds=new Set()){
  const players=league.players.filter(p=>p.teamId===teamId&&!excludedIds.has(p.id));
  const samePosition=players.filter(p=>p.position===position).sort((a,b)=>overall(b)-overall(a));
  const best=samePosition[0]?overall(samePosition[0]):55;
  const depth=samePosition.slice(0,2).length;
  if(best<68)return 10;
  if(best<74)return 6;
  if(best<80||depth<2)return 3;
  return best>=88&&depth>=2?-3:0;
}

function internalTradeReport(player){
  const current=overall(player),potential=Math.max(current,player.ratings.potential);
  return {perceived:current,perceivedPotential:potential,confidence:98};
}

function tradePlayerValue(league,evaluatorTeamId,player,{owned=false,direction="Evaluating",excludedIds=new Set()}={}){
  const report=owned?internalTradeReport(player):scoutingReport(league,evaluatorTeamId,player);
  const current=report.perceived,potential=Math.max(current,report.perceivedPotential),upside=Math.max(0,potential-current);
  const directionWeights={"Contending":{current:1.17,upside:.18,youth:.12},"Playoff push":{current:1.08,upside:.32,youth:.18},"Evaluating":{current:1,upside:.48,youth:.25},"Rebuilding":{current:.88,upside:.78,youth:.42}}[direction]||{current:1,upside:.45,youth:.2};
  const ageBonus=player.age<=22?8:player.age<=25?5:player.age<=29?1:player.age<=32?-3:-7;
  const need=tradePositionNeed(league,evaluatorTeamId,player.position,excludedIds);
  const fairSalary=estimatedMarketSalary(current,player.experience,league.financialRules?.salaryCap||financialRulesForSeason(league.seasonYear).salaryCap),salaryGap=fairSalary-player.contract.salary;
  const contractScore=Math.max(-10,Math.min(10,salaryGap*.45))*(1+Math.max(0,player.contract.years-1)*.08);
  const uncertaintyPenalty=owned?0:Math.max(0,78-report.confidence)*.18;
  const value=(current-50)*directionWeights.current+upside*directionWeights.upside+ageBonus*directionWeights.youth+need+contractScore-uncertaintyPenalty;
  return {value:+Math.max(1,value).toFixed(1),current,potential,confidence:report.confidence,need,contractScore};
}

function projectedPickSlot(league,teamId){
  const teams=[...league.teams].sort((a,b)=>{
    const aGames=a.wins+a.losses,bGames=b.wins+b.losses;
    if(aGames||bGames){
      const aPct=aGames?a.wins/aGames:0,bPct=bGames?b.wins/bGames:0;
      if(aPct!==bPct)return aPct-bPct;
      const aNet=aGames?(a.pointsFor-a.pointsAgainst)/aGames:0,bNet=bGames?(b.pointsFor-b.pointsAgainst)/bGames:0;
      return aNet-bNet;
    }
    const strength=team=>league.players.filter(p=>p.teamId===team.id).sort((x,y)=>overall(y)-overall(x)).slice(0,8).reduce((sum,p)=>sum+overall(p),0);
    return strength(a)-strength(b);
  });
  return Math.max(1,teams.findIndex(team=>team.id===teamId)+1);
}

function officialDraftEntry(league,pick){return league.draft?.order?.find(entry=>entry.pickId===pick.id)||null;}

function draftCapitalValue(league,pick){
  const official=officialDraftEntry(league,pick),slot=official?.roundPick??projectedPickSlot(league,pick.originalTeamId),yearsOut=Math.max(0,pick.year-((league.seasonYear||2026)+1));
  const base=pick.round===1?7+Math.pow(31-slot,1.16)*.68:2+(31-slot)*.16;
  const protectionMultiplier=pick.protection==="Unprotected"?1:(pick.protection||"").includes("Lottery") ? .82 : .9;
  return {value:+Math.max(1,base*Math.max(.7,1-yearsOut*.12)*protectionMultiplier).toFixed(1),slot,overallPick:official?.overallPick??null,official:Boolean(official)};
}

function tradePickValue(league,pick,direction="Evaluating"){
  const capital=draftCapitalValue(league,pick);
  const directionMultiplier={"Contending":.84,"Playoff push":.94,"Evaluating":1.06,"Rebuilding":1.2}[direction]||1;
  return {...capital,value:+Math.max(1,capital.value*directionMultiplier).toFixed(1)};
}

export function tradePickReport(league,evaluatorTeamId,pick){
  const direction=league.teams[evaluatorTeamId]?.declaredDirection||evaluateTeamDirection(league,evaluatorTeamId),value=tradePickValue(league,pick,direction),round=pick.round===1?"1st":"2nd";
  return {...value,label:`${pick.year} ${round} · ${value.official?`official #${value.overallPick}`:`projected #${value.slot}`} · ${pick.protection||"Unprotected"}`,tier:value.value>=28?"Premium pick":value.value>=18?"Strong pick":value.value>=10?"Useful pick":"Secondary pick"};
}

function syncDraftOrderOwnership(league){
  for(const entry of league.draft?.order||[]){const asset=league.draftPicks.find(pick=>pick.id===entry.pickId);if(asset)entry.teamId=asset.teamId;}
}

export function draftTradeOffers(league,userTeamId){
  const current=currentDraftPick(league);if(!current||current.teamId!==userTeamId||!current.pickId)return [];
  const requestedPick=league.draftPicks.find(pick=>pick.id===current.pickId);if(!requestedPick||requestedPick.used)return [];
  const requestedValue=draftCapitalValue(league,requestedPick).value,declined=new Set(league.draft.declinedOfferIds||[]),primaryByTeam=new Map();
  for(const entry of league.draft.order.slice(league.draft.currentPick+1,30)){
    if(entry.round!==1||entry.teamId===userTeamId||!entry.pickId||primaryByTeam.has(entry.teamId))continue;
    const asset=league.draftPicks.find(pick=>pick.id===entry.pickId);if(asset&&!asset.used&&asset.teamId===entry.teamId)primaryByTeam.set(entry.teamId,asset);
  }
  const candidates=[];
  for(const [teamId,primary] of primaryByTeam){
    const extras=league.draftPicks.filter(pick=>pick.teamId===teamId&&!pick.used&&pick.id!==primary.id&&pick.id!==requestedPick.id&&pick.year>=league.draft.year).sort((a,b)=>draftCapitalValue(league,b).value-draftCapitalValue(league,a).value).slice(0,8),packages=[[]];
    for(let i=0;i<extras.length;i++){packages.push([extras[i]]);for(let j=i+1;j<extras.length;j++)packages.push([extras[i],extras[j]]);}
    const options=packages.map(extra=>{const assets=[primary,...extra],value=assets.reduce((sum,pick)=>sum+draftCapitalValue(league,pick).value,0),ratio=value/requestedValue;return {assets,value,ratio,score:Math.abs(ratio-1.02)+extra.length*.015};}).filter(option=>option.ratio>=.82&&option.ratio<=1.42).sort((a,b)=>a.score-b.score||a.assets.length-b.assets.length);
    const best=options[0];if(!best)continue;
    const offeredPickIds=best.assets.map(pick=>pick.id),id=`draft-offer-${league.draft.year}-${current.overallPick}-${teamId}-${offeredPickIds.join("-")}`;if(declined.has(id))continue;
    const target=[...league.prospects].sort((a,b)=>aiDraftScore(league,teamId,b,current.overallPick)-aiDraftScore(league,teamId,a,current.overallPick))[0];
    candidates.push({id,teamId,requestedPickId:requestedPick.id,offeredPickIds,targetProspectId:target?.id??null,requestedValue,offeredValue:+best.value.toFixed(1),valueRatio:+best.ratio.toFixed(2),score:best.score});
  }
  return candidates.sort((a,b)=>a.score-b.score||a.teamId-b.teamId).slice(0,3).map(({score,...offer})=>offer);
}

export function acceptDraftTradeOffer(league,offerId,userTeamId){
  const offer=draftTradeOffers(league,userTeamId).find(item=>item.id===offerId),current=currentDraftPick(league);if(!offer||!current||current.pickId!==offer.requestedPickId)return {completed:false,reason:"That draft-night offer is no longer available."};
  const requested=league.draftPicks.find(pick=>pick.id===offer.requestedPickId),offered=offer.offeredPickIds.map(id=>league.draftPicks.find(pick=>pick.id===id));
  if(!requested||requested.used||requested.teamId!==userTeamId||offered.some(pick=>!pick||pick.used||pick.teamId!==offer.teamId))return {completed:false,reason:"Pick ownership changed before the trade could be completed."};
  requested.teamId=offer.teamId;for(const pick of offered)pick.teamId=userTeamId;syncDraftOrderOwnership(league);
  const transaction={id:`trade-${league.day}-${(league.tradeHistory?.length||0)+1}`,day:league.day,seasonYear:league.seasonYear,source:"Draft-night incoming offer",proposerId:offer.teamId,targetId:userTeamId,offeredPlayerIds:[],requestedPlayerIds:[],offeredPickIds:[...offer.offeredPickIds],requestedPickIds:[offer.requestedPickId],offeredSalary:0,requestedSalary:0,targetIncomingValue:offer.offeredValue,targetOutgoingValue:offer.requestedValue,valueRatio:offer.valueRatio,targetDirection:league.teams[userTeamId]?.declaredDirection||"Evaluating"};
  (league.tradeHistory||(league.tradeHistory=[])).push(transaction);league.draft.tradeDecisions??=[];league.draft.tradeDecisions.push({offerId,decision:"Accepted",pick:current.overallPick,teamId:offer.teamId});
  return {completed:true,offer,transaction};
}

export function declineDraftTradeOffer(league,offerId,userTeamId){
  const offer=draftTradeOffers(league,userTeamId).find(item=>item.id===offerId);if(!offer)return false;
  league.draft.declinedOfferIds??=[];league.draft.declinedOfferIds.push(offerId);league.draft.tradeDecisions??=[];league.draft.tradeDecisions.push({offerId,decision:"Declined",pick:currentDraftPick(league)?.overallPick??null,teamId:offer.teamId});return true;
}

export function tradeAssetOpinion(league,evaluatorTeamId,player,{owned=false}={}){
  const direction=league.teams[evaluatorTeamId]?.declaredDirection||evaluateTeamDirection(league,evaluatorTeamId),report=tradePlayerValue(league,evaluatorTeamId,player,{owned,direction});
  const roster=league.players.filter(p=>p.teamId===evaluatorTeamId).sort((a,b)=>overall(b)-overall(a)),best=roster[0],cornerstone=owned&&player.id===best?.id&&(overall(player)>=86||(player.age<=25&&player.ratings.potential>=90));
  const label=cornerstone?"Blockbuster-only cornerstone":owned?(report.value>=48?"Core player":report.value>=36?"Important rotation piece":report.value>=24?"Available at a premium":"Available"):(report.value>=48?"Premium target":report.value>=36?"Strong target":report.value>=26?"Useful target":report.value>=17?"Depth value":"Limited value");
  return {...report,label,cornerstone};
}

function packageValue(items){
  return [...items].sort((a,b)=>b.value-a.value).reduce((sum,item,index)=>sum+item.value*Math.max(.78,1-index*.06),0);
}

function tradePackageSalary(players){return +players.reduce((sum,p)=>sum+(p.contract?.salary||0),0).toFixed(1);}

function lineupFit(player,slot,current){
  const primary=player.position===slot,secondary=player.secondary===slot,distance=Math.abs(positions.indexOf(player.position)-positions.indexOf(slot));
  const penalty=primary?-1:secondary?1:distance===1?7:14;
  return {fit:+(current-penalty).toFixed(1),natural:primary||secondary};
}

function projectedRotation(league,evaluatorTeamId,roster,incomingIds=new Set()){
  const reports=new Map(roster.map(player=>{
    const report=incomingIds.has(player.id)?scoutingReport(league,evaluatorTeamId,player):internalTradeReport(player);
    return [player.id,{current:report.perceived,potential:Math.max(report.perceived,report.perceivedPotential),confidence:report.confidence}];
  }));
  const remaining=new Set(roster.map(player=>player.id)),assignments=new Map();
  const slotOrder=[...positions].sort((a,b)=>{
    const naturalCount=slot=>roster.filter(player=>lineupFit(player,slot,reports.get(player.id).current).natural).length;
    return naturalCount(a)-naturalCount(b)||positions.indexOf(a)-positions.indexOf(b);
  });
  for(const slot of slotOrder){
    const candidates=roster.filter(player=>remaining.has(player.id)).map(player=>{
      const report=reports.get(player.id),fit=lineupFit(player,slot,report.current);
      return {player,report,...fit};
    }).sort((a,b)=>b.fit-a.fit||b.report.potential-a.report.potential||a.player.id-b.player.id);
    if(candidates[0]){assignments.set(slot,candidates[0]);remaining.delete(candidates[0].player.id);}
  }
  let improved=true;
  while(improved){
    improved=false;
    for(let i=0;i<positions.length;i++)for(let j=i+1;j<positions.length;j++){
      const aSlot=positions[i],bSlot=positions[j],a=assignments.get(aSlot),b=assignments.get(bSlot);if(!a||!b)continue;
      const aSwap=lineupFit(a.player,bSlot,a.report.current),bSwap=lineupFit(b.player,aSlot,b.report.current);
      if(aSwap.fit+bSwap.fit>a.fit+b.fit+.5){assignments.set(aSlot,{...b,...bSwap});assignments.set(bSlot,{...a,...aSwap});improved=true;}
    }
  }
  const starters=positions.map(slot=>{
    const assignment=assignments.get(slot);if(!assignment)return {slot,playerId:null,name:"Open roster spot",current:0,potential:0,confidence:0,natural:false,fit:0,incoming:false};
    return {slot,playerId:assignment.player.id,name:assignment.player.name,current:assignment.report.current,potential:assignment.report.potential,confidence:assignment.report.confidence,natural:assignment.natural,fit:assignment.fit,incoming:incomingIds.has(assignment.player.id)};
  });
  const bench=roster.filter(player=>remaining.has(player.id)).map(player=>{
    const report=reports.get(player.id),flexibility=player.secondary!==player.position?1:0;
    return {playerId:player.id,name:player.name,position:player.position,current:report.current,potential:report.potential,confidence:report.confidence,incoming:incomingIds.has(player.id),rotationValue:+(report.current+flexibility+Math.max(0,report.potential-report.current)*.08).toFixed(1)};
  }).sort((a,b)=>b.rotationValue-a.rotationValue||a.playerId-b.playerId).slice(0,5);
  const starterAverage=starters.reduce((sum,p)=>sum+p.fit,0)/Math.max(1,starters.length),benchAverage=bench.reduce((sum,p)=>sum+p.current,0)/Math.max(1,bench.length),topEnd=[...starters].sort((a,b)=>b.current-a.current).slice(0,2).reduce((sum,p)=>sum+p.current,0)/2;
  const holes=starters.filter(p=>!p.natural||p.current<64).map(p=>p.slot),score=starterAverage*.66+benchAverage*.22+topEnd*.12-holes.length*2;
  return {score:+score.toFixed(1),starters,bench,holes,starterAverage:+starterAverage.toFixed(1),benchAverage:+benchAverage.toFixed(1),topEnd:+topEnd.toFixed(1)};
}

export function tradeRosterImpact(league,evaluatorTeamId,offeredPlayerIds=[],requestedPlayerIds=[]){
  const offeredSet=new Set(offeredPlayerIds.map(Number)),requestedSet=new Set(requestedPlayerIds.map(Number));
  const currentRoster=league.players.filter(player=>player.teamId===evaluatorTeamId),incoming=league.players.filter(player=>offeredSet.has(player.id)),afterRoster=[...currentRoster.filter(player=>!requestedSet.has(player.id)),...incoming];
  const before=projectedRotation(league,evaluatorTeamId,currentRoster),after=projectedRotation(league,evaluatorTeamId,afterRoster,offeredSet),afterStarterIds=new Set(after.starters.map(p=>p.playerId));
  const incomingStarters=after.starters.filter(p=>offeredSet.has(p.playerId)).map(p=>({slot:p.slot,playerId:p.playerId,name:p.name})),outgoingStarters=before.starters.filter(p=>requestedSet.has(p.playerId)).map(p=>({slot:p.slot,playerId:p.playerId,name:p.name}));
  const displacedStarters=before.starters.filter(p=>p.playerId&&!requestedSet.has(p.playerId)&&!afterStarterIds.has(p.playerId)).map(p=>({slot:p.slot,playerId:p.playerId,name:p.name})),newHoles=after.holes.filter(slot=>!before.holes.includes(slot)),filledHoles=before.holes.filter(slot=>!after.holes.includes(slot)),delta=+(after.score-before.score).toFixed(1),benchDelta=+(after.benchAverage-before.benchAverage).toFixed(1),topEndDelta=+(after.topEnd-before.topEnd).toFixed(1),notes=[];
  if(incomingStarters.length)notes.push(`${incomingStarters.map(p=>`${p.name} at ${p.slot}`).join(" and ")} would enter the projected starting five.`);
  if(outgoingStarters.length)notes.push(`${outgoingStarters.map(p=>`${p.name} at ${p.slot}`).join(" and ")} currently occupies a projected starting role.`);
  if(newHoles.length)notes.push(`The post-trade roster would lack a natural ${newHoles.join("/")} option in the projected starting five.`);
  if(filledHoles.length)notes.push(`The trade fills a projected ${filledHoles.join("/")} lineup hole.`);
  if(benchDelta>=1.5)notes.push(`The projected second unit improves by ${benchDelta.toFixed(1)} points.`);else if(benchDelta<=-1.5)notes.push(`The projected second unit declines by ${Math.abs(benchDelta).toFixed(1)} points.`);
  if(!notes.length)notes.push("The projected starting five and second unit remain broadly stable.");
  return {before,after,delta,benchDelta,topEndDelta,incomingStarters,outgoingStarters,displacedStarters,newHoles,filledHoles,notes};
}

export function evaluateTrade(league,proposerId,targetId,offeredPlayerIds=[],requestedPlayerIds=[],offeredPickIds=[],requestedPickIds=[]){
  initializeDraftPicks(league);ensureLeagueFinancials(league);
  const proposer=league.teams[proposerId],target=league.teams[targetId],offeredIds=[...new Set(offeredPlayerIds.map(Number))],requestedIds=[...new Set(requestedPlayerIds.map(Number))],offeredPicksIds=[...new Set(offeredPickIds.map(String))],requestedPicksIds=[...new Set(requestedPickIds.map(String))];
  const offered=offeredIds.map(id=>league.players.find(p=>p.id===id)),requested=requestedIds.map(id=>league.players.find(p=>p.id===id)),offeredPicks=offeredPicksIds.map(id=>league.draftPicks.find(p=>p.id===id)),requestedPicks=requestedPicksIds.map(id=>league.draftPicks.find(p=>p.id===id));
  const hasEachSide=offered.length+offeredPicks.length>0&&requested.length+requestedPicks.length>0,wrongOwnership=offered.some(p=>!p||p.teamId!==proposerId)||requested.some(p=>!p||p.teamId!==targetId)||offeredPicks.some(p=>!p||p.used||p.teamId!==proposerId)||requestedPicks.some(p=>!p||p.used||p.teamId!==targetId),invalid=!proposer||!target||proposerId===targetId||!hasEachSide||wrongOwnership;
  if(invalid)return {accepted:false,verdict:"Invalid offer",summary:wrongOwnership?"This offer contains an asset that no longer belongs to the listed team. Clear the offer and rebuild it against the current opponent.":"Add at least one player or draft pick from each team before submitting.",reasons:[wrongOwnership?"The selected opponent or an asset's ownership changed after this proposal was created.":"Both teams must send at least one trade asset."],offeredSalary:tradePackageSalary(offered.filter(Boolean)),requestedSalary:tradePackageSalary(requested.filter(Boolean))};
  const proposerCount=league.players.filter(p=>p.teamId===proposerId).length-offered.length+requested.length,targetCount=league.players.filter(p=>p.teamId===targetId).length-requested.length+offered.length;
  if(proposerCount<12||proposerCount>18||targetCount<12||targetCount>18)return {accepted:false,verdict:"Roster limit",summary:"This trade would leave a team outside the prototype's 12–18 player roster limits.",reasons:[`${proposer.name} would have ${proposerCount} players and ${target.name} would have ${targetCount}.`],offeredSalary:tradePackageSalary(offered),requestedSalary:tradePackageSalary(requested)};
  const salaryMatch=validateTradeSalary(league,proposerId,targetId,offeredIds,requestedIds);
  const direction=target.declaredDirection||evaluateTeamDirection(league,targetId),requestedSet=new Set(requestedIds);
  const incoming=offered.map(player=>({player,...tradePlayerValue(league,targetId,player,{direction,excludedIds:requestedSet})})).concat(offeredPicks.map(pick=>({pick,...tradePickValue(league,pick,direction)})));
  const outgoing=requested.map(player=>({player,...tradePlayerValue(league,targetId,player,{owned:true,direction,excludedIds:requestedSet})})).concat(requestedPicks.map(pick=>({pick,...tradePickValue(league,pick,direction)})));
  let incomingValue=packageValue(incoming),outgoingValue=packageValue(outgoing);
  const targetRoster=league.players.filter(p=>p.teamId===targetId).sort((a,b)=>overall(b)-overall(a)),best=targetRoster[0],protectedPlayers=requested.filter(p=>p.id===best?.id&&(overall(p)>=86||(p.age<=25&&p.ratings.potential>=90)));
  const protectedBaseValue=Math.max(0,...outgoing.filter(x=>x.player&&protectedPlayers.some(p=>p.id===x.player.id)).map(x=>x.value)),strongestIncomingPlayer=Math.max(0,...incoming.filter(x=>x.player).map(x=>x.value)),premiumIncomingPick=incoming.some(x=>x.pick&&x.pick.round===1&&x.slot<=10&&x.value>=18),cornerstoneFoundation=!protectedPlayers.length||strongestIncomingPlayer>=protectedBaseValue*.85||premiumIncomingPick;
  if(protectedPlayers.length)outgoingValue*=1.38;
  const rosterImpact=tradeRosterImpact(league,targetId,offeredIds,requestedIds),rotationWeight={"Contending":2.2,"Playoff push":1.55,"Evaluating":1,"Rebuilding":.55}[direction]||1,rotationAdjustment=Math.max(-12,Math.min(12,rosterImpact.delta*rotationWeight)),adjustedIncomingValue=Math.max(1,incomingValue+rotationAdjustment),severeRotationProblem=(direction==="Contending"||direction==="Playoff push")&&(rosterImpact.delta<=-4||(rosterImpact.newHoles.length>0&&rosterImpact.delta<=-1.5));
  const gap=adjustedIncomingValue-outgoingValue,ratio=adjustedIncomingValue/Math.max(1,outgoingValue),lowConfidence=incoming.some(x=>x.confidence<70),baseThreshold=protectedPlayers.length?(lowConfidence?1.16:1.12):(lowConfidence?1.08:1.03),threshold=baseThreshold+(severeRotationProblem?.1:rosterImpact.newHoles.length&&direction!=="Rebuilding"?.04:0),aiAccepted=ratio>=threshold&&cornerstoneFoundation,accepted=aiAccepted&&salaryMatch.valid;
  const counterofferEligible=!accepted&&(aiAccepted||((protectedPlayers.length?ratio>=.5&&cornerstoneFoundation:ratio>=.72))),negotiationGap=accepted?"Agreement":!salaryMatch.valid&&aiAccepted?"Salary adjustment":ratio>=.9?"Close":ratio>=.72?"Meaningful gap":counterofferEligible?"Far apart":"No credible foundation";
  const close=!aiAccepted&&ratio>=.9,reasons=[...salaryMatch.reasons];
  if(protectedPlayers.length)reasons.push(`${protectedPlayers.map(p=>p.name).join(" and ")} is protected as a cornerstone, so ${target.name} requires a clear premium to move him.`);
  if(protectedPlayers.length&&!cornerstoneFoundation)reasons.push(`${target.name} will not trade a cornerstone for quantity. A serious offer must begin with a premium young player or a projected top-10 first-round pick.`);
  const strongNeeds=incoming.filter(x=>x.need>=6);if(strongNeeds.length)reasons.push(`${strongNeeds.map(x=>x.player.name).join(" and ")} would address a clear ${strongNeeds[0].player.position} need.`);
  const badContracts=incoming.filter(x=>x.contractScore<=-5);if(badContracts.length)reasons.push(`${badContracts.map(x=>x.player.name).join(" and ")} carries a contract the front office views as expensive for the projected role.`);
  const goodContracts=incoming.filter(x=>x.contractScore>=5);if(goodContracts.length)reasons.push(`${goodContracts.map(x=>x.player.name).join(" and ")} is viewed as useful value on the current contract.`);
  if(offeredPicks.length)reasons.push(`${target.name} values ${offeredPicks.map(p=>tradePickReport(league,targetId,p).label).join("; ")} as part of the incoming package.`);
  if(requestedPicks.length)reasons.push(`${target.name} requires value for the draft capital it would send out.`);
  reasons.push(...rosterImpact.notes);
  if(rosterImpact.delta>=1.5)reasons.push(`${target.name} projects the trade to improve its 10-man rotation.`);else if(rosterImpact.delta<=-1.5)reasons.push(`${target.name} projects the trade to weaken its 10-man rotation.`);else reasons.push(`${target.name} projects its rotation to remain essentially even.`);
  if(severeRotationProblem)reasons.push(`${target.name} will demand an additional premium because this construction weakens a win-now rotation or creates a starting-lineup hole.`);
  if(direction==="Rebuilding")reasons.push(`${target.name} is rebuilding, so youth and projected upside carry extra weight.`);else if(direction==="Contending")reasons.push(`${target.name} is contending, so proven current impact matters more than distant upside.`);else reasons.push(`${target.name}'s ${direction.toLowerCase()} direction produces a balanced view of present value and future upside.`);
  if(lowConfidence)reasons.push("The front office has limited confidence in at least one incoming evaluation and applies an uncertainty premium.");
  if(!aiAccepted)reasons.push(counterofferEligible?(close?"The value is close, but the AI GM still wants one more useful asset or a better roster fit.":ratio<.72?"The sides remain far apart, but the incoming headline asset is credible enough for the AI GM to name its price.":"The incoming package does not replace enough of the talent, fit, and control being sent out."):"The package lacks the premium foundation required for the AI GM to continue negotiations or issue a counteroffer.");
  else if(!salaryMatch.valid)reasons.push("The other GM accepts the basketball value, but the player salaries must be reworked before the transaction can be completed.");
  const verdict=accepted?"Accepted":!salaryMatch.valid&&aiAccepted?"Salary mismatch":counterofferEligible?(close?"Close — add value":"Rejected"):"Rejected — no counteroffer";
  const summary=accepted?`${target.name} believes this package improves its roster plan and will accept the trade.`:!salaryMatch.valid&&aiAccepted?`${target.name} accepts the value, but this construction is not legal under the salary-cap trade rules.`:counterofferEligible?(close?`${target.name} sees a workable foundation, but the current offer is not quite enough.`:`${target.name} does not believe the return justifies the assets it would give up.`):`${target.name} does not view this package as a credible basis for a negotiation.`;
  return {accepted,verdict,summary,reasons,offeredSalary:tradePackageSalary(offered),requestedSalary:tradePackageSalary(requested),salaryMatch,targetIncomingValue:+adjustedIncomingValue.toFixed(1),targetIncomingAssetValue:+incomingValue.toFixed(1),targetOutgoingValue:+outgoingValue.toFixed(1),rotationAdjustment:+rotationAdjustment.toFixed(1),valueRatio:+ratio.toFixed(3),negotiationGap,direction,proposerCount,targetCount,counterofferEligible,cornerstoneRequested:protectedPlayers.length>0,cornerstoneFoundation,severeRotationProblem,rosterImpact};
}

export function buildTradeCounteroffer(league,proposerId,targetId,offeredPlayerIds=[],requestedPlayerIds=[],offeredPickIds=[],requestedPickIds=[]){
  initializeDraftPicks(league);
  const original={
    offeredPlayerIds:[...new Set(offeredPlayerIds.map(Number))],
    requestedPlayerIds:[...new Set(requestedPlayerIds.map(Number))],
    offeredPickIds:[...new Set(offeredPickIds.map(String))],
    requestedPickIds:[...new Set(requestedPickIds.map(String))]
  };
  const initial=evaluateTrade(league,proposerId,targetId,original.offeredPlayerIds,original.requestedPlayerIds,original.offeredPickIds,original.requestedPickIds);
  if(initial.accepted||initial.verdict==="Invalid offer"||initial.verdict==="Roster limit"||initial.counterofferEligible===false)return null;
  const targetRoster=league.players.filter(p=>p.teamId===targetId).sort((a,b)=>overall(b)-overall(a)),protectedRequestedIds=new Set(initial.cornerstoneRequested&&initial.cornerstoneFoundation?original.requestedPlayerIds.filter(id=>id===targetRoster[0]?.id):[]);

  const variants=[];
  const keyOf=x=>[x.offeredPlayerIds.join(","),x.requestedPlayerIds.join(","),x.offeredPickIds.join(","),x.requestedPickIds.join(",")].join("|");
  const originalKey=keyOf(original),seen=new Set([originalKey]);
  const consider=(candidate,changeCount=1)=>{
    const normalized={
      offeredPlayerIds:[...new Set(candidate.offeredPlayerIds.map(Number))],
      requestedPlayerIds:[...new Set(candidate.requestedPlayerIds.map(Number))],
      offeredPickIds:[...new Set(candidate.offeredPickIds.map(String))],
      requestedPickIds:[...new Set(candidate.requestedPickIds.map(String))]
    },key=keyOf(normalized);
    if(seen.has(key))return;seen.add(key);
    if([...protectedRequestedIds].some(id=>!normalized.requestedPlayerIds.includes(id)))return;
    const evaluation=evaluateTrade(league,proposerId,targetId,normalized.offeredPlayerIds,normalized.requestedPlayerIds,normalized.offeredPickIds,normalized.requestedPickIds);
    if(!evaluation.accepted)return;
    const surplus=Math.max(0,evaluation.targetIncomingValue-evaluation.targetOutgoingValue);
    variants.push({...normalized,targetId,evaluation,changeCount,score:surplus+changeCount*1.5});
  };
  const withChange=(field,value,mode="add")=>{
    const candidate={...original,[field]:[...original[field]]};
    candidate[field]=mode==="remove"?candidate[field].filter(id=>id!==value):[...candidate[field],value];
    return candidate;
  };

  const availablePlayers=league.players.filter(p=>p.teamId===proposerId&&!original.offeredPlayerIds.includes(p.id));
  const availablePicks=league.draftPicks.filter(p=>p.teamId===proposerId&&!p.used&&!original.offeredPickIds.includes(p.id));
  for(const player of availablePlayers)consider(withChange("offeredPlayerIds",player.id));
  for(const pick of availablePicks)consider(withChange("offeredPickIds",pick.id));

  const requestedAssetCount=original.requestedPlayerIds.length+original.requestedPickIds.length;
  if(requestedAssetCount>1){
    for(const id of original.requestedPlayerIds)consider(withChange("requestedPlayerIds",id,"remove"));
    for(const id of original.requestedPickIds)consider(withChange("requestedPickIds",id,"remove"));
  }

  const targetPlayers=league.players.filter(p=>p.teamId===targetId&&!original.requestedPlayerIds.includes(p.id));
  for(const player of targetPlayers)consider(withChange("requestedPlayerIds",player.id));
  for(const outgoingId of original.requestedPlayerIds){
    for(const replacement of targetPlayers){
      const candidate={...original,requestedPlayerIds:original.requestedPlayerIds.map(id=>id===outgoingId?replacement.id:id)};
      consider(candidate,2);
    }
  }
  const targetPicks=league.draftPicks.filter(p=>p.teamId===targetId&&!p.used&&!original.requestedPickIds.includes(p.id));
  for(const outgoingId of original.requestedPickIds){
    for(const replacement of targetPicks){
      const candidate={...original,requestedPickIds:original.requestedPickIds.map(id=>id===outgoingId?replacement.id:id)};
      consider(candidate,2);
    }
  }

  if(!variants.length){
    const additions=[
      ...availablePlayers.map(player=>({field:"offeredPlayerIds",id:player.id,value:tradePlayerValue(league,targetId,player,{direction:initial.direction}).value})),
      ...availablePicks.map(pick=>({field:"offeredPickIds",id:pick.id,value:tradePickValue(league,pick,initial.direction).value}))
    ].sort((a,b)=>a.value-b.value).slice(0,14);
    for(let i=0;i<additions.length;i++)for(let j=i+1;j<additions.length;j++){
      const candidate={...original,offeredPlayerIds:[...original.offeredPlayerIds],offeredPickIds:[...original.offeredPickIds]};
      candidate[additions[i].field].push(additions[i].id);candidate[additions[j].field].push(additions[j].id);consider(candidate,2);
    }
  }

  if(!variants.length)return null;
  variants.sort((a,b)=>a.score-b.score||a.changeCount-b.changeCount||a.evaluation.targetIncomingValue-b.evaluation.targetIncomingValue);
  const best=variants[0];delete best.score;delete best.changeCount;return best;
}

export function executeTrade(league,proposerId,targetId,offeredPlayerIds=[],requestedPlayerIds=[],offeredPickIds=[],requestedPickIds=[]){
  const evaluation=evaluateTrade(league,proposerId,targetId,offeredPlayerIds,requestedPlayerIds,offeredPickIds,requestedPickIds);if(!evaluation.accepted)return {completed:false,evaluation};
  const offeredIds=[...new Set(offeredPlayerIds.map(Number))],requestedIds=[...new Set(requestedPlayerIds.map(Number))],offeredPicksIds=[...new Set(offeredPickIds.map(String))],requestedPicksIds=[...new Set(requestedPickIds.map(String))];
  for(const player of league.players){if(offeredIds.includes(player.id))player.teamId=targetId;else if(requestedIds.includes(player.id))player.teamId=proposerId;}
  for(const pick of league.draftPicks){if(offeredPicksIds.includes(pick.id))pick.teamId=targetId;else if(requestedPicksIds.includes(pick.id))pick.teamId=proposerId;}
  syncDraftOrderOwnership(league);
  const transaction={id:`trade-${league.day}-${(league.tradeHistory?.length||0)+1}`,day:league.day,seasonYear:league.seasonYear,proposerId,targetId,offeredPlayerIds:offeredIds,requestedPlayerIds:requestedIds,offeredPickIds:offeredPicksIds,requestedPickIds:requestedPicksIds,offeredSalary:evaluation.offeredSalary,requestedSalary:evaluation.requestedSalary,targetIncomingValue:evaluation.targetIncomingValue,targetOutgoingValue:evaluation.targetOutgoingValue,valueRatio:evaluation.valueRatio,targetDirection:evaluation.direction,targetRotationBefore:evaluation.rosterImpact?.before.score,targetRotationAfter:evaluation.rosterImpact?.after.score,targetRotationDelta:evaluation.rosterImpact?.delta,targetProjectedStarters:evaluation.rosterImpact?.after.starters.map(({slot,playerId,name})=>({slot,playerId,name}))};
  (league.tradeHistory||(league.tradeHistory=[])).push(transaction);
  return {completed:true,evaluation,transaction};
}

export function inches(n){return `${Math.floor(n/12)}'${n%12}\"`;}
