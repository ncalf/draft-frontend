# NCALF Season Frontend

All python scripts for the personal project ncalf program, as well as a website frontend and backend for the drafting process.
The drafting website is built with react, with shadcn ui's premade components and tailwind css to style it. Zustand is used as the state manager.

## Starting the Frontend

1. Navigate to the frontend folder in the repository (run `npm install` if needed, to install dependencies.)
2. Run `npm run host` for the website to check for errors, build and then host locally on the router.

## Starting the Backend

1. Navigate to the frontend folder in the repository (run `npm install` if needed, to install the dependencies.)
2. Enter the `/src` folder in the terminal.
3. Run `npm run host` to start up the backend.
4. The backend is now accessible from the url of the device running it, on the port specified near the bottom of the `server.js` file, which should be `8080`.

## Backend Routes

> **All routes must start with `/ncalf/draft` after the ip and port of the server. E.g `http://192.168.1.16:8080/ncalf/draft/{route}`**

| Route                             | HTTP Method | Description                                                                                                                                                          |
| --------------------------------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/teams/stats/:season`            | GET         | Retrieves a summary of all teams                                                                                                                                     |
| `/player/stats/:season/:id`       | GET         | Retrivies the 5 year summary data for a player                                                                                                                       |
| `/player/name/:season/:id`        | GET         | Retrieves a player's name                                                                                                                                            |
| `/player/image/:season/:id`       | GET         | Retrieves a player's image                                                                                                                                           |
| `/players/sold/:season/:club_id`  | GET         | Retrieves the list of sold players in order of recency                                                                                                               |
| `/players/unsold/:season/:posn`   | GET         | Retrieves the list of unsold players for a given position                                                                                                            |
| `/players/positionstotal/:season` | GET         | Retrieves the total players for each position                                                                                                                        |
| `/player/sell`                    | PUT         | Sells a player to a team. Payload: `{"ncalf_club": (ncalf_club_id), "price": (price), "season": (current_season), "player_season_id": (id), "position": (position)}` |
| `/player/undosale`                | PUT         | Undoes the sale of a player to a team. Payload: `{"season": (current_season), "player_season_id": (id)}`                                                             |
| `/updatecurrentposition`          | PUT         | Updates the current position. Payload: `{"new_position": (new_position)}`                                                                                            |
| `/player/updaterookieposition`    | PUT         | Updates the position for a rookie. Payload: `{"player_id": (player_season_id), "season": (current_season), "position": (position)}`                                  |
| `/player/marknominated`           | PUT         | Marks a player as nominated. Payload: `{"player_id": (player_season_id), "season": (current_season)}`                                                                |
