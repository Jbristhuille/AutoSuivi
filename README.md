# AutoTrack

AutoTrack is a local-first vehicle tracking application for managing purchased vehicles, restoration expenses, and estimated resale profitability.

This project is built with the help of Codex.

The goal is to keep all data on the user's computer while providing a simple interface to:

- Register vehicles with key information such as plate number, model, year, mileage, purchase price, and target sale price.
- Track expenses for each vehicle with a date, amount, label, and category.
- Monitor the total investment and estimated margin in real time.
- Create and restore local backups.

## Planned Stack

- Angular for the user interface.
- NestJS for the local API.
- Prisma for database access.
- SQLite for local data storage.

## Project Structure

```text
src/
  api/      NestJS API and Prisma setup
  client/   Angular client
```

## Development

Use the Node.js version defined in `.nvmrc`.

```bash
npm run client:start
npm run api:start:dev
npm run build
```

## Project Status

This project is in its initial setup phase. The README will be expanded as features are added.
