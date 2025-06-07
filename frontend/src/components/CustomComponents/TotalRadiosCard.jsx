import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import AddRadiosDrawer from "@/components/CustomComponents/AddRadiosDrawer";

import { TrendingUpIcon } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";

export default function TotalRadiosCard() {
  const [totalRadios, setTotalRadios] = useState(0);

  useEffect(() => {
    const fetchTotalRadios = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/radios/total");
        setTotalRadios(res.data.total);
      } catch (err) {
        console.error("Erreur lors de la récupération du total de radios :", err);
      }
    };

    fetchTotalRadios();
  }, []);

  return (
    <Card className="ml-4 w-full max-w-xs @container/card">
      <CardHeader className="relative">
        <CardDescription>Nombre total de radios</CardDescription>
        <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
          {totalRadios} <br/>
          <AddRadiosDrawer/>
        </CardTitle>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1 text-sm">
        <div className="line-clamp-1 flex gap-2 font-medium">
          {totalRadios > 0 ? "Radio Archive Active" : "Aucune radio disponible"}
          <TrendingUpIcon className="size-4" />
        </div>
      </CardFooter>
    </Card>
  );
}
