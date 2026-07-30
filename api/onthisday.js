import { seedOnThisDay } from '../lib/seedOnThisDay.js';
import { createCrudHandler } from '../lib/crudApi.js';

export default createCrudHandler({
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
});
