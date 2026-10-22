const ACTIVE = new Set(['CONTEXT_ADMITTED','RUNNING','WAITING_TOOL']);
const REVIEW = new Set(['VERIFYING','WAITING_HUMAN','HELD_UNKNOWN']);
const BLOCKED = new Set(['BLOCKED','FAILED_RECOVERABLE']);
const READY = new Set(['READY']);
const DONE = new Set(['COMPLETED','CONVERGED','CLOSED']);
const ARCHIVE = new Set(['SUPERSEDED','CANCELLED']);
const CURRENT = new Set([...ACTIVE,...REVIEW,...BLOCKED]);

function freeze(value){if(Array.isArray(value))return Object.freeze(value.map(freeze));if(value&&typeof value==='object'){for(const key of Object.keys(value))value[key]=freeze(value[key]);return Object.freeze(value)}return value}
function byRef(project){return new Map((project?.items||[]).map(item=>[item.workRef,item]))}
function roots(project){return new Set(project?.project?.rootWorkRefs||[])}
function incomingMap(project){const map=new Map();for(const item of project?.items||[]){for(const dep of item.dependencyRefs||[]){if(!map.has(dep))map.set(dep,[]);map.get(dep).push(item.workRef)}}return map}
function stateAt(item){const exact=[...(item?.transitionHistory||[])].reverse().find(entry=>entry.nextState===item.state);if(exact?.createdAt)return{at:exact.createdAt,coverage:'transition',actorRef:exact.actorRef||null};if(item?.updatedAt)return{at:item.updatedAt,coverage:'snapshot',actorRef:null};return null}
function terminal(item){return DONE.has(item.state)||ARCHIVE.has(item.state)}
function current(item){return CURRENT.has(item.state)}

export function topScopeRef(project, workRef){
  const map=byRef(project), rootSet=roots(project);
  let item=map.get(workRef);if(!item)return workRef;
  if(rootSet.has(item.workRef))return item.workRef;
  let last=item;
  while(item?.parentWorkRefOrNull){
    if(rootSet.has(item.parentWorkRefOrNull))return last.workRef;
    const parent=map.get(item.parentWorkRefOrNull);if(!parent)break;last=parent;item=parent;
  }
  return last.workRef;
}

function descendants(project, workRef){
  const map=byRef(project), out=[], stack=[...(map.get(workRef)?.childWorkRefs||[])], seen=new Set();
  while(stack.length){const ref=stack.shift();if(seen.has(ref))continue;seen.add(ref);const item=map.get(ref);if(!item)continue;out.push(item);stack.push(...(item.childWorkRefs||[]))}
  return out;
}

function hasCurrentDescendant(project,item){return descendants(project,item.workRef).some(current)}

export function deepestCurrentFrontiers(project){
  return freeze((project?.items||[])
    .filter(item=>current(item)&&!hasCurrentDescendant(project,item))
    .sort((a,b)=>a.workRef.localeCompare(b.workRef)));
}

function nearestMatchingDescendants(project, workRef, predicate){
  const map=byRef(project), result=[], queue=[...(map.get(workRef)?.childWorkRefs||[])];
  while(queue.length){
    const ref=queue.shift(),item=map.get(ref);if(!item)continue;
    if(predicate(item)){result.push(item);continue}
    queue.push(...(item.childWorkRefs||[]));
  }
  return result;
}

function uniqueItems(items){const map=new Map();for(const item of items)if(item)map.set(item.workRef,item);return [...map.values()]}

function siblingFallback(project,item,direction){
  const map=byRef(project),parent=map.get(item.parentWorkRefOrNull),siblings=(parent?.childWorkRefs||[]).map(ref=>map.get(ref)).filter(Boolean),index=siblings.findIndex(x=>x.workRef===item.workRef);
  if(index<0)return null;
  const candidate=siblings[index+direction]||null;
  return candidate;
}

