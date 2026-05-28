import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import TabLayout from "@/components/TabLayout";
import BatteryStatus from "@/pages/BatteryStatus";
import FuelCalculator from "@/pages/FuelCalculator";
import HomeSolar from "@/pages/HomeSolar";
import Converter from "@/pages/Converter";
import NotFound from "@/pages/NotFound";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
      retry: 2,
      staleTime: 5_000,
      gcTime: 30_000,
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <WouterRouter>
          <TabLayout>
            <Switch>
              <Route path="/fuel" component={FuelCalculator} />
              <Route path="/home-solar" component={HomeSolar} />
              <Route path="/" component={BatteryStatus} />
              <Route path="/converter" component={Converter} />
              <Route component={NotFound} />
            </Switch>
          </TabLayout>
        </WouterRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
