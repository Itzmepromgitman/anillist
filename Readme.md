AniList GraphQL Proxy

A serverless proxy for the AniList GraphQL API, deployable on Vercel for easy, CORS-friendly access from browsers and server apps alike.

Repository: https://github.com/Itzmepromgitman/Anilist-Api

Deploy with Vercel:
[Deploy with Vercel] https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FItzmepromgitman%2FAnilist-Api

Features
- CORS enabled for browser apps
- Forwards Authorization: Bearer <token> for authenticated requests
- Error handling & structured logging
- Serverless, one-click deploy on Vercel

Endpoints
Once deployed, your proxy will be available at:
- https://your-app.vercel.app/api/graphql
- https://your-app.vercel.app/graphql (alias)

Quick start
- One‑click deploy: use the “Deploy with Vercel” button above to clone and deploy this repository to a new Vercel project.
- No extra config needed for public AniList queries—send GraphQL POST requests to your deployed endpoint.
- For authenticated queries or mutations, pass Authorization: Bearer <access_token> and keep tokens in server or secure client storage.

Why a proxy?
- Browser apps can avoid direct calls to https://graphql.anilist.co while keeping CORS simple.
- A proxy standardizes headers, payload shape, and logging, and makes it easy to evolve usage policies.

Usage
AniList requires POST requests with a JSON body containing query and optional variables.

cURL (unauthenticated)
------------------------------------------------------------
curl -sX POST "https://your-app.vercel.app/api/graphql" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query ($id: Int) { Media(id: $id, type: ANIME) { id title { romaji english native } } }",
    "variables": { "id": 15125 }
  }'
------------------------------------------------------------

JavaScript fetch (unauthenticated)
------------------------------------------------------------
const query = `
  query ($id: Int) {
    Media(id: $id, type: ANIME) {
      id
      title { romaji english native }
    }
  }
`;

const variables = { id: 15125 };

const res = await fetch("https://your-app.vercel.app/api/graphql", {
  method: "POST",
  headers: { "Content-Type": "application/json", "Accept": "application/json" },
  body: JSON.stringify({ query, variables })
});

const data = await res.json();
console.log(data);
------------------------------------------------------------

JavaScript fetch (authenticated “Viewer”)
------------------------------------------------------------
const query = `
  query {
    Viewer {
      id
      name
    }
  }
`;

const res = await fetch("https://your-app.vercel.app/api/graphql", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
    "Authorization": `Bearer ${process.env.ANILIST_TOKEN}`
  },
  body: JSON.stringify({ query })
});

const data = await res.json();
console.log(data);
------------------------------------------------------------

Python requests
------------------------------------------------------------
import requests

query = """
  query ($id: Int) {
    Media(id: $id, type: ANIME) {
      id
      title { romaji english native }
    }
  }
"""
variables = { "id": 15125 }

resp = requests.post(
  "https://your-app.vercel.app/api/graphql",
  json={ "query": query, "variables": variables },
  headers={ "Accept": "application/json" }
)
print(resp.json())
------------------------------------------------------------

Authentication (optional but required for user‑specific data)
- Create an AniList application and obtain an access token using OAuth.
- Send requests to the proxy with: Authorization: Bearer <access_token>.
- Use the standard Authorization Code flow for user login and token exchange.

Tips
- Shape your payload as { "query": "...", "variables": { ... } } and always use POST.
- Try queries in AniList’s GraphiQL explorer to iterate quickly, then paste them into requests to your proxy.
- AniList commonly enforces request limits; build retries/backoff in clients consuming the proxy.

Troubleshooting
- 400 errors: check JSON shape (query + optional variables) and Content-Type: application/json.
- 401 errors: missing/invalid Authorization header for queries that require authentication.
- CORS: ensure requests come from allowed origins or call from a server environment if stricter policies are applied.

License
MIT
