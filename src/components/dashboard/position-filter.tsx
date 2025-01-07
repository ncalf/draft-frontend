"use client";

import { Card } from "@/components/ui/card";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useDashboardStore } from "@/lib/store";
import { Position, positions } from "@/lib/types";
import { positionShortenedNameToFullName } from "@/lib/utils";
import { useRef, useState } from "react";
import SlotCounter, { SlotCounterRef } from "react-slot-counter";

export function PositionFilterCard() {
  const position = useDashboardStore((state) => state.position) || "none";
  const [startingValue, setStartingValue] = useState(
    positionShortenedNameToFullName(position, true)
  );
  const [isAnimating, setIsAnimating] = useState(false);

  const availablePositions = useDashboardStore(
    (state) => state.availablePositions
  );
  const dummyCharacters = ["CENTRE", "DEFENDER", "FORWARD", "ONBALLER", "RUCK"];
  const counterRef = useRef<SlotCounterRef>(null);

  const handlePositionChange = (
    newPosition: Position,
    quickSwitch: boolean
  ) => {
    if (isAnimating) return;

    console.log(`Changing position to: ${newPosition}`);
    setIsAnimating(true);
    useDashboardStore.setState({ position: newPosition });

    if (quickSwitch) {
      counterRef.current?.startAnimation({
        duration: 0.5,
        dummyCharacterCount: 0,
      });
    }
    setTimeout(() => {
      const newStartingValue = positionShortenedNameToFullName(
        newPosition,
        true
      );
      setStartingValue(newStartingValue);
      setIsAnimating(false);
    }, 700);
  };

  const handleGenerateNewPosition = () => {
    if (isAnimating || availablePositions.length === 0) return;

    // Pick a random index
    const randomIndex = Math.floor(Math.random() * availablePositions.length);
    const newPosition = availablePositions[randomIndex];

    // Remove the selected position from availablePositions
    const updatedAvailablePositions = availablePositions.filter(
      (pos) => pos !== newPosition
    );
    useDashboardStore.setState({
      availablePositions: updatedAvailablePositions,
    });

    // Trigger animation to the new position
    handlePositionChange(newPosition, false);
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div className="col-start-1 col-end-6 row-start-8 row-end-9 flex items-center justify-center overflow-hidden">
          <Card className="cursor flex h-full w-full cursor-pointer justify-center overflow-hidden">
            <SlotCounter
              ref={counterRef}
              containerClassName="font-semibold text-6xl transform -translate-y-1.5"
              startValue={[startingValue]}
              value={[positionShortenedNameToFullName(position, true)]}
              dummyCharacters={dummyCharacters}
              duration={3}
              dummyCharacterCount={12}
              autoAnimationStart={false}
            />
          </Card>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-52">
        <ContextMenuItem
          onClick={handleGenerateNewPosition}
          disabled={availablePositions.length === 0 || isAnimating}
        >
          Generate New Position
        </ContextMenuItem>
        <ContextMenuSub>
          <ContextMenuSubTrigger>Set Position</ContextMenuSubTrigger>
          <ContextMenuSubContent>
            {positions.map((shortenedPosition) => (
              <ContextMenuItem
                key={shortenedPosition}
                disabled={position === shortenedPosition || isAnimating}
                onClick={() => {
                  handlePositionChange(shortenedPosition, true);
                }}
              >
                {positionShortenedNameToFullName(shortenedPosition)}
              </ContextMenuItem>
            ))}
          </ContextMenuSubContent>
        </ContextMenuSub>
      </ContextMenuContent>{" "}
    </ContextMenu>
  );
}
