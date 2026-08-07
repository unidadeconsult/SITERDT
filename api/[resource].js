import { createCrudHandler } from '../lib/crudApi.js';
import { resourceConfigs } from '../lib/resourceConfigs.js';

const handlers = Object.fromEntries(
  Object.entries(resourceConfigs).map(([key, config]) => [key, createCrudHandler(config)])
);

export default async function handler(req, res) {
  const resource = Array.isArray(req.query.resource) ? req.query.resource[0] : req.query.resource;
  const fn = handlers[resource];
  if (!fn) {
    res.status(404).json({ ok: false, error: 'Recurso não encontrado.' });
    return;
  }
  return fn(req, res);
}
