import { Routes, Route } from "react-router-dom";
import { Dashboard } from "./components/dashboard";
import { ContentCreation } from "./components/content-creation";
import { History } from "./components/history";
import { HistoryDetail } from "./components/historydetail";
import { Sidebar, SidebarProvider } from "./components/ui/sidebar";
import { AppSidebar } from "./components/app-sidebar";

function App() {
  return (
    <SidebarProvider>
        <AppSidebar/>
        <main className="w-full p-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/buat" element={<ContentCreation />} />
            <Route path="/history" element={<History />} />
            <Route path="/history/:id" element={<HistoryDetail />} />
          </Routes>
        </main>
    </SidebarProvider>
  );
}

export default App;
