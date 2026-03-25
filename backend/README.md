# Backend Setup

This folder is prepared for the future backend used by club social media managers and students.

## Planned stack

- Node.js
- Express
- MongoDB Atlas
- Mongoose

## Folder map

- `src/config`: database and environment setup
- `src/controllers`: request handlers
- `src/middleware`: auth and error middleware
- `src/models`: MongoDB schemas
- `src/routes`: API routes
- `src/utils`: shared helpers

## To start later

1. Open a terminal in `backend`
2. Run `npm install`
3. Copy `.env.example` to `.env`
4. Add your MongoDB Atlas connection string
5. Run `npm run dev`

## First API plan

- `POST /api/auth/login`
- `GET /api/clubs`
- `GET /api/events`
- `POST /api/events`
- `POST /api/registrations`
- `GET /api/certificates`
