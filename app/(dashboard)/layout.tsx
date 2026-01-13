import { DashboardSidebar } from "@/components/DashboardSidebar";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/card";

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
      <Card className="max-w-4xl w-full py-0 overflow-hidden">
        <div className="flex min-h-[600px] h-full">
          <DashboardSidebar />
          <div className="flex-1 p-4 flex flex-col">
            {children}
          </div>
        </div>
      </Card>
    </div>
  );
}