function priorFor(project,currentItems){
  const map=byRef(project), candidates=[];
  for(const item of currentItems){
    for(const ref of item.dependencyRefs||[]){const dep=map.get(ref);if(dep&&DONE.has(dep.state))candidates.push(dep)}
    if(!candidates.length){const fallback=siblingFallback(project,item,-1);if(fallback&&DONE.has(fallback.state))candidates.push(fallback)}
  }
  return uniqueItems(candidates);
}

function nextCandidates(project,currentItems){
  const incoming=incomingMap(project),map=byRef(project), dependency=[],structural=[];
  for(const item of currentItems){
    for(const ref of incoming.get(item.workRef)||[]){const next=map.get(ref);if(next&&!terminal(next))dependency.push(next)}
    structural.push(...nearestMatchingDescendants(project,item.workRef,candidate=>!terminal(candidate)&&(READY.has(candidate.state)||candidate.state==='WAITING_DEPENDENCIES'||candidate.state==='PLAN_VALIDATED')));
  }
  const dep=uniqueItems(dependency);
  const depRefs=new Set(dep.map(x=>x.workRef));
  return {
    dependency:dep,
    structural:uniqueItems(structural).filter(x=>!depRefs.has(x.workRef)),
  };
}

function latestCompleted(items){
  let winner=null,winnerAt=-Infinity;
  for(const item of items){if(!DONE.has(item.state))continue;const ev=stateAt(item);const at=ev?Date.parse(ev.at):NaN;if(Number.isFinite(at)&&at>winnerAt){winner=item;winnerAt=at}}
  return winner;
}

function readyFrontiers(project){
  return (project?.items||[]).filter(item=>READY.has(item.state)&&!descendants(project,item.workRef).some(x=>READY.has(x.state)||current(x)));
}

function workfrontKey(project,item){return topScopeRef(project,item.workRef)}

function rankRow(row){
  const states=row.currentItems.map(x=>x.state);
  if(states.some(x=>REVIEW.has(x)))return 0;
  if(states.some(x=>BLOCKED.has(x)))return 1;
  if(states.some(x=>ACTIVE.has(x)))return 2;
  if(states.some(x=>READY.has(x)))return 3;
  return 4;
}

export function projectWorkfronts(project,{recentHours=0,nowMs=Date.now(),maxRows=6}={}){
  const map=byRef(project), currentFrontiers=deepestCurrentFrontiers(project), ready=readyFrontiers(project);
  let anchors=[...currentFrontiers];
  if(currentFrontiers.length){
    const currentScopes=new Set(currentFrontiers.map(item=>workfrontKey(project,item)));
    anchors.push(...ready.filter(item=>!currentScopes.has(workfrontKey(project,item))));
  }else{
    anchors=[...ready];
  }
  if(!anchors.length){const latest=latestCompleted(project?.items||[]);if(latest)anchors=[latest]}

  const groups=new Map();
  for(const item of anchors){
    const key=workfrontKey(project,item);
    if(!groups.has(key))groups.set(key,[]);
    groups.get(key).push(item);
  }

  const rows=[];
  for(const [scopeRef,currentItems] of groups){
    const scope=map.get(scopeRef)||currentItems[0];
    const priorItems=priorFor(project,currentItems);
    const next=nextCandidates(project,currentItems);
    const scopeItems=[scope,...descendants(project,scope.workRef)];
    const recentItems=recentHours>0?scopeItems.filter(item=>{
      const ev=stateAt(item);if(ev?.coverage!=='transition')return false;
      const age=nowMs-Date.parse(ev.at);return age>=0&&age<=recentHours*3600000&&!currentItems.some(x=>x.workRef===item.workRef);
    }):[];
    rows.push({
      scopeRef,
      label:scope.label,
      scopeState:scope.state,
      currentItems,
      priorItems,
      nextDependencyItems:next.dependency,
      nextStructuralItems:next.structural,
      recentItems,
      basis:currentItems.some(current)?'CURRENT':currentItems.some(x=>READY.has(x.state))?'READY':'LATEST_COMPLETED',
    });
  }

  rows.sort((a,b)=>rankRow(a)-rankRow(b)||a.label.localeCompare(b.label));
  return freeze({
    projectRef:project.project.projectRef,
    rows:rows.slice(0,maxRows),
    hiddenRowCount:Math.max(0,rows.length-maxRows),
    currentFrontierCount:currentFrontiers.length,
    recentHours,
  });
}

