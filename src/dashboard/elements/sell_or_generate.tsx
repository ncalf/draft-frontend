import { ChevronRight } from "lucide-react";
import { toast } from "sonner";

// prettier-ignore
import { Button,Dialog,DialogContent,DialogTrigger,Label,RadioGroup,RadioGroupItem,Select,SelectContent,SelectItem,SelectTrigger,SelectValue } from "@/components";
import { Card } from "@/components/ui/card";

import { NcalfClubID } from "@/types";
import { clubIdToName, shortenedPositionToCapitalName } from "../../shelf";

import { useDashboardStore, useSellStore } from "@/stores";
import { PlayerInfoCard } from "./player_info";

// exports the card that contains the buttons to sell the current player or generate a new one
export function SellOrGenerateCard() {
  const generateNewID = useDashboardStore((state) => state.currentPlayerInfo.generateNewID);

  const completingAction = useDashboardStore((state) => state.completingAction);

  /* 
    returns a card component with the two buttons to sell the current player or generate a new one
    the sell button is disabled if a player has not been generated
  */
  return (
    <Card className="col-start-9 col-end-11 row-start-9 row-end-13 flex flex-col space-y-2 p-2 overflow-hidden">
      <SellPlayer />
      <Button
        disabled={completingAction}
        className="h-full w-full border bg-green-500 hover:bg-green-400"
        onClick={async () => {
          generateNewID(); // generate a new player id
        }}
      >
        <ChevronRight size={64} />
      </Button>
    </Card>
  );
}

