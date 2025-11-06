import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Home, FilePlus2, History, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function AppSidebar() {
  const navigate = useNavigate();

  return (
    <Sidebar>
      <SidebarContent>
        {/* Judul Aplikasi */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-200">
          <Sparkles className="w-5 h-5 text-indigo-500" />
          <h1 className="text-lg font-semibold text-gray-800">
            AI Content Generator
          </h1>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => navigate("/")}>
                  <Home className="w-4 h-4" />
                  <span>Dashboard</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => navigate("/buat")}>
                  <FilePlus2 className="w-4 h-4" />
                  <span>Buat Konten</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => navigate("/history")}>
                  <History className="w-4 h-4" />
                  <span>Riwayat</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
