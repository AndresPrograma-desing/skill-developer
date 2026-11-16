import { jolpicaClient, openF1Client } from './f1Client';

/**
 * Servicio de ejemplo: Fórmula 1.
 * Jolpica (histórico/estructurado) + OpenF1 (telemetría casi en tiempo real).
 */
export const f1Service = {
  getDriverStandings: async () => {
    return jolpicaClient.get('/current/driverStandings.json');
  },

  getLastRaceResults: async () => {
    return jolpicaClient.get('/current/last/results.json');
  },

  getCircuits: async () => {
    return jolpicaClient.get('/circuits.json');
  },

  getLatestTeamRadio: async () => {
    return openF1Client.get('/team_radio', { params: { session_key: 'latest' } });
  },

  getLatestIntervals: async () => {
    return openF1Client.get('/intervals', { params: { session_key: 'latest' } });
  },
};

export default f1Service;
