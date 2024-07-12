import { Button } from "@/components";
import { Dashboard } from "@/dashboard/dashboard";
import { Teamview } from "@/teamview/teamview";
import { BookUser, LayoutDashboard } from "lucide-react";
import beetroot from "./assets/beetroot.jpeg";

import { toast } from "sonner";
import { useDashboardStore, useWebsiteStore } from "./stores";

// the component that first renders upon opening the website
function Website() {
  const viewMode = useWebsiteStore((state) => state.viewMode);

  // renders the needed component based on the viewMode state
  return <>{viewMode === "dashboard" ? <Dashboard /> : viewMode === "team_view" ? <Teamview /> : <OpeningScreen />}</>;
}

// the screen that labels the website and gives the option to either open the dashboard or open teamview
function OpeningScreen() {
  const backendIp = useDashboardStore((state) => state.backendIP);
  const season = useDashboardStore((state) => state.currentSeason);

  const setViewMode = useWebsiteStore((state) => state.setViewMode);

  // returns the component to render
  return (
    <>
      <Button
        onClick={() => {
          localStorage.clear();
          toast.success("Local storage has been cleared");
        }}
      >
        Clear Local Storage
      </Button>
      <div className="h-screen w-screen bg-white flex flex-col space-y-10 items-center justify-center z-1">
        <img src={beetroot} className="" />
        <h1>NCALF Draft {season}</h1>
        <div className="flex flex-row space-x-7 h-16">
          <Button
            variant={"outline"}
            className="p-4 flex flex-row space-x-7 w-full h-full items-center justify-center"
            onClick={() => {
              setViewMode("dashboard");
            }}
          >
            <LayoutDashboard className="w-fit h-fit p-2" />
            Dashboard
          </Button>
          <Button
            variant={"outline"}
            className="p-4 flex flex-row space-x-7 w-full h-full items-center justify-center"
            onClick={() => {
              setViewMode("team_view");
            }}
          >
            <BookUser className="w-fit h-fit p-2" />
            Team View
          </Button>
        </div>
        <div className="text-xl text-muted-foreground text-left">
          Instructions: <br />
          Step 1: Connect to the router: SSID: NCALF Password: beetroot <br />
          Step 2: Enter this address into your browser: {backendIp.replace(":8080/ncalf/draft/", "")}:5173/ <br />
          Step 3: Select Team View
        </div>
      </div>
    </>
  );
}

export default Website; // export the Website component as the file's default, so other files simply have to import this file
