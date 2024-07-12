import { toast } from "sonner";
import { create } from "zustand";

// prettier-ignore
import { maxPlayersPerPosition,template } from "./shelf";
import {
  NcalfClubID,
  OriginalRookies,
  PlayerImageAPIResponse,
  PlayerNameAPIResponse,
  PlayerStatsAPIResponse,
  Position,
  PositionState,
  SoldPlayer,
  TeamsTableAPIResponse,
  TeamsTableRawAPIResponse,
  TotalPlayersAPIResponse,
  TotalPlayersRawAPIResponse,
  UnsoldPlayer,
} from "./types";

// defines a type for the dashboard state store
interface DashboardStore {
  backendIP: string;
  currentSeason: string;

  completingAction: boolean;

  currentPlayerInfo: {
    id: number; // the current player id, 0 means no player, -1 means it is loading
    generateNewID: () => void;
    getID: () => void;
    setID: (newId: number, loadData?: boolean) => void;

    image: PlayerImageAPIResponse;
    getImage: () => Promise<void>;
    imageLoading: boolean;

    name: PlayerNameAPIResponse | object;
    getNameInfo: () => Promise<void>;
    nameLoading: boolean;

    pastStats: PlayerStatsAPIResponse[] | [];
    getPastStats: () => Promise<void>;
    pastStatsLoading: boolean;

    markPlayerNominated: (id: number) => Promise<void>;

    sellPlayerLoading: boolean;
    sellPlayer: (ncalfClub: NcalfClubID, price: number, position: string) => Promise<void>;
  };

  teamsSummaryTable: {
    teamsData: TeamsTableAPIResponse;
    getTeamsData: (refresh?: boolean) => Promise<void>;
    teamsLoading: boolean;
  };

  positionFilter: {
    position: PositionState;
    getPosition: () => void;
    setPosition: (position: PositionState) => void;
    positionLoading: boolean;

    availablePositions: Position[];
    getAvailablePositions: () => void;
    removeAvailablePosition: (position: Position) => void;
  };

  soldPlayers: {
    players: SoldPlayer[];
    getPlayers: () => Promise<void>;
    loading: boolean;
  };

  unsoldPlayers: {
    isChartInactive: boolean;

    players: UnsoldPlayer[];
    getPlayers: (refresh?: boolean) => Promise<void>;
    playersLoading: boolean;

    initialNumPlayers: number;
    getInitialNumPlayers: () => Promise<void>;
    initialNumPlayersLoading: boolean;
  };

  mvps: {
    players: SoldPlayer[];
    getPlayers: () => Promise<void>;
    loading: boolean;
  };

  rookies: {
    originalRookies: OriginalRookies;
    getOriginalRookies: () => void;
    addOriginalRookie: (player_id: number) => void;
    removeOriginalRookie: (player_id: number) => void;
  };
}

