import { seedTicker } from './seedTicker.js';
import { seedTransfers } from './seedTransfers.js';
import { seedOnThisDay } from './seedOnThisDay.js';

export const resourceConfigs = {
  ticker: {
    hashKey: 'rdt:ticker',
    seed: seedTicker,
    requiredFields: ['competition', 'homeTeam', 'homeAbbr', 'awayTeam', 'awayAbbr', 'status', 'time'],
    sortFn: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    buildEntity: (body) => ({
      id: `m-${Date.now().toString(36)}`,
      competition: body.competition,
      homeTeam: body.homeTeam,
      homeAbbr: body.homeAbbr,
      awayTeam: body.awayTeam,
      awayAbbr: body.awayAbbr,
      homeScore: Number(body.homeScore) || 0,
      awayScore: Number(body.awayScore) || 0,
      status: body.status,
      time: body.time,
      createdAt: new Date().toISOString(),
    }),
  },
  transfers: {
    hashKey: 'rdt:transfers',
    seed: seedTransfers,
    requiredFields: ['player', 'fromClub', 'toClub', 'status', 'detail', 'year', 'country'],
    sortFn: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    buildEntity: (body) => ({
      id: `t-${Date.now().toString(36)}`,
      player: body.player,
      fromClub: body.fromClub,
      toClub: body.toClub,
      status: body.status,
      probability: Number(body.probability) || 100,
      detail: body.detail,
      year: Number(body.year),
      country: body.country,
      createdAt: new Date().toISOString(),
    }),
  },
  onthisday: {
    hashKey: 'rdt:onthisday',
    seed: seedOnThisDay,
    requiredFields: ['year', 'title', 'description'],
    sortFn: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    buildEntity: (body) => ({
      id: `o-${Date.now().toString(36)}`,
      year: Number(body.year),
      title: body.title,
      description: body.description,
      createdAt: new Date().toISOString(),
    }),
  },
};
