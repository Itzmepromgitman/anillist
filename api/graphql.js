import { wrapSchema, introspectSchema } from '@graphql-tools/wrap';
import { delegateToSchema } from '@graphql-tools/delegate';
import { print } from 'graphql';

// Executor function to make requests to Anilist API
const executor = async ({ document, variables, context }) => {
  const query = print(document);
  
  const fetchResult = await fetch('https://graphql.anilist.co/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      // Forward any authorization headers from the original request
      ...(context?.headers?.authorization && {
        'Authorization': context.headers.authorization
      })
    },
    body: JSON.stringify({ query, variables })
  });

  return fetchResult.json();
};

// Proxy resolver to handle request delegation
const proxyResolver = ({ subschemaConfig, operation, transformedSchema }) => {
  return (_parent, _args, context, info) => {
    return delegateToSchema({
      schema: subschemaConfig,
      operation,
      operationName: info?.operation?.name?.value,
      context,
      info,
      transformedSchema,
    });
  };
};

// Cache the schema to avoid re-introspection on every request
let cachedSchema = null;

const getSchema = async () => {
  if (!cachedSchema) {
    cachedSchema = wrapSchema({
      schema: await introspectSchema(executor),
      executor,
      createProxyingResolver: proxyResolver
    });
  }
  return cachedSchema;
};

// Main handler function for Vercel
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests for GraphQL
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const schema = await getSchema();
    const { query, variables, operationName } = req.body;

    // Execute the GraphQL query
    const result = await executor({
      document: { kind: 'Document', definitions: [{ kind: 'OperationDefinition', operation: 'query', name: { kind: 'Name', value: operationName || 'Query' } }] },
      variables,
      context: { headers: req.headers }
    });

    res.status(200).json(result);
  } catch (error) {
    console.error('GraphQL Proxy Error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}
