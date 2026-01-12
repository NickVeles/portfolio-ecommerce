"use client";

import { usePathname } from "next/navigation";
import { useClerk } from "@clerk/nextjs";
import { ShoppingBag, Settings, LogOut } from "lucide-react";
import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Card } from "@/components/ui/card";

const navigationItems = [
  {
    title: "Order History",
    href: "/orders",
    icon: ShoppingBag,
  },
  {
    title: "User Settings",
    href: "/settings",
    icon: Settings,
  },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const { signOut } = useClerk();

  const handleSignOut = () => {
    signOut();
  };

  return (
    <Sidebar collapsible="none" className="hidden md:flex">
      <Card className="min-h-[600px] flex flex-col justify-between py-0 gap-2">
        <SidebarHeader className="pb-0">
          <h2 className="text-lg font-semibold px-2">Dashboard</h2>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {navigationItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        className="gap-2 h-10"
                      >
                        <Link href={item.href}>
                          <item.icon className="size-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className="gap-2 h-10 text-destructive hover:text-destructive hover:bg-sidebar-accent cursor-pointer"
              >
                <button onClick={handleSignOut}>
                  <LogOut className="size-4" />
                  <span>Sign Out</span>
                </button>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Card>
    </Sidebar>
  );
}
