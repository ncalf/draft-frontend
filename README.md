# NCALF Draft

*A website frontend and backend api for a fantasy footy drafting process, with live images, tables and statistics scraped from official sporting websites.*

 The fronted website is created using NextJS. Shadcn UI with tailwind CSS is used for the interface, and Tanstack Query with zustand for client-side state management.

 The backend API is also created with NextJS, using route handlers, and drizzle orm to communicate with the MySQL database.

## High Seas Context
 This is a custom fantasy football application based on a local sporting league. Data about every player and clubs from the AFL competition are scraped from the official website, to prepare for the drafting process.
 This the process of selling each player to a fantasy football team, for a certain amount of in-tournament currency. A sporting position is randomly selected, and each player playing in that position for the year is shown in the drafting dashboard along with their image, name, and performance statistics for previous years.
 Depending on the wishes of the fantasy footy participants, the player can be sold to a team through a dynamic modal (which handles situations such as team budgets and position limits) or a new player can be generated.
 The status of the draft is stored in a MySQL database, which stores all players available in the draft and relevant information about them, such as the sporting clubs and positions they play for.
 The website communicates with the database with GET and PATCH http requests, using optimistic updates for actions such as selling players to enable instant feedback on the frontend.

## Starting the Draft

In order to start the NextJS application (which includes both the website and api) run `npm run build` and then `npm run start`. To do this, a `.env` file is required with the following values:

- `DB_HOST`: The IP of the host of the database.
- `DB_PORT`: The port the database is being run on.
- `DB_USER`: The database user to connect to the database with.
- `DB_PASSWORD`: The password for the database user.
- `NEXT_PUBLIC_SEASON`: The season (year) to run the draft for.
- `PICTURE_DIRECTORY`: The filepath to the directory of downloaded players

To develop, run `npm run dev` with the same `.env` file specifications as above.

## API Routes

All routes must begin with `/api`.

| Route                   | HTTP Method | Params/Payload                                                               | Description                                                         |
| ----------------------- | ----------- | ---------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| `player/image`          | GET         | ?season=...&playerSeasonID=...                                               | Retrieve the image of a player.                                     |
| `player/info`           | GET         | ?season=...&playerSeason=...&years=...                                       | Retrieve the full name, and past year statistics of a player.       |
| `player/mark-nominated` | PATCH       | {season: ..., playerSeasonID: ..., position: ...}                            | Mark a player as nominated in the database.                         |
| `player/sell`           | PATCH       | {season:..., playerSeasonID: ...,  teamID: ..., price: ..., position?: ...,} | Sell a player to a team.                                            |
| `player/undo-sale`      | PATCH       | {season: ..., playerSeasonID: ..., wasRookie: ...}                           | Undo the sale of a previously sold player.                          |
| `players/sold`          | GET         | ?season=...                                                                  | Get all of the sold players in a season.                            |
| `players/unsold`        | GET         | ?position=...&season=...&years                                               | Get the list of unsold players for a season (including statistics). |
| `teams/players`         | GET         | ?teamID=...&season=...                                                       | Gets the list of players currently sold to a team.                  |
| `teams/stats`           | GET         | ?season=...                                                                  | Gets a summary of all team position and price numbers.              |
