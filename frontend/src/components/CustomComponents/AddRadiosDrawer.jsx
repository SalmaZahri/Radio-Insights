import React, { useState } from "react";
import axios from "axios";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function AddRadiosDrawer() {
  const [form, setForm] = useState({
    title_id: "",
    title: "",
    soundfile_name: "",
    author: "",
    duree: "",
    is_online: true,
    record_date: "",
    last_modif_time: "",
    interpret: "",
    keywords: "",
    compagny_disp_name: "",
    album_disp_name: "",
    commentaire1: "",
    commentaire2: "",
    class_code: "",
    class_name: "",
    class_id: "",
    act: "",
    composer: "",
    creator: "",
    custom1: "",
    custom2: "",
    label_reference: "",
    oeuvre: "",
    orchestra: "",
    conductor: "",
    language: "",
    voice: "",
    period: "",
    soundfile_link: ""
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async () => {
    try {
      await axios.post("http://localhost:5000/api/radios/add", form, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      alert("Radio ajoutée avec succès !");
    } catch (error) {
      console.error("Erreur lors de l'ajout:", error);
      alert("Erreur lors de l'ajout de la radio.");
    }
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="default">Ajouter une radio</Button>
      </DrawerTrigger>

      <DrawerContent className="h-[90vh] overflow-y-auto overflow-x-hidden px-6 py-4" side="bottom">
  <DrawerHeader>
    <DrawerTitle>Ajouter une nouvelle radio</DrawerTitle>
    <DrawerDescription>Remplissez les champs ci-dessous.</DrawerDescription>
  </DrawerHeader>

  <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-8 gap-4 w-full">
      {Object.keys(form).map((key) => (
        <div key={key} className="flex flex-col gap-1 w-full">
          <label htmlFor={key} className="capitalize font-medium text-sm">
            {key.replaceAll("_", " ")}
          </label>
          {key === "commentaire1" || key === "commentaire2" ? (
            <Textarea
              id={key}
              name={key}
              value={form[key]}
              onChange={handleChange}
              rows={3}
              className="resize-none w-full h-[80px]"
            />
          ) : key === "is_online" ? (
            <div className="flex items-center gap-2 mt-1">
              <input
                id={key}
                type="checkbox"
                name={key}
                checked={form[key]}
                onChange={handleChange}
                className="h-4 w-4"
              />
              <label htmlFor={key} className="text-sm">Visible en ligne</label>
            </div>
          ) : (
            <Input
              id={key}
              type="text"
              name={key}
              value={form[key]}
              onChange={handleChange}
              className="w-full h-10"
            />
          )}
        </div>
      ))}
    </div>

    <div className="flex mt-5">
      <Button type="submit">Enregistrer</Button>
    </div>
  </form>
</DrawerContent>
    </Drawer>
  );
}
