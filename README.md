# inventory-app-server
This is the API/server for the [inventory-app-client](https://github.com/cjxo/inventory-app-client). It handles Create, Read, and Delete operations for Items and Categories.

# Prerequisites
- Node.js
- NPM
- PostgreSQL
- Supabase Account
  - Create an account at [supabase](https://supabase.com/) and create a project
  - Once you created a project, you will want to grab the Project URL and anon Project API 
  key under the API settings.
  - Create two buckets under 'storage' named 'itempngs' and 'testitempngs'
  - After creating the buckets, under 'configuration', click 'Policies'. Create policies 
  (by clicking new policy) for both buckets with the following allowed operations: 
  SELECT, INSERT, UPDATE, and DELETE. Finally, review and save the policy.

# Installation
We set up the server as follows
```bash
git clone git@github.com:cjxo/inventory-app-server.git
cd inventory-app-server
npm install
```

Next, create a .env file at root folder that contains the following variables:
- **PG_CONNECTIONSTRING_PROD** - A PG connection string for production database
- **PG_CONNECTIONSTRING_DEVL** - A PG connection string for development database
- **PG_CONNECTIONSTRING_TEST** (optional) - a PG connection string for test database (if you're going to test)
- **JWT_SECRET** (optional) - A JWT secret key for jsonwebtoken operations (for now, this is not used in the server)
- **SUPABASE_PROJ_URL** - A Supabase Project URL
- **SUPABASE_API_KEY** - A Supabase ANON Project API Key

**Note**: See [connectionString field of Config](https://node-postgres.com/apis/client)

Next, we populate the development database tables as follows
```bash
npm run populate
```

Finally, we run the server
```bash
npm run dev
```

The server will start and listen for incoming connections at [http://localhost:3000/](http://localhost:3000/).
