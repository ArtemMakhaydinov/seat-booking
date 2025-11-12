## Description

Simple test task for implement seat reservation service.

## Installation

Create `.env` file in the root of the repositry folder with content of `.env.sample`.

```bash
$ yarn install
$ docker compose -f docker-compose.dev.yml up
$ yarn prisma-migrate-deploy
$ yarn prisma-generate
$ yarn ts-node prisma/seed.ts
```

## Running the app

```bash
# watch mode
$ yarn start:dev

# production mode
$ yarn start
```
