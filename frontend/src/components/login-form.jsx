import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export function LoginForm({ className, ...props }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      const { token } = response.data;

      // Stocker le token (dans localStorage, ou cookie si tu préfères)
      localStorage.setItem("token", token);

      // Rediriger vers la page profil ou dashboard
      navigate("/");
    } catch (err) {
      console.error("Erreur de connexion :", err);
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Connectez-vous à votre compte</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Entrez votre email ci-dessous pour vous connecter à votre compte
        </p>
      </div>

      {error && (
        <div className="text-red-500 text-sm text-center">
          {error}
        </div>
      )}

      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="email">E-mail</Label>
          <Input className="bg-white" 
            id="email"
            type="email"
            placeholder="exemple@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Mot de passe</Label>
            
          </div>
          <Input className="bg-white" 
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button type="submit" className="w-full">
          Se connecter
        </Button>

        
    
      </div>

      <div className="text-center text-sm">
        Vous n'avez pas de compte ?{" "}
        <Link to="/register" className="underline underline-offset-4">
          Inscrivez-vous
        </Link>
      </div>
    </form>
  );
}
