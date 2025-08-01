## Installation

Use the npm to install open-music-api.

```bash
npm install
```

### .env

Create .env file and write values like belows:

```bash
#server-node configuration
PORT=
HOST=

#server-postgre configuration
PGUSER=
PGHOST=
PGPASSWORD=
PGDATABASE=
PGPORT=

# JWT token
ACCESS_TOKEN_KEY=
REFRESH_TOKEN_KEY=
ACCESS_TOKEN_AGE=

# aws-sdk
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=
AWS_BUCKET_NAME=
```

### ESLint

Use the npm to check style code using eslint.

```bash
npm run lint
```

## Migration

When you want to create table with postgres, you can use this command line and you will create all tables and run seeder.
I will assume you already setup your postgres (user, role, database, etc)

```bash
npm run migrate up
```

If you want to delete the table using this command line

```bash
npm run migrate down
```

## Running program

After install all package you can run the program with this command line and your program will be running on development.

```bash
npm run start
```

or if you want to running it on production you can run this command line.

```bash
npm run start:prod
```
