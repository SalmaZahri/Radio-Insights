import StatsDashboard from "@/components/StatsDashboard";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider,SidebarInset } from "@/components/ui/sidebar";

export default function Dashboard() {
  return (
    <div className="p-8">
      
      <section className="bg-white p-4 rounded-lg shadow-md">  

        <SidebarProvider>
              <AppSidebar />
              <SidebarInset>
                <StatsDashboard />
              </SidebarInset>
            </SidebarProvider>

      </section>
    </div>
  );
}
