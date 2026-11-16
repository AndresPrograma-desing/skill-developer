export const F1_LOADING_MIN_VISIBLE_MS = 5000;

export const getF1StandingsColumns = t => [
  { header: t('f1.columns.position'), accessor: 'position', align: 'center', width: 60 },
  { header: t('f1.columns.driver'), accessor: 'driver' },
  { header: t('f1.columns.team'), accessor: 'team' },
  { header: t('f1.columns.points'), accessor: 'points', align: 'right' },
  { header: t('f1.columns.wins'), accessor: 'wins', align: 'right' },
];
