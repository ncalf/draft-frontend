import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Route, Switch } from "wouter";
import NotFoundScreen from "./components/404-screen";
import Dashboard from "./components/dashboard";
import LandingScreen from "./components/landing-screen";

const queryClient = new QueryClient();

function AppWrapper() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <App />
        <ReactQueryDevtools />
      </QueryClientProvider>
    </>
  );
}

function App() {
  return (
    <>
      <Switch>
        <Route path="/" component={LandingScreen} />
        <Route path="/dashboard" component={Dashboard} />
        <Route component={NotFoundScreen} />
      </Switch>
    </>
  );
}

export default AppWrapper;