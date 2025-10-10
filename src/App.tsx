import "./index.css";

import { SidebarProvider, SidebarTrigger } from "./components/ui/sidebar";
import { AppSidebar } from "./components/shadcn/app-sidebar";

export function App() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main>
        <SidebarTrigger />
        <div className="p-3">
            <h1 className="text-xl">Hello, World</h1>
            <p>This is the Application</p>
        </div>
      </main>
    </SidebarProvider>
  );
}

export default App;
