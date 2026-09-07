# ReelMind deployment

## Local setup

Install Node.js 20 or newer, then run:

```powershell
npm install
npm run dev
```

Start the Python API in a second terminal:

```powershell
.\.venv\Scripts\python.exe app.py
```

Vite proxies `/api` requests to `http://127.0.0.1:5000`.

## Vercel setup

Deploy the repository as a Vercel project. Vercel will build the React client with Vite and route `/api/*` to `app.py`.

Add these Production environment variables in Vercel Project Settings:

```text
GEMINI_API_KEY
NEO4J_URI
NEO4J_USER
NEO4J_PASSWORD
```

Use a hosted Neo4j URI such as `neo4j+s://...` for deployment. A local `bolt://localhost:7687` database is not reachable from Vercel.

Deploy with:

```powershell
npx vercel
npx vercel --prod
```

Test after deployment:

```powershell
curl https://YOUR-DOMAIN.vercel.app/api/health
```

The browser UI is served at the root URL. Graph questions require the Neo4j dataset to be loaded before deployment:

```powershell
.\.venv\Scripts\python.exe main.py --load
```
