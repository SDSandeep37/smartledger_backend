# SmartLedger Backend

Express API for SmartLedger. It handles authentication, company setup, ledgers, stock, units, vouchers, stock movement, and accounting entries.

## Scripts

```bash
npm run dev     # Start with nodemon
npm start       # Start with node
npm test        # Placeholder; no automated tests are configured yet
```

## Environment Variables

Create `.env` in `smartledger_backend`:

```env
PORT=5000
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
JWT_SECRET=replace-with-a-secure-secret
JWT_EXPIRES_IN=1
NODE_ENV=development
```

`JWT_EXPIRES_IN` is treated as hours in the current cookie max-age calculation.

## Startup

```bash
npm install
npm run dev
```

On startup, `index.js`:

1. Loads environment variables.
2. Starts the Express app.
3. Calls `initialiseDatabaseTable()` to create tables if they do not already exist.

## App Structure

```text
src/
  app.js                    Express app, CORS, middleware, routes
  config/
    db.js                   PostgreSQL pool and table initialization
    env.js                  dotenv config
  constants/                Default ledger groups and ledgers
  controllers/              Request handlers
  middlewares/              Auth and validation middleware
  models/                   SQL access layer
  routes/                   Express route definitions
  services/                 Transactional business workflows
  utils/                    Cookies, password, validators
```

## Authentication

Authentication uses JWTs stored in HTTP-only cookies.

- `POST /smartledger/user/register` creates a user and sets the cookie.
- `POST /smartledger/user/login` validates credentials and sets the cookie.
- `GET /smartledger/user/session` reads the cookie and returns the current user.
- `POST /smartledger/user/logout` clears the cookie.

Protected routes use `verifyToken` from `src/middlewares/authMiddleware.js`.

## Database Overview

Tables are created in `src/config/db.js`:

- `users`
- `companies`
- `ledger_groups`
- `ledgers`
- `units`
- `stock_groups`
- `stock_items`
- `vouchers`
- `voucher_sequences`
- `voucher_items`
- `voucher_entries`

Company creation runs in a transaction and seeds default ledger groups and ledgers.

Voucher creation also runs in a transaction:

- Generates a voucher number using `voucher_sequences`.
- Calculates gross amount, discount, taxable amount, GST, and line total.
- Creates voucher header and item rows.
- Updates stock quantity.
- Creates double-entry ledger entries.

## Base URL

Local API base URL:

```text
http://localhost:5000/smartledger
```

See `../docs/API_REFERENCE.md` for endpoint details.
