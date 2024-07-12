import { useRef } from "react";
import SlotCounter, { SlotCounterRef } from "react-slot-counter";
import { toast } from "sonner";

// prettier-ignore
import { Card,ContextMenu,ContextMenuContent,ContextMenuItem,ContextMenuSub,ContextMenuSubContent,ContextMenuSubTrigger,ContextMenuTrigger } from "@/components";

import { useDashboardStore, usePositionStore } from "@/stores";
import { shortenedPositionToCapitalName, shortenedPositionToName } from "../../shelf";
import { Position, PositionState } from "../../types";

// exports the position filter card component, that contains a slot-machine display that shows the position filter that can be right-clicked to show a context menu
export function PositionFilterCard() {
  const positionFilter = useDashboardStore((state) => state.positionFilter.position);
  const startingValue = usePositionStore((state) => state.startingValue);

  const counterRef = useRef(null);

  const dummyCharacters = ["CENTRES", "DEFENDERS", "FORWARDS", "ONBALLERS", "RUCKS"];
  /* 
    returns a card component with the position filter slot machine display
    when right clicked, it shows a context menu with the option to generate a new position or select a specific one
  */
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div className="col-start-1 col-end-6 row-start-8 row-end-9 flex items-center justify-center overflow-hidden">
          <Card className="cursor flex h-full w-full cursor-pointer justify-center overflow-hidden">
            <SlotCounter
              ref={counterRef}
              containerClassName="pt-1 text-center font-semibold w-full h-full"
              charClassName="text-5xl"
              startValue={[shortenedPositionToCapitalName[startingValue]]}
              value={[shortenedPositionToCapitalName[positionFilter]]}
              autoAnimationStart={false}
              dummyCharacters={dummyCharacters}
              dummyCharacterCount={0}
            />
          </Card>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-52">
        <GenerateNewPosition counterRef={counterRef} dummyCharacters={dummyCharacters} />
        <SelectPosition counterRef={counterRef} />
      </ContextMenuContent>
    </ContextMenu>
  );
}

// the first menu item to generate a new position
function GenerateNewPosition({
  counterRef,
  dummyCharacters,
}: {
  counterRef: React.RefObject<SlotCounterRef>;
  dummyCharacters: string[];
}) {
  const setPositionFilter = useDashboardStore((state) => state.positionFilter.setPosition);
  const positionFilter = useDashboardStore((state) => state.positionFilter.position);

  const setStartingValue = usePositionStore((state) => state.setStartingValue);
  const setAnimationPlaying = usePositionStore((state) => state.setAnimationPlaying);

  const getUnsoldPlayersData = useDashboardStore((state) => state.unsoldPlayers.getPlayers);
  const getInitialNumPlayers = useDashboardStore((state) => state.unsoldPlayers.getInitialNumPlayers);

  const getAvailablePositions = useDashboardStore((state) => state.positionFilter.getAvailablePositions);
  const removeAvailablePosition = useDashboardStore((state) => state.positionFilter.removeAvailablePosition);

  /* 
    returns a context menu item that generates a new position when clicked
  */
  return (
    <ContextMenuItem
      onClick={async () => {
        useDashboardStore.setState({ completingAction: true }); // change the player info card to loadng
        useDashboardStore.getState().currentPlayerInfo.setID(0);

        getAvailablePositions(); // update the available positions list
        const positionList: Position[] = useDashboardStore.getState().positionFilter.availablePositions;

        // if position list is empty, then all positions have been nominated, so a toast is shown and the function returns
        if (positionList.length == 0) {
          toast.error("All positions have been nominated.");
          useDashboardStore.setState({ completingAction: false });
          return;
        }

        // picks a random index from the position list for the slot-machine to land on
        const randomIndex = Math.floor(Math.random() * positionList.length);
        const randomPosition: Position = positionList[randomIndex];

        setStartingValue(positionFilter); // sets the starting value state to the CURRENT position filter value
        setAnimationPlaying(true); // set the animation playing state to true so other components can react if needed

        setPositionFilter(randomPosition); // save the NEW position filter
        removeAvailablePosition(randomPosition); // remove the position from the available positions list

        getUnsoldPlayersData(); // udate the unsold players data
        getInitialNumPlayers(); // update the initial number of players data

        counterRef.current?.startAnimation({ duration: 3, dummyCharacterCount: dummyCharacters.length * 5 }); // start the slot-machine animation

        // queue the action of setting the animation player state back to false, to the during of the animation, 3 seconds
        setTimeout(() => {
          setAnimationPlaying(false);
          useDashboardStore.setState({ completingAction: false });
        }, 3000);
      }}
    >
      Generate New Position
    </ContextMenuItem>
  );
}

// the list of positions that are shown in the select position context menu
function SelectPosition({ counterRef }: { counterRef: React.RefObject<SlotCounterRef> }) {
  const shortenedPositionList: PositionState[] = ["C", "D", "F", "OB", "RK", "ROOK"];
  const setStartingValue = usePositionStore((state) => state.setStartingValue);

  const setAnimationPlaying = usePositionStore((state) => state.setAnimationPlaying);

  const setPositionFilter = useDashboardStore((state) => state.positionFilter.setPosition);
  const positionFilter = useDashboardStore((state) => state.positionFilter.position);

  const getUnsoldPlayersData = useDashboardStore((state) => state.unsoldPlayers.getPlayers);
  const getInitialNumPlayers = useDashboardStore((state) => state.unsoldPlayers.getInitialNumPlayers);

  /* 
    returns a context menu sub section, that within it contains context menu items for each position
    if the context menu item matches the current position, it it disabled (mad unclickable)
    on click, it changes the position filter to the position that was clicked
  */
  return (
    <ContextMenuSub>
      <ContextMenuSubTrigger>Select Position</ContextMenuSubTrigger>
      <ContextMenuSubContent>
        {shortenedPositionList.map((position) => {
          return (
            <ContextMenuItem
              disabled={positionFilter == position}
              key={position}
              onClick={async () => {
                useDashboardStore.setState({ completingAction: true }); // reset the player info card so the previous player's info isn't still shown
                useDashboardStore.getState().currentPlayerInfo.setID(0);

                setStartingValue(positionFilter); // sets the starting value state to the CURRENT position filter value
                setAnimationPlaying(true); // set the animation playing state to true so other components can react if needed

                setPositionFilter(position); // save the NEW position filter
                getUnsoldPlayersData(); // udate the unsold players data
                getInitialNumPlayers(); // update the initial number of players data

                counterRef.current?.startAnimation({ duration: 0.5, dummyCharacterCount: 0 }); // start the lot machine animation, but for only half a second and with no dummy characters

                // queue the action of setting the animation player state back to false, to the during of the animation, 0.5 seconds
                setTimeout(() => {
                  setAnimationPlaying(false);
                  useDashboardStore.setState({ completingAction: false });
                }, 500);
              }}
            >
              {shortenedPositionToName[position] + "s"}
            </ContextMenuItem>
          );
        })}
      </ContextMenuSubContent>
    </ContextMenuSub>
  );
}