// the button to sell the player, and the dialog that appears when clicking it, containing all of the options
function SellPlayer() {
  // const playerName = useDashboardStore((state) => state.currentPlayerInfo.name);
  const playerID = useDashboardStore((state) => state.currentPlayerInfo.id);

  const dialogOpen = useSellStore((state) => state.dialogOpen);
  const setDialogOpen = useSellStore((state) => state.setDialogOpen);

  const resetStates = useSellStore((state) => state.resetStates);
  const checkValidSell = useSellStore((state) => state.checkValidSell);

  const completingAction = useDashboardStore((state) => state.completingAction);

  /* 
    if a player has not been generated, make the button just show a toast
    else, show the dialog populated with all the option components
  */
  return (
    <>
      {playerID === 0 ? (
        <Button
          disabled={completingAction}
          className="h-1/3 w-full border bg-red-500 text-2xl font-semibold hover:bg-red-400"
          onClick={() => {
            toast.error("A player has not been generated.");
          }}
        >
          Sell
        </Button>
      ) : (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger
            asChild
            onClick={() => {
              resetStates(); // make sure it doesn't use the options present last time the dialog was open
              checkValidSell(); // check if it is a valid sell (it won't be, so the button will be disabled on open until options are selected)
            }}
          >
            <Button
              className="h-1/3 w-full border bg-red-500 text-2xl font-semibold hover:bg-red-400"
              disabled={completingAction}
            >
              Sell
            </Button>
          </DialogTrigger>
          <DialogContent className="flex h-fit w-[60rem] flex-col">
            {/* <div className="col-start-1 col-end-6 row-start-1 row-end-2 text-4xl font-semibold leading-none">
              {"FirstName" in playerName && "Surname" in playerName && "club" in playerName
                ? `Sell Player: ${playerName.FirstName} ${playerName.Surname} - ${playerName.club}`
                : `Sell Player: Error getting name`}
            </div> */}
            <div>
              <PlayerInfoCard />
            </div>
            <div className="grid grid-cols-4 grid-rows-7 gap-2">
              <TeamSelect />
              <PriceSelect />
              <PositionSelector />
              <SellandGenerate />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

// the radio button list to select the team to sell the player to
function TeamSelect() {
  const setClub = useSellStore((state) => state.setClub);
  const checkValidSell = useSellStore((state) => state.checkValidSell);

  /* 
    returns a card component with the radio button list to select the team to sell the player to
    each radio button is a team name, and the value is the ncalf club id
  */
  return (
    <Card className="col-start-1 col-end-3 row-start-1 row-end-8 p-2">
      <RadioGroup
        className="flex flex-col space-y-1"
        onValueChange={(newValue) => {
          setClub(newValue); // set the club to the ncalf club id
          checkValidSell(); // re-check if it is valid to sell the player to that team
        }}
      >
        {Object.keys(clubIdToName).map((club) => {
          return (
            <div className="flex items-center space-x-2" key={club}>
              <RadioGroupItem value={club} id={club} />
              <Label htmlFor={club}>{clubIdToName[parseInt(club)]}</Label>
            </div>
          );
        })}
      </RadioGroup>
    </Card>
  );
}

// the dropdown menu allowing the user to select a price for the player
function PriceSelect() {
  const setPrice = useSellStore((state) => state.setPrice);
  const checkValidSell = useSellStore((state) => state.checkValidSell);

  /* 
    returns a card component with the dropdown menu allowing the user to select a price for the player
    the price is a string, so it is converted to a float before being used
    the dropdown menu is populated with prices from $0.00 to $10.00
  */
  return (
    <Card className="col-start-3 col-end-5 row-start-1 row-end-3 flex flex-col space-y-2 p-2">
      <div className="">Price</div>
      <Select
        onValueChange={(newValue) => {
          setPrice(newValue); // update the price state
          checkValidSell(); // re-check if it is valid to sell the player at that price
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select a price" />
        </SelectTrigger>
        <SelectContent className="h-[15rem]">
          {Array.from({ length: 100 }, (_, i) => (i + 1) * 0.1).map((value) => {
            const price = `$${value.toFixed(2).toString()}`;
            return (
              <SelectItem value={price} key={price}>
                {price}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </Card>
  );
}

// the position selector is the player is a rookie
function PositionSelector() {
  const position = useDashboardStore((state) => state.positionFilter.position);
  const setRookiePosition = useSellStore((state) => state.setRookiePosition);
  const isRookie = position === "ROOK";

  const checkValidSell = useSellStore((state) => state.checkValidSell);

  /* 
    if the player is a rookie, return a card component with the dropdown menu allowing the user to select a position for the player
    else, return a card component with the player's position
  */
  return (
    <div className="col-start-3 col-end-5 row-start-3 row-end-6">
      {isRookie ? (
        <Card className="flex flex-col space-y-2 p-2">
          <div>Position</div>
          <Select
            onValueChange={(newValue) => {
              setRookiePosition(newValue); // update the players position to the selected position
              checkValidSell(); // check if the sell is valid
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a position" />
            </SelectTrigger>
            <SelectContent>
              {["C", "D", "F", "OB", "RK"].map((value) => {
                return (
                  <SelectItem value={value} key={value}>
                    {value}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </Card>
      ) : (
        <div className="flex h-full w-full flex-col justify-center rounded-md border-2 border-dashed text-center text-muted-foreground">
          {shortenedPositionToCapitalName[position].replace("S", "")}
        </div>
      )}
    </div>
  );
}

// the button to sell the player and generate a new one
function SellandGenerate() {
  const validSell = useSellStore((state) => state.validSell);
  const sellPlayer = useDashboardStore((state) => state.currentPlayerInfo.sellPlayer);

  const ncalfClubID = useSellStore((state) => state.club);
  const rawPrice = useSellStore((state) => state.price);
  const price = parseFloat(rawPrice.replace("$", ""));

  const setDialogOpen = useSellStore((state) => state.setDialogOpen);

  const getTeamsSummaryTableData = useDashboardStore((state) => state.teamsSummaryTable.getTeamsData);
  const getSoldPlayersData = useDashboardStore((state) => state.soldPlayers.getPlayers);
  const getMvpData = useDashboardStore((state) => state.mvps.getPlayers);
  const getUnsoldPlayersData = useDashboardStore((state) => state.unsoldPlayers.getPlayers);
  const generateNewID = useDashboardStore((state) => state.currentPlayerInfo.generateNewID);

  /* 
    if the validSell state is true, return a coloured button that sells the player and generates a new one
    else, return a greyed out button that is not clickable
  */
  return (
    <div className="col-start-3 col-end-5 row-start-6 row-end-8">
      {validSell ? (
        <Button
          className="h-full w-full border bg-red-500 text-2xl font-semibold hover:bg-red-400"
          onClick={async () => {
            const backendIp = useDashboardStore.getState().backendIP;
            const season = useDashboardStore.getState().currentSeason;

            const positionFilter = useDashboardStore.getState().positionFilter.position;
            const positionToUse = positionFilter === "ROOK" ? useSellStore.getState().rookiePosition : positionFilter;

            const addOriginalRookie = useDashboardStore.getState().rookies.addOriginalRookie;

            // if the player being sold is a rookie, update his new position in the database
            // do this by sending a put reqiest containing the id, position, and season
            if (positionFilter === "ROOK") {
              await fetch(backendIp + "/player/updaterookieposition", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  player_id: useDashboardStore.getState().currentPlayerInfo.id,
                  position: positionToUse,
                  season: season,
                }),
              });

              // add the current player if to the state so it can be undone if needed later
              addOriginalRookie(useDashboardStore.getState().currentPlayerInfo.id);
            }

            const clubId = parseInt(ncalfClubID) as NcalfClubID; // convert the string value of the select to an int, treat it as type NcalfClubID
            await sellPlayer(clubId, price, positionToUse); // sell the player in the database
            useDashboardStore.getState().currentPlayerInfo.setID(0); // reset the current player id state back to 0
            getTeamsSummaryTableData(true); // retrive the new teams summary table data

            await getSoldPlayersData(); // retrieve the new sold players data
            getMvpData(); // retrieve the new mvps data

            setDialogOpen(false); // close the sell player dialog

            await getUnsoldPlayersData(); // retrieve the new unsold players data
            generateNewID(); // generate a new player
          }}
        >
          Sell and Generate
        </Button>
      ) : (
        <Button className="pointer-events-none h-full w-full border bg-gray-500 text-2xl font-semibold" disabled>
          Sell and Generate
        </Button>
      )}
    </div>
  );
}
