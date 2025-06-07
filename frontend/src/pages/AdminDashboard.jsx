import { AppSidebar } from "@/components/app-sidebar";
import { DataTable } from "@/components/data-table";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import TotalRadiosCard from "@/components/CustomComponents/TotalRadiosCard";
import TotalUsersCard from "@/components/CustomComponents/TotalUsersCard";
import CustomTableAdmin  from "@/components/CustomComponents/customTableAdmin";

export default function AdminDashboard() {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex gap-4 py-4 md:gap-6 md:py-6">
              <TotalRadiosCard />
              <TotalUsersCard />
            </div>
            <CustomTableAdmin/>
            
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
