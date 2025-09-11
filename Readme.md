# 🚀 Anilist GraphQL Proxy

> A fast, secure, and easy-to-use serverless proxy for the Anilist GraphQL API, deployable on Vercel in seconds.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FItzmepromgitman%2FAnilist-Api)

---

## ✨ Features

- 🌐 **CORS enabled** - Works seamlessly with web applications
- 🔐 **Authentication support** - Forwards authorization headers for authenticated requests  
- 🛡️ **Error handling** - Comprehensive error logging and user-friendly responses
- ⚡ **Serverless ready** - Zero-config deployment on Vercel
- 🎯 **Drop-in replacement** - Compatible with existing Anilist API implementations
- 📊 **Rate limiting friendly** - Respects Anilist's API guidelines

---

## 🚀 Quick Deploy

Click the button above to deploy your own instance in under 30 seconds!

**Or manually:**

1. Fork this repository
2. Connect to Vercel
3. Deploy with default settings
4. Your API is ready! 🎉

---

## 📍 API Endpoints

Once deployed, your proxy will be available at:

| Endpoint | Description |
|----------|-------------|
| `https://your-app.vercel.app/api/graphql` | Main GraphQL endpoint |
| `https://your-app.vercel.app/graphql` | Aliased endpoint (shorter URL) |

---

## 📖 Usage Examples

### Basic Query (JavaScript/Fetch)

```javascript
const query = `
  query ($id: Int) {
    Media (id: $id, type: ANIME) {
      id
      title {
        romaji
        english
        native
      }
      description
      episodes
      status
      averageScore
    }
  }
`;

const variables = {
  id: 15125
};

fetch('https://your-app.vercel.app/api/graphql', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    query: query,
    variables: variables
  })
})
.then(response => response.json())
.then(data => console.log(data));
```

### With Authentication (for user-specific data)

```javascript
const query = `
  query {
    Viewer {
      id
      name
      avatar {
        large
      }
      statistics {
        anime {
          count
          meanScore
        }
      }
    }
  }
`;

fetch('https://your-app.vercel.app/api/graphql', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_ACCESS_TOKEN'
  },
  body: JSON.stringify({ query })
})
.then(response => response.json())
.then(data => console.log(data));
```

### Search Anime

```javascript
const searchAnime = async (searchTerm) => {
  const query = `
    query ($search: String) {
      Page (perPage: 10) {
        media (search: $search, type: ANIME) {
          id
          title {
            romaji
            english
          }
          coverImage {
            medium
            large
          }
          startDate {
            year
          }
          averageScore
          genres
        }
      }
    }
  `;

  const response = await fetch('https://your-app.vercel.app/api/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables: { search: searchTerm }
    })
  });

  return response.json();
};

// Usage
searchAnime('Attack on Titan').then(console.log);
```

### Using with Axios

```javascript
import axios from 'axios';

const client = axios.create({
  baseURL: 'https://your-app.vercel.app',
  headers: {
    'Content-Type': 'application/json',
  }
});

const getAnimeDetails = async (animeId) => {
  const query = `
    query ($id: Int) {
      Media (id: $id, type: ANIME) {
        title { romaji }
        description
        episodes
        status
        genres
        studios {
          nodes {
            name
          }
        }
      }
    }
  `;

  try {
    const response = await client.post('/api/graphql', {
      query,
      variables: { id: animeId }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching anime:', error);
  }
};
```

---

## 🔧 Local Development

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Setup
```bash
# Clone the repository
git clone https://github.com/Itzmepromgitman/Anilist-Api.git

# Navigate to project directory
cd Anilist-Api

# Install dependencies
npm install

# Start development server
npm run dev
```

Your proxy will be available at `http://localhost:3000/api/graphql`

---

## 🛠️ Configuration

### Environment Variables (Optional)

Create a `.env.local` file for custom configuration:

```env
# Optional: Custom Anilist API URL (defaults to https://graphql.anilist.co)
ANILIST_API_URL=https://graphql.anilist.co

# Optional: Enable debug logging
DEBUG=true
```

### Custom Headers

The proxy automatically forwards these headers:
- `Authorization` - For authenticated requests
- `Content-Type` - Request content type
- `User-Agent` - Client identification

---

## 📚 Common Queries

<details>
<summary><strong>Get Trending Anime</strong></summary>

```graphql
query {
  Page (perPage: 20) {
    media (type: ANIME, sort: TRENDING_DESC) {
      id
      title {
        romaji
        english
      }
      coverImage {
        large
      }
      averageScore
      genres
    }
  }
}
```
</details>

<details>
<summary><strong>Get User's Anime List</strong></summary>

```graphql
query ($userName: String) {
  MediaListCollection (userName: $userName, type: ANIME) {
    lists {
      name
      entries {
        media {
          title {
            romaji
          }
        }
        score
        status
      }
    }
  }
}
```
</details>

<details>
<summary><strong>Get Anime by Genre</strong></summary>

```graphql
query ($genre: String) {
  Page (perPage: 25) {
    media (type: ANIME, genre: $genre, sort: POPULARITY_DESC) {
      id
      title {
        romaji
      }
      description
      episodes
      averageScore
      popularity
    }
  }
}
```
</details>

---

## 🚨 Error Handling

The proxy provides detailed error responses:

```json
{
  "errors": [
    {
      "message": "Error description",
      "locations": [...],
      "path": [...]
    }
  ]
}
```

Common error scenarios:
- **400 Bad Request** - Invalid GraphQL query
- **401 Unauthorized** - Invalid or missing authorization token
- **429 Too Many Requests** - Rate limit exceeded
- **500 Internal Server Error** - Proxy or upstream API error

---

## 📈 Rate Limits

This proxy respects Anilist's rate limiting:
- **90 requests per minute** for authenticated requests
- **60 requests per minute** for anonymous requests

The proxy will forward rate limit headers from Anilist API.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🔗 Useful Links

- [Anilist GraphQL Documentation](https://anilist.gitbook.io/anilist-apiv2-docs/)
- [Anilist GraphQL Explorer](https://anilist.co/graphiql)
- [Vercel Documentation](https://vercel.com/docs)
- [GraphQL Learning Resources](https://graphql.org/learn/)

---

<div align="center">

**Made with ❤️ for the anime community**

[⭐ Star this repo](https://github.com/Itzmepromgitman/Anilist-Api) • [🐛 Report Bug](https://github.com/Itzmepromgitman/Anilist-Api/issues) • [💡 Request Feature](https://github.com/Itzmepromgitman/Anilist-Api/issues)

</div>
