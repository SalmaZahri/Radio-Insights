import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useEffect, useState } from "react"
import axios from "axios"

export default function ProfileSheet() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [oldPassword, setOldPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  // Récupérer les infos utilisateur au montage
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token")
      if (!token) return

      try {
        const res = await axios.get("http://localhost:5000/api/user/me", {
          headers: { Authorization: `Bearer ${token}` }
        })

        setName(res.data.username)
        setEmail(res.data.email)
      } catch (err) {
        console.error("Erreur lors du chargement des données utilisateur :", err)
      }
    }

    fetchUserData()
  }, [])

  const handleSave = async () => {
    const token = localStorage.getItem("token")
    if (!token) return

    if (password !== confirmPassword) {
      alert("Les mots de passe ne correspondent pas.")
      return
    }

    try {
      await axios.put("http://localhost:5000/api/user/update", {
        username: name,
        email,
        oldPassword,
        newPassword: password
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })

      alert("Profil mis à jour avec succès !")
    } catch (err) {
      console.error("Erreur lors de la mise à jour :", err)
      alert("Échec de la mise à jour du profil.")
    }
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Modifier le profil</Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Modifier le profil</SheetTitle>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Nom</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">Email</Label>
            <Input
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="oldPassword" className="text-right">Mot de passe</Label>
            <Input
              id="oldPassword"
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="password" className="text-right">Nouveau mot de passe</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="confirmPassword" className="text-right">Confirmer le mot de passe</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="col-span-3"
            />
          </div>
          <Button onClick={handleSave}>Enregistrer</Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}