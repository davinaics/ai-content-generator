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
    <Sidebar className="bg-surface text-text-secondary border-r border-border-dark">
      <SidebarContent>
        {/* Header + Subjudul */}
        <div className="border-b border-border-light p-5 space-y-2">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-6 h-6 text-accent" />
            <h1 className="text-lg font-bold tracking-wide text-text-primary">
              AI Content Generator
            </h1>
          </div>
          <p className="text-xs leading-relaxed text-text-secondary">
            Buat konten lebih cepat dan lebih mudah. Cocok untuk kebutuhan
            edukasi, promosi, dan copywriting. Saat ini belum mendukung
            pembuatan konten gambar.
          </p>
        </div>

        {/* Menu */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-text-muted px-5 pt-5 text-xs uppercase tracking-wider">
            Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="mt-2 space-y-1">
              {[
                { name: "Dashboard", icon: Home, path: "/" },
                { name: "Buat Konten", icon: FilePlus2, path: "/buat" },
                { name: "Riwayat", icon: History, path: "/history" },
              ].map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton
                    onClick={() => navigate(item.path)}
                    className="
                      flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm
                      hover:bg-active/30 hover:text-text-primary
                      transition-all duration-200
                    "
                  >
                    <item.icon className="size-4 text-accent" />
                    <span className="font-medium">{item.name}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
