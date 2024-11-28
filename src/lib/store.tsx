import { create } from "zustand";
import { PositionState } from "./types";

interface DashboardStore {
  position: PositionState;
}

export const useDashboardStore = create<DashboardStore>(() => ({
  position: "RK",
}));