/* 
  creates the main dashboard state store, which contains all of the global states needed for the dashboard to operate:
  - (nearly) all function have a try and catch statement, which will display a toast error message if an error occurs 
  - states which directly correspond to a visual element have a loading state, which is stores whether their data is in the proccess of being fetched
*/
export const useDashboardStore = create<DashboardStore>()((set, get) => ({
  backendIP: "http://192.168.1.28:8080/ncalf/draft/",
  // backendIP: "http://10.1.1.110:8080/ncalf/draft/",
  currentSeason: "2024",
  completingAction: false,

  currentPlayerInfo: {
    id: 0,
    generateNewID: () => {
      // generateNewID: picks a random player id, and re-render all the info elements subsequently

      try {
        const unsoldPlayers = get().unsoldPlayers.players;
        const unsoldPlayersLoading = get().unsoldPlayers.playersLoading;

        // if the unsold player are still loading, a new ID cannot be generated, since it uses the unsold player list to pick a new id
        // show a toast if needed, else continue wih the code
        if (unsoldPlayersLoading) {
          toast.info("Cannot generate new ID while unsold players are loading");
        } else {
          // filter the unsoldPlayers list to only include players who have not previously been nominated
          const unsoldPlayersFiltered = unsoldPlayers.filter((player) => player.nominated === 0);

          // if a position has not been selected, send feedback to the user and stop the generate action
          const positionFilter = get().positionFilter.position;
          if (positionFilter === "none") {
            toast.info("Please select a position");
            return;
          }

          // check that the filtered unsold players list is empty, meaning that all players in the position would have been already nominated
          // if this is the case, show feedback to the user and stop the generate action
          if (unsoldPlayersFiltered.length === 0) {
            toast.info("No players remaining. Please select new position.");
            return;
          }

          // pick a random player by generating a random number between 0 and 1, multiplaying it by the number of players there is
          // then, it is rounded to an integer, and the PlayerSeasonID of the player at that index in the list is saved
          const randomPlayer = unsoldPlayersFiltered[Math.floor(Math.random() * unsoldPlayersFiltered.length)];
          const randomID = randomPlayer.PlayerSeasonID;

          set((state) => ({ currentPlayerInfo: { ...state.currentPlayerInfo, id: randomID } })); // update the state to include the new change
          useDashboardStore.getState().currentPlayerInfo.markPlayerNominated(randomID); // mark the new player as nominated so it wont get picked again

          const getImage = get().currentPlayerInfo.getImage;
          const getName = get().currentPlayerInfo.getNameInfo;
          const getPastStats = get().currentPlayerInfo.getPastStats;

          // triger fetches for all of the player info components
          getImage();
          getName();
          getPastStats();
        }
      } catch (error) {
        toast.error("Error generating new ID");
      }
    },
    getID: () => {
      try {
        const stored = localStorage.getItem("current_player_id");
        if (stored == undefined) {
          localStorage.setItem("current_player_id", "0"); // if it is undefined, set it to 0
          set((state) => ({ currentPlayerInfo: { ...state.currentPlayerInfo, id: 0 } }));
          return;
        }
        const id = parseInt(stored);
        set((state) => ({ currentPlayerInfo: { ...state.currentPlayerInfo, id: id } }));

        const currentPlayerId: number = get().currentPlayerInfo.id;

        if (currentPlayerId !== 0 && currentPlayerId !== -1) {
          const getImage = get().currentPlayerInfo.getImage;
          const getName = get().currentPlayerInfo.getNameInfo;
          const getPastStats = get().currentPlayerInfo.getPastStats;

          getImage();
          getName();
          getPastStats();
        }
      } catch (error) {
        toast.error("Error getting player id");
      }
    },
    setID: (newId: number, loadData: boolean = false) => {
      // setID: sets the player id state to a custom number fed into the function, with the option to re-fetch the player image, name and state

      set((state) => ({ currentPlayerInfo: { ...state.currentPlayerInfo, id: newId } })); // change the player id state to the provided number

      // if the loadData parameter == true, then re-fetch all of the player info data for a visual update
      if (loadData) {
        const getImage = get().currentPlayerInfo.getImage;
        const getName = get().currentPlayerInfo.getNameInfo;
        const getPastStats = get().currentPlayerInfo.getPastStats;

        getPastStats();
        getImage();
        getName();
      }
    },

    image: "",
    getImage: async () => {
      // getImage: uses the current player id state to fetch the base64 string of the respective players image

      try {
        set((state) => ({ currentPlayerInfo: { ...state.currentPlayerInfo, imageLoading: true } }));

        const backendIp: string = get().backendIP;
        const currentSeason: string = get().currentSeason;
        const currentPlayerId: number = get().currentPlayerInfo.id;

        // fetch the data and convert it into a json object
        const response: Response = await fetch(backendIp + "player/image/" + currentSeason + "/" + currentPlayerId);
        const data: PlayerImageAPIResponse = await response.text(); // take out the base64 string from the response

        // set the state to the new base64 image string
        set((state) => ({
          currentPlayerInfo: { ...state.currentPlayerInfo, image: data },
        }));
        set((state) => ({ currentPlayerInfo: { ...state.currentPlayerInfo, imageLoading: false } }));
      } catch (error) {
        toast.error("Error getting player image");
      }
    },
    imageLoading: true,

    name: {},
    getNameInfo: async () => {
      // getName: retrivies an object that contains all name-related info for a player, such as firstname, surname, club . . .

      try {
        set((state) => ({ currentPlayerInfo: { ...state.currentPlayerInfo, nameLoading: true } }));

        const backendIp: string = get().backendIP;
        const currentSeason: string = get().currentSeason;
        const currentPlayerId: number = get().currentPlayerInfo.id;

        // fetch the data and convert it into a json object
        const response: Response = await fetch(backendIp + "player/name/" + currentSeason + "/" + currentPlayerId); // fetch the object from the backend as a response
        const data: [PlayerNameAPIResponse] = await response.json(); // conver it into a json object

        // update the state to the new object
        set((state) => ({
          currentPlayerInfo: { ...state.currentPlayerInfo, name: data[0] },
        }));
        set((state) => ({ currentPlayerInfo: { ...state.currentPlayerInfo, nameLoading: false } }));
      } catch (error) {
        toast.error("Error getting player name");
      }
    },
    nameLoading: true,

    pastStats: [],
    getPastStats: async () => {
      // getPastStats: fetches up to  the last 4 years of a player's stats

      try {
        set((state) => ({ currentPlayerInfo: { ...state.currentPlayerInfo, pastStatsLoading: true } }));

        const backendIp: string = get().backendIP;
        const currentSeason: string = get().currentSeason;
        const currentPlayerId: number = get().currentPlayerInfo.id;

        // fetch the data and convert it into a json object
        const response: Response = await fetch(backendIp + "player/stats/" + currentSeason + "/" + currentPlayerId);
        const data: PlayerStatsAPIResponse[] = await response.json();

        // save the list of objects into the state
        set((state) => ({
          currentPlayerInfo: { ...state.currentPlayerInfo, pastStats: data },
        }));
        set((state) => ({ currentPlayerInfo: { ...state.currentPlayerInfo, pastStatsLoading: false } }));
      } catch (error) {
        toast.error("Error getting player stats");
      }
    },
    pastStatsLoading: false,

    markPlayerNominated: async (id: number) => {
      // markPlayerNominated: marks a player as nominated in the database, to ensure they wont be picked again when generating new players

      try {
        const backendIp: string = get().backendIP;
        const currentSeason: string = get().currentSeason;
        const position: string = get().positionFilter.position;

        // sets a put request to the backend api with a body of a json object contrusted from the id parameter and the current season state
        await fetch(backendIp + "/player/marknominated", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            player_id: id,
            season: currentSeason,
            position: position,
          }),
        });

        // updates the state in the frontend while assuming it is getting updated identically in the backend, to allow faster visual feedback in the ui
        // does this by mapping through ther existing unsold players state locating the player object whose player id matches that provided in the ufnction parameter
        // if the players id doesn't match, it leaves it unchanged but if it does match, it changes the players nominated value to 1
        set((state) => ({
          unsoldPlayers: {
            ...state.unsoldPlayers,
            players: state.unsoldPlayers.players.map((player) =>
              player.PlayerSeasonID === id ? { ...player, nominated: 1 } : player,
            ),
          },
        }));
      } catch (error) {
        toast.error("Error marking player as nominated");
      }
    },

    sellPlayerLoading: false,
    sellPlayer: async (ncalfClub: NcalfClubID, price: number, position: string) => {
      // sellPlayer: 'sells' a player to a team in the database

      try {
        set((state) => ({ currentPlayerInfo: { ...state.currentPlayerInfo, sellPlayerLoading: true } }));

        const backendIp: string = get().backendIP;
        const currentSeason: string = get().currentSeason;
        const currentPlayerId: number = get().currentPlayerInfo.id;

        // send a put request with a json objet as a body which includes the club, price, season, position and player id, either gotten from states or from parameters
        await fetch(backendIp + "player/sell", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ncalf_club: ncalfClub,
            price: price,
            season: currentSeason,
            player_season_id: currentPlayerId,
            position: position,
          }),
        });

        set((state) => ({ currentPlayerInfo: { ...state.currentPlayerInfo, sellPlayerLoading: false } }));
      } catch (error) {
        toast.error("Error selling player");
      }
    },
  },

  teamsSummaryTable: {
    teamsData: template,
    getTeamsData: async (refresh: boolean = false) => {
      // getTeamsData: fetches the data for each team, including all their players, the number of players in each position, and the moeny they have spent

      try {
        // only set the loading state to true if the refresh parameter is provided, and it is true
        if (refresh) set((state) => ({ teamsSummaryTable: { ...state.teamsSummaryTable, teamsLoading: true } }));

        const backendIp: string = get().backendIP;
        const currentSeason: string = get().currentSeason;

        // fetch the data and convert it into a json object
        const rawResponse: Response = await fetch(backendIp + "teams/table/" + currentSeason);
        const rawData: TeamsTableRawAPIResponse[] = await rawResponse.json();

        const templateCopy = JSON.parse(JSON.stringify(template)); // to avoid reference linking, create a new template object by stringifying and parsing the template object

        const data: TeamsTableAPIResponse = rawData.reduce(
          // in each iteration, result is the resulting object, which is set to data at the end, and playerInstance is the player object being iterated over
          (result, playerInstance) => {
            // add the player to the club's list of players
            result[playerInstance.ncalfclub].players.push(playerInstance);

            // increment the clubs position count of the current players position by 1
            result[playerInstance.ncalfclub].summary[playerInstance.posn]++;

            // add the price of the current player to their total price
            result[playerInstance.ncalfclub].summary.sum_price = parseFloat(
              (result[playerInstance.ncalfclub].summary.sum_price + parseFloat(playerInstance.price)).toFixed(2),
            );

            return result;
          },
          { ...templateCopy }, // start with the template copy object
        );

        set((state) => ({ teamsSummaryTable: { ...state.teamsSummaryTable, teamsData: data } })); // update the state with the new modified data
        if (refresh) set((state) => ({ teamsSummaryTable: { ...state.teamsSummaryTable, teamsLoading: false } }));
      } catch (error) {
        toast.error("Error getting teams data");
      }
    },
    teamsLoading: true,
  },

  positionFilter: {
    position: "none",
    getPosition: () => {
      // getPosition: simply sets the position filter on the frontend, to the position filter saved in the backend

      try {
        set((state) => ({ positionFilter: { ...state.positionFilter, positionLoading: true } }));
        const storedPositionFilter = localStorage.getItem("position_filter"); // get the position filter from the local storage

        if (storedPositionFilter == undefined) {
          localStorage.setItem("position_filter", "none"); // if it is undefined, set it to none
          set((state) => ({ positionFilter: { ...state.positionFilter, position: "none" } }));
          return;
        }

        set((state) => ({
          positionFilter: { ...state.positionFilter, position: storedPositionFilter as PositionState },
        })); // update the state with the new position filter
        set((state) => ({ positionFilter: { ...state.positionFilter, positionLoading: false } }));
      } catch (error) {
        toast.error("Error getting position filter");
      }
    },
    setPosition: (position: PositionState) => {
      // putPosition: updates the backend position filter to the provided value

      try {
        localStorage.setItem("position_filter", position); // save the position filter to the local storage
        set((state) => ({ positionFilter: { ...state.positionFilter, position: position } })); // update the state with the new position filter
      } catch (error) {
        toast.error("Error setting position filter");
      }
    },
    positionLoading: false,

    availablePositions: [],
    getAvailablePositions: async () => {
      // getAvailablePositions: fetches the list of positions and if they have been nominated or not

      try {
        set((state) => ({ positionFilter: { ...state.positionFilter, availablePositionsLoading: true } }));

        // fetch the data and convert it into a json object
        const stored = localStorage.getItem("available_positions");
        if (stored == undefined) {
          localStorage.setItem("available_positions", JSON.stringify(["C", "D", "F", "OB", "RK"])); // if it is undefined, set it to an empty list
          set((state) => ({
            positionFilter: { ...state.positionFilter, availablePositions: ["C", "D", "F", "OB", "RK"] },
          }));
          return;
        }
        const data = JSON.parse(stored);

        set((state) => ({ positionFilter: { ...state.positionFilter, availablePositions: data } })); // update the state
        set((state) => ({ positionFilter: { ...state.positionFilter, availablePositionsLoading: false } }));
      } catch (error) {
        toast.error("Error getting available positions");
      }
    },
    removeAvailablePosition: (position: Position) => {
      // removeAvailablePosition: removes a position from the list of available positions

      try {
        const newAvailablePositions = get().positionFilter.availablePositions.filter((posn) => posn !== position); // filter out the position from the list of available positions
        set((state) => ({ positionFilter: { ...state.positionFilter, availablePositions: newAvailablePositions } }));
      } catch (error) {
        toast.error("Error removing available position");
      }
    },
  },

  soldPlayers: {
    players: [],
    getPlayers: async () => {
      // getPlayers (sold): fetches a list of players that have been sold

      try {
        set((state) => ({ soldPlayers: { ...state.soldPlayers, loading: true } }));

        const backendIp: string = get().backendIP;
        const currentSeason: string = get().currentSeason;

        // fetch the data and convert it into a json object
        const response: Response = await fetch(backendIp + "players/sold/" + currentSeason);
        const data: SoldPlayer[] = await response.json();

        set((state) => ({ soldPlayers: { ...state.soldPlayers, players: data } })); // updates the state with the new data
        set((state) => ({ soldPlayers: { ...state.soldPlayers, loading: false } }));
      } catch (error) {
        toast.error("Error getting sold players");
      }
    },
    loading: true,
  },

  unsoldPlayers: {
    isChartInactive: true,

    players: [],
    getPlayers: async (refresh: boolean = false) => {
      // getPlayers (unsold): fetches a list of players that have not been sold

      try {
        // only set the loading state to true if the refresh parameter is provided, and it is true
        if (refresh) set((state) => ({ unsoldPlayers: { ...state.unsoldPlayers, playersLoading: true } }));

        const backendIp: string = get().backendIP;
        const currentSeason: string = get().currentSeason;

        const position: PositionState = get().positionFilter.position;

        // if no position filter is selected, set the state to an empty list and stop
        if (position === "none") {
          set((state) => ({
            unsoldPlayers: { ...state.unsoldPlayers, players: [] },
          }));
          set((state) => ({ unsoldPlayers: { ...state.unsoldPlayers, playersLoading: false } }));
          return;
        }

        // fetch the data and convert it into a json object
        const response: Response = await fetch(backendIp + "players/notsold/" + currentSeason + "/" + position);
        const data: UnsoldPlayer[] = await response.json();

        set((state) => ({
          unsoldPlayers: { ...state.unsoldPlayers, players: data },
        })); // update the state with the new data
        if (refresh) set((state) => ({ unsoldPlayers: { ...state.unsoldPlayers, playersLoading: false } }));
      } catch (error) {
        toast.error("Error getting unsold players");
      }
    },
    playersLoading: false,

    initialNumPlayers: 0,
    getInitialNumPlayers: async () => {
      // getInitialNumPlayers: fetches the total number of players in each position and updates the state that stores it

      try {
        set((state) => ({ unsoldPlayers: { ...state.unsoldPlayers, initialNumPlayersLoading: true } }));

        const backendIp: string = get().backendIP;
        const currentSeason: string = get().currentSeason;
        const positionFilter: PositionState = get().positionFilter.position;

        // fetch the data and convert it into a json object
        const rawResponse: Response = await fetch(backendIp + "players/positionstotal/" + currentSeason);
        const response: TotalPlayersRawAPIResponse[] = await rawResponse.json();

        // change
        const data: TotalPlayersAPIResponse = response.reduce(
          // in each iteration, result is the resulting object, which is set to data at the end, and item is the position object being iterated over
          (object, item) => {
            object[item.posn] = item["num_position"]; // set a key value pair to the object of the { position: number_of_players}
            return object;
          },
          { OB: 0, RK: 0, D: 0, C: 0, F: 0, ROOK: 0 }, // start with this empty object
        );

        let maxNumber: number;
        if (positionFilter !== "none") {
          maxNumber = data[positionFilter] || 0; // if position filter is on a position, get the total number of players in that position by accessing the value in the data object
        } else {
          maxNumber = 0;
        }

        set((state) => ({
          unsoldPlayers: { ...state.unsoldPlayers, initialNumPlayers: maxNumber },
        })); // update the state to contain the total number of players for the new position
        set((state) => ({ unsoldPlayers: { ...state.unsoldPlayers, initialNumPlayersLoading: false } }));
      } catch (error) {
        toast.error("Error getting initial number of players");
      }
    },
    initialNumPlayersLoading: true,
  },

  mvps: {
    players: [],
    getPlayers: async () => {
      // getPlayers (mvps): creates a list of the most valuable players using the sold players list

      try {
        set((state) => ({ mvps: { ...state.mvps, loading: true } }));

        const players = [...get().soldPlayers.players]; // fetches the curren list of sold players_remaining
        const mvps = players.sort((a, b) => parseFloat(b.price) - parseFloat(a.price)).slice(0, 4); // orders them to have highest price first, and only selects the first 5

        set((state) => ({ mvps: { ...state.mvps, players: mvps } })); // updates the state with the players
        set((state) => ({ mvps: { ...state.mvps, loading: false } }));
      } catch (error) {
        toast.error("Error getting MVPs");
      }
    },
    loading: true,
  },

  rookies: {
    originalRookies: [],
    getOriginalRookies: () => {
      // getOriginalRookies: fetches the list of player ids that were originally in the rookie position by using local storage
      try {
        const stored = localStorage.getItem("original_rookies");
        if (stored == undefined) {
          localStorage.setItem("original_rookies", "[]"); // if it is undefined, set it to an empty list
          set((state) => ({ rookies: { ...state.rookies, originalRookies: [] } }));
          return;
        }

        const data = JSON.parse(stored);
        set((state) => ({ rookies: { ...state.rookies, originalRookies: data } }));
      } catch (error) {
        toast.error("Error getting rookies");
      }
    },
    addOriginalRookie: (player_id: number) => {
      // addOriginalRookie: adds a player id to the rookie position list
      try {
        const newRookieList = [...get().rookies.originalRookies, player_id];
        set((state) => ({ rookies: { ...state.rookies, originalRookies: newRookieList } }));
      } catch (error) {
        toast.error("Error adding rookie position");
      }
    },
    removeOriginalRookie: (player_id: number) => {
      // removeOriginalRookie: removes a player id from the rookie position list
      try {
        const newRookieList = get().rookies.originalRookies.filter((id) => id !== player_id);
        set((state) => ({ rookies: { ...state.rookies, originalRookies: newRookieList } }));
      } catch (error) {
        toast.error("Error removing rookie position");
      }
    },
  },
}));

