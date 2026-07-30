import { seedTicker } from '../lib/seedTicker.js';
import { createCrudHandler } from '../lib/crudApi.js';

export default createCrudHandler({
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
});
