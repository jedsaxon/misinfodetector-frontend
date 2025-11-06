import {
  BrainCircuit,
  ChevronUp,
  Home,
  MessagesSquare,
  User2,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenu,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Link, useNavigate } from "react-router-dom";

// Menu items.
const items = [
  {
    title: "Posts",
    url: "/",
    icon: MessagesSquare,
  },
  {
    title: "Our Research",
    url: "/research",
    icon: BrainCircuit,
  },
];

export function AppSidebar() {
  const navigate = useNavigate();

  const sidebarItems = items.map((item, idx) => (
    <SidebarMenuItem key={idx}>
      <SidebarMenuButton asChild onClick={() => navigate(item.url)}>
        <span>
          <item.icon />
          <span>{item.title}</span>
        </span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  ));

  return (
    <nav>
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Application</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>{sidebarItems}</SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton>
                    <User2 /> Username
                    <ChevronUp className="ml-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="top"
                  className="w-[--radix-popper-anchor-width]"
                >
                  <DropdownMenuItem onClick={() => navigate("/account")}>
                    <span>Account</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    </nav>
  );
}
