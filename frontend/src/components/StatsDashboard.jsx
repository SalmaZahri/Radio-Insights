// src/components/StatsDashboard.jsx
import { useState, useEffect } from "react";
import { Bar, Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement,
} from "chart.js";
import { Card, CardContent } from "@/components/ui/card";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement
);

export default function StatsDashboard() {
  const [authorData, setAuthorData] = useState({
    labels: [],
    datasets: [{ label: "Nombre de pistes", data: [], backgroundColor: "#8B5CF6" }],
  });

  const [albumDurationData, setAlbumDurationData] = useState({
    labels: [],
    datasets: [{ label: "Durée moyenne (minutes)", data: [], backgroundColor: "#F59E0B" }],
  });

  const [onlineOfflineData, setOnlineOfflineData] = useState({
    labels: ["En ligne", "Hors ligne"],
    datasets: [{ label: "Répartition des pistes", data: [], backgroundColor: ["#10B981", "#EF4444"] }],
  });

  const [topRadiosData, setTopRadiosData] = useState({
    labels: [],
    datasets: [
      {
        label: "Écoutes",
        data: [],
        borderColor: "#3B82F6",
        backgroundColor: "#DBEAFE",
        fill: true,
      },
    ],
  });

  // Nouveau state pour les inscriptions par jour
  const [usersByDayData, setUsersByDayData] = useState({
    labels: [],
    datasets: [
      {
        label: "Inscriptions",
        data: [],
        backgroundColor: "#3B82F6", // bleu
      },
    ],
  });

  // Nouveau state pour les émissions ajoutées par jour (remplace authorData)
  const [radiosByDayData, setRadiosByDayData] = useState({
    labels: [],
    datasets: [
      {
        label: "Émissions ajoutées",
        data: [],
        backgroundColor: "#8B5CF6",
      },
    ],
  });

  useEffect(() => {
    // Fetch Top Authors -- on ne l'utilise plus, mais garde pour fallback ou futur
    fetch("/api/stats/top-authors")
      .then((res) => res.json())
      .then((data) => {
        // on ne modifie pas authorData car on remplace le graph
        setAuthorData({
          labels: data.map((item) => item.author),
          datasets: [
            {
              label: "Nombre de pistes",
              data: data.map((item) => item.count),
              backgroundColor: "#8B5CF6",
            },
          ],
        });
      })
      .catch((err) => {
        console.error("Error fetching top authors:", err);
        setAuthorData({
          labels: ["Author A", "Author B", "Author C", "Author D", "Author E"],
          datasets: [
            {
              label: "Nombre de pistes",
              data: [25, 20, 15, 10, 5],
              backgroundColor: "#8B5CF6",
            },
          ],
        });
      });

    // Fetch Top Radios
    fetch("/api/radios/top-radios")
      .then((res) => res.json())
      .then((data) => {
        setTopRadiosData({
          labels: data.map((item) => item.title),
          datasets: [
            {
              label: "Écoutes",
              data: data.map((item) => item.total_views),
              borderColor: "#3B82F6",
              backgroundColor: "#DBEAFE",
              fill: true,
            },
          ],
        });
      })
      .catch((err) => {
        console.error("Erreur top-radios:", err);
      });

    // Fetch Average Duration by Album
    fetch("/api/stats/avg-duration-by-album")
      .then((res) => res.json())
      .then((data) => {
        setAlbumDurationData({
          labels: data.map((item) => item.album),
          datasets: [
            {
              label: "Durée moyenne (minutes)",
              data: data.map((item) => item.avgDuration),
              backgroundColor: "#F59E0B",
            },
          ],
        });
      })
      .catch((err) => {
        console.error("Error fetching album durations:", err);
        setAlbumDurationData({
          labels: ["Album 1", "Album 2", "Album 3", "Album 4", "Album 5"],
          datasets: [
            {
              label: "Durée moyenne (minutes)",
              data: [4.5, 3.8, 5.2, 2.9, 4.1],
              backgroundColor: "#F59E0B",
            },
          ],
        });
      });

    // Fetch Online vs Offline Tracks
    fetch("/api/stats/online-offline")
      .then((res) => res.json())
      .then((data) => {
        setOnlineOfflineData({
          labels: ["En ligne", "Hors ligne"],
          datasets: [
            {
              label: "Répartition des pistes",
              data: [data.online, data.offline],
              backgroundColor: ["#10B981", "#EF4444"],
            },
          ],
        });
      })
      .catch((err) => {
        console.error("Error fetching online/offline stats:", err);
        setOnlineOfflineData({
          labels: ["En ligne", "Hors ligne"],
          datasets: [
            {
              label: "Répartition des pistes",
              data: [70, 30],
              backgroundColor: ["#10B981", "#EF4444"],
            },
          ],
        });
      });

    // Fetch Users Registered By Day
    fetch("http://localhost:5000/api/user/registrations-per-day")
      .then((res) => res.json())
      .then((data) => {
        setUsersByDayData({
          labels: data.map((item) => item.date),
          datasets: [
            {
              label: "Inscriptions",
              data: data.map((item) => item.count),
              backgroundColor: "#3B82F6",
            },
          ],
        });
      })
      .catch((err) => {
        console.error("Erreur users-by-day:", err);
        setUsersByDayData({
          labels: ["2025-06-01", "2025-06-02", "2025-06-03", "2025-06-04", "2025-06-05"],
          datasets: [
            {
              label: "Inscriptions",
              data: [5, 8, 3, 6, 10],
              backgroundColor: "#3B82F6",
            },
          ],
        });
      });

    // Fetch Radios Added By Day (nouveau)
    fetch("http://localhost:5000/api/radios-per-day")
      .then((res) => res.json())
      .then((data) => {
        setRadiosByDayData({
          labels: data.map((item) => item.date),
          datasets: [
            {
              label: "Émissions ajoutées",
              data: data.map((item) => item.count),
              backgroundColor: "#8B5CF6",
            },
          ],
        });
      })
      .catch((err) => {
        console.error("Erreur radios-by-day:", err);
        setRadiosByDayData({
          labels: ["01/06/2025", "02/06/2025", "03/06/2025", "04/06/2025", "05/06/2025"],
          datasets: [
            {
              label: "Émissions ajoutées",
              data: [2, 5, 3, 4, 6],
              backgroundColor: "#8B5CF6",
            },
          ],
        });
      });
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      <Card>
        <CardContent className="p-4">
          <h2 className="text-lg font-semibold mb-4">Nombre d'inscriptions par jour</h2>
          <Bar data={usersByDayData} />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <h2 className="text-lg font-semibold mb-4">Top 5 des émissions les plus écoutées</h2>
          <Line data={topRadiosData} />
        </CardContent>
      </Card>

      {/* Remplacement ici : affichage des émissions ajoutées par jour */}
      <Card>
        <CardContent className="p-4">
          <h2 className="text-lg font-semibold mb-4">Émissions ajoutées par jour</h2>
          <Bar data={radiosByDayData} />
        </CardContent>
      </Card>
    </div>
  );
}
