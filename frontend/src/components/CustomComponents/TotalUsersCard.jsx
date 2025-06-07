// src/components/CustomComponents/TotalUsersCard.jsx
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { TrendingUpIcon } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";

export default function TotalUsersCard() {
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    const fetchTotalUsers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/user/count");
        setTotalUsers(res.data.totalUsers);
      } catch (err) {
        console.error("Erreur lors de la récupération du total des utilisateurs :", err);
      }
    };

    fetchTotalUsers();
  }, []);

  return (
    <Card className="ml-4 w-full max-w-xs @container/card">
      <CardHeader className="relative">
        <CardDescription>Nombre total d'utilisateurs</CardDescription>
        <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
          {totalUsers}
        </CardTitle>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1 text-sm">
        <div className="line-clamp-1 flex gap-2 font-medium">
          {totalUsers > 0 ? "Utilisateurs actifs" : "Aucun utilisateur"}
          <TrendingUpIcon className="size-4" />
        </div>
      </CardFooter>
    </Card>
  );
}