/* the following stores are just simple stores that replicate reacts native useState, with states and functions to change them */

// define the types for the viewMode state, and the store
type viewMode = "onboard_screen" | "dashboard" | "team_view";
interface WebsiteStore {
  viewMode: viewMode;
  setViewMode: (mode: viewMode) => void;
}

// creates a website store, containing the states for the opening page of the website
export const useWebsiteStore = create<WebsiteStore>()((set) => ({
  viewMode: "onboard_screen",
  setViewMode: (mode: viewMode) => set({ viewMode: mode }),
}));

// defines the types for the sort filter state, and the store
export type SortFilter = "PlayerSeasonID" | "gms" | "k" | "m" | "hb" | "ff" | "fa" | "g" | "b" | "ho" | "t";
interface UnsoldPlayersStore {
  dialogOpen: boolean;
  setDialogOpen: (value: boolean) => void;

  sortFilter: SortFilter;
  setSortFilter: (filter: SortFilter) => void;
}

// creates a store for the unsold players dialog, which contains the sort filter state and if the dialog is open
export const useUnsoldPlayersStore = create<UnsoldPlayersStore>()((set) => ({
  dialogOpen: false,
  setDialogOpen: (value: boolean) => set({ dialogOpen: value }),

  sortFilter: "PlayerSeasonID",
  setSortFilter: (filter: SortFilter) => set({ sortFilter: filter }),
}));

