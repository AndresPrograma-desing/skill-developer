export const mapStandingsToRows = standings =>
  standings.map(entry => ({
    id: entry.Driver.driverId,
    position: entry.position,
    driver: `${entry.Driver.givenName} ${entry.Driver.familyName}`,
    team: entry.Constructors?.[0]?.name ?? '-',
    points: entry.points,
    wins: entry.wins,
  }));

export const getRaceWinner = race => {
  const winner = race?.Results?.[0];
  if (!winner) return null;
  return `${winner.Driver.givenName} ${winner.Driver.familyName}`;
};

export const getFastestLap = race => {
  const fastest = race?.Results?.find(result => result.FastestLap?.rank === '1');
  if (!fastest) return null;
  return `${fastest.Driver.givenName} ${fastest.Driver.familyName} (${fastest.FastestLap.Time.time})`;
};
