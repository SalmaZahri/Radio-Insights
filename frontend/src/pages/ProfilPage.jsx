import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function ProfilPage() {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    photo: "",
  });
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
    }
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/user/me", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error("Session expirée. Veuillez vous reconnecter.");
          }
          throw new Error("Erreur lors de la récupération des données utilisateur.");
        }

        const json = await response.json();
        const user = json.data.user;
        setUserData({
          name: user.username,
          email: user.email,
          photo: "", // par défaut
        });
      } catch (error) {
        console.error("Erreur :", error);
        setMessage(error.message || "Impossible de récupérer les données utilisateur.");
      } finally {
        setIsFetching(false);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    if (id === "currentPassword" || id === "newPassword" || id === "confirmPassword") {
      setPasswords((prevPasswords) => ({ ...prevPasswords, [id]: value }));
    } else {
      setUserData((prevData) => ({ ...prevData, [id]: value }));
    }
  };

  const handlePhotoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhotoFile(file);
      setUserData((prevData) => ({
        ...prevData,
        photo: URL.createObjectURL(file),
      }));
    }
  };

  const handleSave = async () => {
    const validationErrors = {};
    if (!userData.name) validationErrors.name = "Le nom est obligatoire.";
    if (!userData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
      validationErrors.email = "Une adresse email valide est obligatoire.";
    }
    if (passwords.newPassword && passwords.newPassword !== passwords.confirmPassword) {
      validationErrors.confirmPassword = "Les nouveaux mots de passe ne correspondent pas.";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);
    setMessage("");
    try {
      const payload = {
        name: userData.name,
        email: userData.email,
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword || undefined,
      };

      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur lors de la mise à jour.");
      }

      setMessage("Profil mis à jour avec succès !");
    } catch (error) {
      console.error("Erreur :", error);
      setMessage(error.message || "Une erreur est survenue lors de la mise à jour.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return <p className="text-center mt-4">Chargement des données utilisateur...</p>;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex justify-center items-start h-full bg-gray-100 p-6">
          <Card className="flex w-full max-w-4xl rounded-xl shadow-2xl overflow-hidden bg-white">
            <div className="flex flex-col items-center bg-gray-50 p-6 w-1/3">
              <img
                src={userData.photo || "https://via.placeholder.com/150"}
                alt="Photo de profil"
                className="w-24 h-24 rounded-full border-4 border-gray-300 shadow-md mb-4"
              />
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="text-sm text-gray-500"
              />
              <p className="text-lg font-semibold text-gray-800 mt-4">{userData.name}</p>
              <p className="text-sm text-gray-500">{userData.email}</p>
            </div>

            <div className="p-6 w-2/3">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Mon Profil</h2>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="name">Nom</Label>
                  <Input id="name" value={userData.name} onChange={handleChange} />
                  {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" value={userData.email} onChange={handleChange} />
                  {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                </div>

                <div>
                  <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={passwords.currentPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                  />
                </div>

                <div>
                  <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={passwords.newPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                  />
                </div>

                <div>
                  <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={passwords.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
                  )}
                </div>

                <Button
                  onClick={handleSave}
                  disabled={isLoading}
                  className={`w-full mt-4 ${isLoading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"} text-white`}
                >
                  {isLoading ? "Sauvegarde..." : "Sauvegarder les modifications"}
                </Button>

                {message && <p className="text-center mt-4 text-sm text-gray-600">{message}</p>}
              </CardContent>
            </div>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
