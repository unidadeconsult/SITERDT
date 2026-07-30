import { seedTransfers } from '../lib/seedTransfers.js';
import { createCrudHandler } from '../lib/crudApi.js';

export default createCrudHandler({
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
});