// defines the types for the position filter store
interface PositionStore {
  startingValue: PositionState;
  setStartingValue: (value: PositionState) => void;

  animationPlaying: boolean;
  setAnimationPlaying: (value: boolean) => void;
}

// creates a store for the position filter card, which contains valus needed to allow the animation to run properly
// also to let other compoennts access if it is running
export const usePositionStore = create<PositionStore>()((set) => ({
  startingValue: "none",
  setStartingValue: (value: PositionState) => set({ startingValue: value }),

  animationPlaying: false,
  setAnimationPlaying: (value: boolean) => set({ animationPlaying: value }),
}));

// defines the types for the sell store
interface Store {
  dialogOpen: boolean;
  setDialogOpen: (value: boolean) => void;

  club: string;
  setClub: (value: string) => void;

  price: string;
  setPrice: (value: string) => void;

  rookiePosition: string;
  setRookiePosition: (value: string) => void;

  validSell: boolean;
  checkValidSell: () => void;

  resetStates: () => void;
}

// creates a store for the sell dialog, which contains the states for the dialog, and the functions to change them
export const useSellStore = create<Store>()((set, get) => ({
  dialogOpen: false,
  setDialogOpen: (value: boolean) => set({ dialogOpen: value }),

  club: "",
  setClub: (value: string) => set({ club: value }),

  price: "",
  setPrice: (value: string) => set({ price: value }),

  rookiePosition: "",
  setRookiePosition: (value: string) => set({ rookiePosition: value }),

  validSell: false,
  checkValidSell: () => {
    const club = get().club;
    const price = get().price;

    // if not all of the fields are filled in, set the validSell state to false
    if (club == "" || price == "") {
      set({ validSell: false });
      return;
    }

    const teamsInfo = useDashboardStore.getState().teamsSummaryTable.teamsData;
    const position = useDashboardStore.getState().positionFilter.position;

    const sumPrice = teamsInfo[parseInt(club) as NcalfClubID].summary.sum_price;
    const numPlayers = teamsInfo[parseInt(club) as NcalfClubID].players.length;

    // if the player is a rookie, use the dropdown-selected position for the maximum player check, else users the playeres position
    const positionToUse = position === "ROOK" ? get().rookiePosition : position;

    // const maxCanSpend = parseFloat((sumPrice + (22 - numPlayers - 1) * 0.1).toFixed(2));

    // Budget check and player in position check, if it passes the player sale is valid, else it is invalid
    if (
      parseFloat((parseFloat(price.replace("$", "")) + sumPrice + (22 - numPlayers - 1) * 0.1).toFixed(2)) <= 20 &&
      teamsInfo[parseInt(club) as NcalfClubID].summary[positionToUse as Position] <
        maxPlayersPerPosition[positionToUse as Position]
    ) {
      set({ validSell: true });
    } else {
      set({ validSell: false });
    }
  },

  resetStates: () => {
    set({
      // dialogOpen: true,
      club: "",
      price: "",
      rookiePosition: "",
      validSell: false,
    });
  },
}));
