import "./index.css";

import { SidebarProvider } from "./components/ui/sidebar";
import { AppSidebar } from "./components/shadcn/app-sidebar";
import { Route, Routes } from "react-router-dom";
import ResearchPage from "./pages/ResearchPage";
import PostsPage from "./pages/PostsPage";
import NotFound from "./pages/NotFound";
import AccountPage from "./pages/AccountPage";
import SinglePostPage from "./pages/SinglePostPage";

export function App() {
  return (
    <SidebarProvider className="flex">
      <AppSidebar />
      <main className="flex flex-1 flex-col p-3 g-3">
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<PostsPage />} />
            <Route path="/posts/:id" element={<SinglePostPage />} />
            <Route path="/research" element={<ResearchPage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/*" element={<NotFound />} />
          </Routes>
        </div>
      </main>
    </SidebarProvider>
  );
}

export default App;
