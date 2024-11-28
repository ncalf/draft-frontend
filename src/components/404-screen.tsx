import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

export default function NotFoundScreen() {
  const [, navigate] = useLocation();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-6 text-center">404 Page Not Found</h1>
      <Button variant="default" size="lg" onClick={() => navigate("/")}>
        <ArrowLeft />
        Go back home
      </Button>
    </div>
  );
}
