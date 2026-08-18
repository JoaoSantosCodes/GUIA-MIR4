import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import GuideLayout from "./components/GuideLayout";
import Home from "./pages/Home";
import Spirits from "./pages/Spirits";
import Codex from "./pages/Codex";
import Farm from "./pages/Farm";
import Classes from "./pages/Classes";
import Economy from "./pages/Economy";
import Raids from "./pages/Raids";
import Profile from "./pages/Profile";
import ScrollToTop from "./components/ScrollToTop";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/espiritos"} component={Spirits} />
      <Route path={"/codex"} component={Codex} />
      <Route path={"/farm"} component={Farm} />
      <Route path={"/classes"} component={Classes} />
      <Route path={"/economia"} component={Economy} />
      <Route path={"/raids"} component={Raids} />
      <Route path={"/perfil"} component={Profile} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster position="bottom-right" theme="dark" />
          <ScrollToTop />
          <GuideLayout>
            <Router />
          </GuideLayout>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
