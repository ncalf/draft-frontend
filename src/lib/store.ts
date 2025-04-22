"use client";

// import { create } from "zustand";
// import { persist } from "zustand/middleware";
import { Position, PositionState } from "@/lib/types";
import { atom, useAtom } from "jotai";

interface DashboardStore {
  position: PositionState;
  availablePositions: Position[];
  currentPlayer: number | undefined;
}

export const positionAtom = atom<PositionState>(undefined)
export const availablePositionsAtom = atom<Position[]>(["C", "D", "F", "OB", "RK"])
export const currentPlayerAtom = atom<number | undefined>(undefined)

// export const useDashboardStore = create<DashboardStore>()(
//   persist(
//     () =>
//       ({
//         position: undefined,
//         availablePositions: ["C", "D", "F", "OB", "RK"],
//         currentPlayer: undefined,
//       } as DashboardStore),
//     {
//       name: "dashboard-storage",
//     }
//   )
// );
