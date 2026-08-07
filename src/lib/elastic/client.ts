import { Client } from '@elastic/elasticsearch';

if (!process.env.ES_ENDPOINT || !process.env.ES_API_KEY) {
  throw new Error('Missing ES_ENDPOINT or ES_API_KEY env vars');
}

declare global {
  // eslint-disable-next-line no-var
  var __esClient: Client | undefined;
}

export const esClient =
  global.__esClient ??
  new Client({
    node: process.env.ES_ENDPOINT,
    auth: {
      apiKey: process.env.ES_API_KEY,
    },
    requestTimeout: 5000,
    maxRetries: 2,
  });

if (process.env.NODE_ENV !== 'production') {
  global.__esClient = esClient;
}