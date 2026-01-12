import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  return (
    <div className="flex justify-center items-center">
      <SidebarProvider defaultOpen={true} className="max-w-4xl">
        <DashboardSidebar />
        <SidebarInset className="min-h-0">
          <div className="flex flex-1 flex-col w-full p-4">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
