import "./index.css";

import { SidebarProvider, SidebarTrigger } from "./components/ui/sidebar";
import { AppSidebar } from "./components/shadcn/app-sidebar";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ResearchPage from "./pages/ResearchPage";
import PostsPage from "./pages/PostsPage";
import NotFound from "./pages/NotFound";

export function App() {
  return (
    <SidebarProvider className="flex">
      <AppSidebar />
      <main className="flex flex-1">
        <SidebarTrigger />
        <div className="p-3 flex-1">
          <Router>
            <Routes>
              <Route path="/" element={<PostsPage />} />
              <Route path="/research" element={<ResearchPage />} />
              <Route path="/*" element={<NotFound />} />
            </Routes>
          </Router>
        </div>
      </main>
    </SidebarProvider>
  );
}

export default App;
