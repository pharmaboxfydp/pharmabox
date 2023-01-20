# PharmaBox Platform

- [Organization](https://github.com/pharma-box)
- [Organization Documents](https://github.com/pharma-box/docs)
- [Live Url: pharmabox.vercel.app](https://pharmabox.vercel.app)

Status

![status](https://img.shields.io/github/checks-status/pharmaboxfydp/pharmabox/main)

This is a [Next.js](https://nextjs.org/) project

## API Documentation

Refer to [api-documentation.md](./api-documentation.md) for API documentation. The documentation includes a list of available endpoints, best practices and code strategies.

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

## Scripts

### Database Migration

Running the script `bash/migrate_dbs` will perform migrations on **both production and local databases** to make sure they are in-sync. Be careful when running this script to avoid deleting data by accident. It is recommended that a backup (snapshot) of the database be made in AWS prior to running a heavy migration

```bash
sh bash/migrate_dbs
```

### Seed Test Database

Running the script `bash/seed_test_dbs` will generate test data and users based on real users in `clerk`! If you are adding more tables be sure to also update this script!

```bash
sh bash/seed_test_dbs
```

### Convert Users

This script `bash/convert_user` can convert a user either locally, (dev) or on prod from a `patient` to a `staff` or vise-versa. It takes five flags `-r --role`,`-i --id`, `-t --type`, `-l --location` and `-e --env` to specify the user you want to convert. The user will be converted to the specified role and their previous role record will be removed It can be used as:

```bash
# converts user: user_abc123 to a staff member locally as admin
bash/convert_user -r staff -i user_abc123 -t admin -l 2 -e dev

```

### Locations

this script `bash/locations` can create a location either locally (dev) or on prod. It takes the following flags

- `-o --operation`: operation to perform `"create"` or `"delete"`
- `-i --id`: id of location to be removed `number`
- `-c --country`: Location Country `string`
- `-p --phone`: Phone Number `string`
- `-a --address`: Address `string`
- `-e --env`: Environment: `"dev"` or `"prod"`

**Create a location**

```bash
# creates a Canadian location with phone number and address locally
bash/location -o create -c Canada -p "123-456-7890" -a "172 Forward Street South" -e dev
```

**Delete a location**

```bash
# deletes location of id 6764
bash/location -o delete -i 6764
```

### Teams

this script `bash/teams` allows you to add a staff member to a team and also remove a staff member from a team. It takes the following flags:

- `-o --operation`: operation to perform `"add"` or `"remove"`
- `-s --userId`: the user Id of the staff member `string`
- `-l --locationId`: the location id of the location `number`
- `-e --env`: Environment `"dev"` or `"prod"`

**Add a team member**

```bash
# add a team member of the following id to team (location) number 251
bash/team -o add -s user_2GvN7SlipkYqc0YlsNWuGkQDLtT -l 251 -e dev
```

**Remove a team member from a team (Location)**

```bash
# remove a team member of the following id from its current location
bash/team -o remove  -s user_2GvN7SlipkYqc0YlsNWuGkQDLtT -e dev
```

## Contributors

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->

[![All Contributors](https://img.shields.io/badge/all_contributors-4-orange.svg?style=flat-square)](#contributors)

<!-- ALL-CONTRIBUTORS-BADGE:END -->