function sequenceSuccessors(project, refs, scopeRef, visited){
  const map=byRef(project),incoming=incomingMap(project),dependency=[],structural=[];
  for(const ref of refs){
    for(const nextRef of incoming.get(ref)||[]){const item=map.get(nextRef);if(item&&!visited.has(nextRef)&&!terminal(item)&&topScopeRef(project,item.workRef)===scopeRef)dependency.push(item)}
    for(const item of nearestMatchingDescendants(project,ref,candidate=>!terminal(candidate)&&!visited.has(candidate.workRef))){
      if(topScopeRef(project,item.workRef)===scopeRef)structural.push(item);
    }
  }
  const deps=uniqueItems(dependency),depRefs=new Set(deps.map(x=>x.workRef));
  return {dependency:deps,structural:uniqueItems(structural).filter(x=>!depRefs.has(x.workRef))};
}

export function projectRoadmap(project,{maxSteps=4,maxRows=6}={}){
  const workfronts=projectWorkfronts(project,{maxRows});
  const rows=workfronts.rows.map(row=>{
    const visited=new Set(),steps=[];
    const currentItems=[...row.currentItems];currentItems.forEach(item=>visited.add(item.workRef));
    steps.push({distance:0,basis:row.basis==='LATEST_COMPLETED'?'HISTORICAL':'CURRENT',items:currentItems});
    let refs=currentItems.map(x=>x.workRef);
    for(let distance=1;distance<=maxSteps;distance++){
      const next=sequenceSuccessors(project,refs,row.scopeRef,visited);
      const items=next.dependency.length?next.dependency:next.structural;
      if(!items.length)break;
      const basis=next.dependency.length?'DEPENDENCY':'STRUCTURAL';
      items.forEach(item=>visited.add(item.workRef));
      steps.push({distance,basis,items});
      refs=items.map(x=>x.workRef);
    }
    const scopeItems=(project.items||[]).filter(item=>topScopeRef(project,item.workRef)===row.scopeRef&&!terminal(item));
    const shown=new Set(steps.flatMap(step=>step.items.map(item=>item.workRef)));
    const later=scopeItems.filter(item=>!shown.has(item.workRef));
    return {...row,steps,laterItems:later};
  });
  return freeze({projectRef:project.project.projectRef,rows,hiddenRowCount:workfronts.hiddenRowCount,maxSteps});
}

export function sequencePosition(project,workRef,{maxDepth=12}={}){
  const roadmap=projectRoadmap(project,{maxSteps:maxDepth,maxRows:Number.MAX_SAFE_INTEGER});
  for(const row of roadmap.rows){
    for(const step of row.steps){if(step.items.some(item=>item.workRef===workRef))return freeze({scopeRef:row.scopeRef,distance:step.distance,basis:step.basis})}
    if(row.laterItems.some(item=>item.workRef===workRef))return freeze({scopeRef:row.scopeRef,distance:null,basis:'LATER_UNSEQUENCED'});
  }
  return null;
}

function projectScopeItems(project){
  const map=byRef(project),rootSet=roots(project),scopes=[];
  for(const rootRef of rootSet){
    const root=map.get(rootRef);if(!root)continue;
    for(const childRef of root.childWorkRefs||[]){const child=map.get(childRef);if(child)scopes.push(child)}
  }
  if(scopes.length)return scopes;
  return [...rootSet].map(ref=>map.get(ref)).filter(Boolean);
}

function scopeDependencyGraph(project){
  const scopes=projectScopeItems(project),scopeRefs=new Set(scopes.map(item=>item.workRef)),incoming=new Map(),outgoing=new Map();
  for(const scope of scopes){incoming.set(scope.workRef,new Set());outgoing.set(scope.workRef,new Set())}
  for(const item of project.items||[]){
    const toScope=topScopeRef(project,item.workRef);
    if(!scopeRefs.has(toScope))continue;
    for(const depRef of item.dependencyRefs||[]){
      const fromScope=topScopeRef(project,depRef);
      if(fromScope===toScope||!scopeRefs.has(fromScope))continue;
      outgoing.get(fromScope).add(toScope);
      incoming.get(toScope).add(fromScope);
    }
  }
  return {scopes,incoming,outgoing};
}

