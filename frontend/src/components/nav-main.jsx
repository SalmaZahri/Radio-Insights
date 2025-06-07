"use client"

import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

export function NavMain({ items }) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-gray-900 dark:text-gray-200">
        Platform
      </SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  onClick={item.onClick || undefined}
                  className={`
                    flex items-center gap-3 px-3 py-2 
                    text-sm font-medium 
                    text-gray-900 dark:text-white 
                    bg-transparent 
                    hover:bg-gray-800 dark:hover:bg-gray-700 
                    hover:text-white dark:hover:text-white 
                    active:bg-gray-900 dark:active:bg-gray-800 
                    active:text-white dark:active:text-white 
                    rounded-md 
                    transition-all duration-200 
                    focus:outline-none focus:ring-2 focus:ring-gray-300
                  `}
                >
                  {item.items.length > 0 ? (
                    <button>
                      {item.icon && <item.icon className="w-5 h-5 text-gray-700 dark:text-gray-300 group-hover:text-white dark:group-hover:text-white" />}
                      <span>{item.title}</span>
                      <ChevronRight
                        className="ml-auto w-5 h-5 text-gray-700 dark:text-gray-300 group-hover:text-white dark:group-hover:text-white transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
                      />
                    </button>
                  ) : (
                    <Link to={item.url} onClick={item.onClick}>
                      {item.icon && <item.icon className="w-5 h-5 text-gray-700 dark:text-gray-300 group-hover:text-white dark:group-hover:text-white" />}
                      <span>{item.title}</span>
                    </Link>
                  )}
                </SidebarMenuButton>
              </CollapsibleTrigger>
              {item.items.length > 0 && (
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton
                          asChild
                          className={`
                            px-3 py-1 
                            text-sm 
                            text-gray-600 dark:text-gray-300 
                            hover:bg-gray-700 dark:hover:bg-gray-600 
                            hover:text-white dark:hover:text-white 
                            active:bg-gray-800 dark:active:bg-gray-700 
                            active:text-white dark:active:text-white 
                            rounded-md 
                            transition-all duration-200
                          `}
                        >
                          <Link to={subItem.url}>
                            <span>{subItem.title}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              )}
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}