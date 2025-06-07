import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

import CustomTable from "./customTable"

export default function RadioDashboard() {
  return (
    
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        
        <CustomTable/>
      </SidebarInset>
    </SidebarProvider>
  )
}
