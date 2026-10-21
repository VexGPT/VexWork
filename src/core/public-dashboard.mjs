export const PUBLIC_WORK_DASHBOARD_SCHEMA = 'vexwork.public-work-dashboard/v1';

function publicCard(card) {
  return Object.freeze({
    workRef: card.workRef,
    label: card.label,
    purpose: card.purpose,
    workClass: card.workClass,
    state: card.state,
    workDisposition: card.workDisposition,
    priorityClass: card.priorityClass,
    repositoryRefs: card.repositoryRefs,
    authorityDisposition: card.authorityDisposition,
    effectDisposition: card.effectDisposition,
    updatedAt: card.updatedAt,
  });
}

export function projectPublicWorkDashboard({ project, board, parkingLot }) {
  const lanes = board.lanes.map((lane) => Object.freeze({
    laneRef: lane.laneRef,
    label: lane.label,
    cards: lane.cards.map(publicCard),
  }));
  const parked = parkingLot.items.map(publicCard);
  const projectWorkItemCount = lanes.reduce((total, lane) => total + lane.cards.length, 0);
  const activeProjectWorkItemCount = lanes
    .filter((lane) => !['lane.work.done', 'lane.work.archive'].includes(lane.laneRef))
    .reduce((total, lane) => total + lane.cards.length, 0);

  return Object.freeze({
    schemaVersion: PUBLIC_WORK_DASHBOARD_SCHEMA,
    project: Object.freeze({
      projectRef: project.projectRef,
      label: project.label,
      purpose: project.purpose,
    }),
    graphRef: board.graphRef,
    viewRef: board.viewRef,
    lanes,
    parkingLot: Object.freeze({
      items: parked,
    }),
    summary: Object.freeze({
      projectWorkItemCount,
      activeProjectWorkItemCount,
      parkingLotItemCount: parked.length,
    }),
    effects: false,
    executionAuthority: 'NONE',
  });
}