export function projectScopeRoadmap(project,{maxSteps=4}={}){
  const {scopes,incoming,outgoing}=scopeDependencyGraph(project),map=byRef(project);
  const workfronts=projectWorkfronts(project,{maxRows:Number.MAX_SAFE_INTEGER});
  const activeScopeRefs=[...new Set(workfronts.rows.filter(row=>row.basis!=='LATEST_COMPLETED').map(row=>row.scopeRef))];
  let starts=activeScopeRefs;
  if(!starts.length){
    const latest=latestCompleted(scopes);if(latest)starts=[latest.workRef];
  }
  const rows=[];
  for(const startRef of starts){
    const visited=new Set([startRef]),steps=[{distance:0,basis:'CURRENT',items:[map.get(startRef)].filter(Boolean)}];
    let frontier=[startRef];
    for(let distance=1;distance<=maxSteps;distance++){
      const nextRefs=[...new Set(frontier.flatMap(ref=>[...(outgoing.get(ref)||[])]))].filter(ref=>!visited.has(ref));
      if(!nextRefs.length)break;
      nextRefs.forEach(ref=>visited.add(ref));
      steps.push({distance,basis:'DEPENDENCY',items:nextRefs.map(ref=>map.get(ref)).filter(Boolean)});
      frontier=nextRefs;
    }
    const priorRefs=[...(incoming.get(startRef)||[])].filter(ref=>DONE.has(map.get(ref)?.state));
    const later=scopes.filter(item=>!visited.has(item.workRef)&&!priorRefs.includes(item.workRef)&&!terminal(item));
    rows.push({
      scopeRef:startRef,
      label:map.get(startRef)?.label||startRef,
      priorItems:priorRefs.map(ref=>map.get(ref)).filter(Boolean),
      steps,
      laterItems:later,
    });
  }
  rows.sort((a,b)=>a.label.localeCompare(b.label));
  return freeze({projectRef:project.project.projectRef,rows,maxSteps});
}

export function projectSequenceDistance(project,workRef,{maxDepth=12}={}){
  const scopeRef=topScopeRef(project,workRef),roadmap=projectScopeRoadmap(project,{maxSteps:maxDepth});
  for(const row of roadmap.rows){
    for(const step of row.steps){if(step.items.some(item=>item.workRef===scopeRef))return freeze({fromScopeRef:row.scopeRef,targetScopeRef:scopeRef,distance:step.distance,basis:step.basis})}
    if(row.laterItems.some(item=>item.workRef===scopeRef))return freeze({fromScopeRef:row.scopeRef,targetScopeRef:scopeRef,distance:null,basis:'LATER_UNSEQUENCED'});
  }
  return null;
}

export function projectActivitySummary(project,{recentHours=0,nowMs=Date.now()}={}){
  const fronts=projectWorkfronts(project,{recentHours,nowMs,maxRows:Number.MAX_SAFE_INTEGER});
  const flat=fronts.rows.flatMap(row=>row.currentItems);
  const recentExact=(project.items||[]).filter(item=>{
    if(!recentHours)return false;const ev=stateAt(item);if(ev?.coverage!=='transition')return false;const age=nowMs-Date.parse(ev.at);return age>=0&&age<=recentHours*3600000;
  });
  return freeze({
    running:flat.filter(item=>ACTIVE.has(item.state)).length,
    review:flat.filter(item=>REVIEW.has(item.state)).length,
    blocked:flat.filter(item=>BLOCKED.has(item.state)).length,
    ready:flat.filter(item=>READY.has(item.state)).length,
    workfronts:fronts.rows.length,
    recentExactTransitionCount:recentExact.length,
  });
}

// [VXG RealForever][VEXWORK][TERRAIN][FLOW-PROJECTION]
