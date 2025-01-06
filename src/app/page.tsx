"use client";

import { Button } from "@/components/ui/button";
import { BookUser, LayoutDashboard } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function LandingScreen() {
  const router = useRouter();

  return (
    <div className="h-screen w-screen bg-white flex flex-col space-y-10 items-center justify-center z-1">
      <Image
        src="/beetroot.jpeg"
        className="w-auto h-auto"
        alt="beetroot"
        width={200}
        height={200}
      />
      <h1>NCALF Draft season_here</h1>
      <div className="flex flex-row space-x-7 h-16">
        <Button
          variant={"outline"}
          className="p-4 flex flex-row space-x-7 w-full h-full items-center justify-center"
          onClick={() => router.push("/dashboard")} // Use router.push
        >
          <LayoutDashboard />
          Dashboard
        </Button>
        <Button
          variant={"outline"}
          className="p-4 flex flex-row space-x-7 w-full h-full items-center justify-center"
          onClick={() => router.push("/team-view")} // Use router.push
        >
          <BookUser />
          Team View
        </Button>
      </div>
      <div className="text-xl text-muted-foreground text-left">
        Instructions: <br />
        Step 1: Connect to the router: SSID: NCALF Password: beetroot <br />
        Step 2: Enter this address into your browser: ip_here <br />
        Step 3: Select Team View
      </div>
    </div>
  );
}
