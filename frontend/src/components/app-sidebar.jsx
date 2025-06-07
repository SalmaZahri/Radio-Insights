import * as React from "react";
import {
  BarChart3,
  BookOpenCheck,
  HomeIcon,
  LayoutDashboard,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";

import { useEffect, useState } from "react";
import axios from "axios";

export function AppSidebar({ ...props }) {
  const [username, setUsername] = useState("Non connecté ?");
  const [email, setEmail] = useState("Cliquez pour vous connecter.");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // 👈 état de chargement

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.get("http://localhost:5000/api/user/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const user = response.data.data.user;

        setUsername(user.username);
        setEmail(user.email);
        setIsAdmin(user.is_admin);
      } catch (error) {
        console.error("❌ Erreur lors de la récupération de l'utilisateur :", error);
      } finally {
        setIsLoading(false); // ✅ Fin du chargement
      }
    };

    fetchUser();
  }, []);

  // Affichage temporaire pendant le chargement
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-600 dark:text-gray-300 text-lg">
          
          Chargement du menu...
        </div>
      </div>
    );
  }

  // Menu principal
  const navItems = [
    {
      title: "Radios",
      url: "/",
      icon: HomeIcon,
      items: [],
    },
    {
      title: "Statistiques",
      url: "/dashboard",
      icon: BarChart3,
      items: [],
    },
    {
      title: "Guide de la plateforme",
      url: "/guide",
      icon: BookOpenCheck,
      items: [],
    },
  ];

  // Ajouter "Admin Dashboard" si l'utilisateur est admin
  if (isAdmin) {
    navItems.push({
      title: "Admin Dashboard",
      url: "/adminDashboard",
      icon: LayoutDashboard,
      items: [],
    });
  }

  const user = {
    name: username,
    email: email,
    avatar: "/radiosImg.png", // image par défaut
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
          RadioInsights
        </h2>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={navItems} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
