import { Client } from '@elastic/elasticsearch';

if (!process.env.ES_ENDPOINT || !process.env.ES_API_KEY) {
  throw new Error('Missing ES_ENDPOINT or ES_API_KEY env vars');
}

export const esClient = new Client({
  node: process.env.ES_ENDPOINT,
  auth: { apiKey: process.env.ES_API_KEY },
});