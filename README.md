# PharmaBox Platform

- [Organization](https://github.com/pharma-box)
- [Organization Documents](https://github.com/pharma-box/docs)
- [Live Url: pharmabox.vercel.com](https://pharmabox.vercel.com)

Status

![status](https://img.shields.io/github/checks-status/pharmaboxfydp/pharmabox/main)

This is a [Next.js](https://nextjs.org/) project

## Environment Setup for Local Development

1. Install Postgress Locally: [postgressapp.com](https://postgresapp.com/downloads.html)
2. Install Postico 2: [postico2](https://eggerapps.at/postico2/)
3. Install Node Version Manager (NVM) [nvm-sh/NVM](https://github.com/nvm-sh/nvm)
4. Create and populate `.env.development` and `.env.production` files in the root of the directory. **Never commit or share secrets and API keys**.

   ```bash
   # .env.development
   DATABASE_URL="postgres://postgres:password@localhost:5432/pharmabox"
   CLERK_JWT_KEY=
   CLERK_API_KEY=
   NEXT_PUBLIC_CLERK_FRONTEND_API=s
   ```

   ```bash
   # .env.production
   DATABASE_URL=

   ```

5. Make sure you are using the right version of `Node` and `NPM` by using running `nvm use`
6. Run `npm install`
7. Open Postgres and create a database called `pharmabox`
8. Open Postico2 and connect to this server.
9. Create the database schema with: `sh bash/migrate_dbs`
10. Populate database with fake data with: `sh bash/seed_test_dbs`
11. Generate a prisma client by running `npx prisma generate`
12. Startup Server and Frontend with `npm run dev`
13. View Frontend on `http://localhost:3000`

You should also be able to view the populated data in the user's table in Postico2 or pgAdmin 4

## Development Practices

### Contributing

Development should happen in a feature branch. When a feature is ready, a pull request can be opened against the `main` branch. You should get at least one approval and review from another team member before merging.

### Code Cleanup

This repository uses [prettier](https://prettier.io/) to format code and [ESLint](https://eslint.org/) to enforce code style. It is recommended to configure your preferred editor to `format on save` with prettier. You can also run `prettier` on all files using

```bash
# check formatting
npx prettier . --check
```

```bash
# fix formatting
npx prettier . --write
```

You can also lint files using

```bash
# lint files
npx eslint . --ext .js,.jsx,.ts,.tsx --fix
```

## Prisma Studio

You can use Prisma Studio to help with development! You might run into issues with `next.js` since it stores environment variables in `.env.*`. So we can use `dotenv-cli` to store environment variables. To use Prisma Studio:

1. Install `dotenv cli`. `npm install -g dotenv-cli`
2. `dotenv -e .env.development -- npx prisma studio`

## Contributors

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->

[![All Contributors](https://img.shields.io/badge/all_contributors-13-orange.svg?style=flat-square)](#contributors)

<!-- ALL-CONTRIBUTORS-BADGE:END -->
