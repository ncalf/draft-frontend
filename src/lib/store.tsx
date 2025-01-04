import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Position, PositionState } from "./types";

interface DashboardStore {
  position: PositionState;
  availablePositions: Position[];
  currentPlayer: number | undefined;
}

export const useDashboardStore = create<DashboardStore>()(
  persist(
    () =>
      ({
        position: undefined,
        availablePositions: ["C", "D", "F", "OB", "RK"],
        currentPlayer: undefined,
      }) as DashboardStore,
    {
      name: "dashboard-storage",
    },
  ),
);
